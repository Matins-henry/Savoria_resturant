import express, { Request, Response } from 'express';
import User from '../models/User';
import { generateToken, protect } from '../middleware/auth';
import crypto from 'crypto';

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Create user
        const user = await User.create({ name, email, password });

        // Generate token
        const token = generateToken(user._id.toString(), user.role);

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token
        });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        // Find user and include password
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Generate token
        const token = generateToken(user._id.toString(), user.role);

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
            token
        });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

// @route   GET /api/auth/me
// @desc    Get current user profile
// @access  Private
router.get('/me', protect, async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.user?._id);
        res.json(user);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', protect, async (req: Request, res: Response) => {
    try {
        const { name, phone, avatar } = req.body;

        const user = await User.findByIdAndUpdate(
            req.user?._id,
            { name, phone, avatar },
            { new: true, runValidators: true }
        );

        res.json(user);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

// @route   POST /api/auth/addresses
// @desc    Add new address
// @access  Private
router.post('/addresses', protect, async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.user?._id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        user.addresses.push(req.body);
        await user.save();

        res.json(user);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

// @route   PUT /api/auth/addresses/:addressId
// @desc    Update address
// @access  Private
router.put('/addresses/:addressId', protect, async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.user?._id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const addressIndex = user.addresses.findIndex((addr: any) => addr._id.toString() === req.params.addressId);
        if (addressIndex === -1) {
            return res.status(404).json({ error: 'Address not found' });
        }

        user.addresses[addressIndex] = { ...user.addresses[addressIndex], ...req.body };
        await user.save();

        res.json(user);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

// @route   DELETE /api/auth/addresses/:addressId
// @desc    Delete address
// @access  Private
router.delete('/addresses/:addressId', protect, async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.user?._id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        user.addresses = user.addresses.filter((addr: any) => addr._id.toString() !== req.params.addressId);
        await user.save();

        res.json(user);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

// @route   PUT /api/auth/update-password
// @desc    Update user password
// @access  Private
router.put('/update-password', protect, async (req: Request, res: Response) => {
    try {
        const { currentPassword, newPassword } = req.body;

        // Get user with password
        const user = await User.findById(req.user?._id).select('+password');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check current password
        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(401).json({ error: 'Incorrect current password' });
        }

        // Update password (pre-save hook will hash it)
        user.password = newPassword;
        await user.save();

        res.json({ message: 'Password updated successfully' });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

// @route   POST /api/auth/forgot-password
// @desc    Forgot password
// @access  Public
router.post('/forgot-password', async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: 'There is no user with that email' });
        }

        const resetToken = crypto.randomBytes(20).toString('hex');

        // Hash token and set to resetPasswordToken field (simple hash for DB storage)
        // For simplicity in this project, we'll store the token directly or a simple hash.
        // Let's store it directly for now as we don't have a crypto lib imported besides builtin node crypto if we used it.
        // We can just use the token strictly.

        user.resetPasswordToken = resetToken; // In a real app, hash this
        user.resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        await user.save({ validateBeforeSave: false });

        // Create reset url
        // Assuming client runs on port 5173
        const resetUrl = `${req.protocol}://localhost:5173/reset-password/${resetToken}`;

        const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

        console.log('====================================');
        console.log('PASSWORD RESET LINK (SIMULATED EMAIL):');
        console.log(resetUrl);
        console.log('====================================');

        res.status(200).json({ success: true, data: 'Email sent' });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// @route   PUT /api/auth/reset-password/:resetToken
// @desc    Reset password
// @access  Public
router.put('/reset-password/:resetToken', async (req: Request, res: Response) => {
    try {
        // Get hashed token
        const resetPasswordToken = req.params.resetToken;

        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ error: 'Invalid token' });
        }

        // Set new password
        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        // Log user in properly? Or just send success.
        // Usually just send success and make them login.
        // Or send token.

        const token = generateToken(user._id.toString(), user.role);

        res.status(200).json({
            success: true,
            token
        });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

export default router;

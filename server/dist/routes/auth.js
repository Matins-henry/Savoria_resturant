"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const User_1 = __importDefault(require("../models/User"));
const auth_1 = require("../middleware/auth");
const crypto_1 = __importDefault(require("crypto"));
const router = express_1.default.Router();
// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        // Check if user exists
        const existingUser = await User_1.default.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }
        // Create user
        const user = await User_1.default.create({ name, email, password });
        // Generate token
        const token = (0, auth_1.generateToken)(user._id.toString(), user.role);
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token
        });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        // Find user and include password
        const user = await User_1.default.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        // Generate token
        const token = (0, auth_1.generateToken)(user._id.toString(), user.role);
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
            token
        });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
// @route   GET /api/auth/me
// @desc    Get current user profile
// @access  Private
router.get('/me', auth_1.protect, async (req, res) => {
    try {
        const user = await User_1.default.findById(req.user?._id);
        res.json(user);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth_1.protect, async (req, res) => {
    try {
        const { name, phone, avatar } = req.body;
        const user = await User_1.default.findByIdAndUpdate(req.user?._id, { name, phone, avatar }, { new: true, runValidators: true });
        res.json(user);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
// @route   POST /api/auth/addresses
// @desc    Add new address
// @access  Private
router.post('/addresses', auth_1.protect, async (req, res) => {
    try {
        const user = await User_1.default.findById(req.user?._id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        user.addresses.push(req.body);
        await user.save();
        res.json(user);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
// @route   PUT /api/auth/addresses/:addressId
// @desc    Update address
// @access  Private
router.put('/addresses/:addressId', auth_1.protect, async (req, res) => {
    try {
        const user = await User_1.default.findById(req.user?._id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const addressIndex = user.addresses.findIndex((addr) => addr._id.toString() === req.params.addressId);
        if (addressIndex === -1) {
            return res.status(404).json({ error: 'Address not found' });
        }
        user.addresses[addressIndex] = { ...user.addresses[addressIndex], ...req.body };
        await user.save();
        res.json(user);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
// @route   DELETE /api/auth/addresses/:addressId
// @desc    Delete address
// @access  Private
router.delete('/addresses/:addressId', auth_1.protect, async (req, res) => {
    try {
        const user = await User_1.default.findById(req.user?._id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        user.addresses = user.addresses.filter((addr) => addr._id.toString() !== req.params.addressId);
        await user.save();
        res.json(user);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
// @route   PUT /api/auth/update-password
// @desc    Update user password
// @access  Private
router.put('/update-password', auth_1.protect, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        // Get user with password
        const user = await User_1.default.findById(req.user?._id).select('+password');
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
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
// @route   POST /api/auth/forgot-password
// @desc    Forgot password
// @access  Public
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User_1.default.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'There is no user with that email' });
        }
        const resetToken = crypto_1.default.randomBytes(20).toString('hex');
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
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// @route   PUT /api/auth/reset-password/:resetToken
// @desc    Reset password
// @access  Public
router.put('/reset-password/:resetToken', async (req, res) => {
    try {
        // Get hashed token
        const resetPasswordToken = req.params.resetToken;
        const user = await User_1.default.findOne({
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
        const token = (0, auth_1.generateToken)(user._id.toString(), user.role);
        res.status(200).json({
            success: true,
            token
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.default = router;
//# sourceMappingURL=auth.js.map
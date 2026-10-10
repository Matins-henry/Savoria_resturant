import express, { Request, Response } from 'express';
import Booking from '../models/Booking';
import { protect, adminOnly } from '../middleware/auth';

const router = express.Router();

// @route   POST /api/bookings
// @desc    Create a new booking
// @access  Public
router.post('/', async (req: Request, res: Response) => {
    try {
        const booking = await Booking.create(req.body);
        res.status(201).json(booking);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

// @route   GET /api/bookings
// @desc    Get all bookings
// @access  Admin
router.get('/', protect, adminOnly, async (req: Request, res: Response) => {
    try {
        console.log('GET /api/bookings request received');
        const bookings = await Booking.find().sort('-createdAt');
        console.log(`Found ${bookings.length} bookings`);
        res.json(bookings);
    } catch (error: any) {
        console.error('Error in GET /api/bookings:', error);
        res.status(400).json({ error: error.message });
    }
});

// @route   PATCH /api/bookings/:id/status
// @desc    Update booking status
// @access  Admin
router.patch('/:id/status', protect, adminOnly, async (req: Request, res: Response) => {
    try {
        const { status } = req.body;
        const booking = await Booking.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        res.json(booking);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

export default router;

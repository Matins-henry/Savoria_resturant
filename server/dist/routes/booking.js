"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Booking_1 = __importDefault(require("../models/Booking"));
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// @route   POST /api/bookings
// @desc    Create a new booking
// @access  Public
router.post('/', async (req, res) => {
    try {
        const booking = await Booking_1.default.create(req.body);
        res.status(201).json(booking);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
// @route   GET /api/bookings
// @desc    Get all bookings
// @access  Admin
router.get('/', auth_1.protect, auth_1.adminOnly, async (req, res) => {
    try {
        console.log('GET /api/bookings request received');
        const bookings = await Booking_1.default.find().sort('-createdAt');
        console.log(`Found ${bookings.length} bookings`);
        res.json(bookings);
    }
    catch (error) {
        console.error('Error in GET /api/bookings:', error);
        res.status(400).json({ error: error.message });
    }
});
// @route   PATCH /api/bookings/:id/status
// @desc    Update booking status
// @access  Admin
router.patch('/:id/status', auth_1.protect, auth_1.adminOnly, async (req, res) => {
    try {
        const { status } = req.body;
        const booking = await Booking_1.default.findByIdAndUpdate(req.params.id, { status }, { new: true });
        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }
        res.json(booking);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
exports.default = router;
//# sourceMappingURL=booking.js.map
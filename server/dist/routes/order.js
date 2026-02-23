"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Order_1 = __importDefault(require("../models/Order"));
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// @route   GET /api/orders
// @desc    Get orders (user gets their orders, admin gets all)
// @access  Private
router.get('/', auth_1.protect, async (req, res) => {
    try {
        const query = req.user?.role === 'admin'
            ? {}
            : { user: req.user?._id };
        const orders = await Order_1.default.find(query)
            .sort('-createdAt')
            .limit(50);
        res.json(orders);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
// @route   GET /api/orders/:id
// @desc    Get single order
// @access  Private
router.get('/:id', auth_1.protect, async (req, res) => {
    try {
        const order = await Order_1.default.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        // Check ownership (unless admin)
        if (req.user?.role !== 'admin' &&
            order.user.toString() !== req.user?._id.toString()) {
            return res.status(403).json({ error: 'Not authorized' });
        }
        res.json(order);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
// @route   POST /api/orders
// @desc    Create new order
// @access  Private
router.post('/', auth_1.protect, async (req, res) => {
    try {
        const { items, deliveryAddress, contactInfo, paymentMethod, notes } = req.body;
        // Calculate totals
        const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const tax = subtotal * 0.08; // 8% tax
        const deliveryFee = subtotal > 50 ? 0 : 5.99; // Free delivery over $50
        const total = subtotal + tax + deliveryFee;
        const order = await Order_1.default.create({
            user: req.user?._id,
            items,
            subtotal,
            tax,
            deliveryFee,
            total,
            paymentMethod,
            deliveryAddress,
            contactInfo,
            notes,
            status: 'pending',
            paymentStatus: 'paid' // Mock: assume payment successful
        });
        res.status(201).json(order);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
// @route   PATCH /api/orders/:id/status
// @desc    Update order status
// @access  Admin
router.patch('/:id/status', auth_1.protect, auth_1.adminOnly, async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }
        const order = await Order_1.default.findByIdAndUpdate(req.params.id, { status }, { new: true });
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        res.json(order);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
// @route   DELETE /api/orders/:id
// @desc    Cancel order
// @access  Private
router.delete('/:id', auth_1.protect, async (req, res) => {
    try {
        const order = await Order_1.default.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        // Only allow cancellation of pending orders
        if (order.status !== 'pending') {
            return res.status(400).json({ error: 'Cannot cancel order that is already being processed' });
        }
        // Check ownership (unless admin)
        if (req.user?.role !== 'admin' &&
            order.user.toString() !== req.user?._id.toString()) {
            return res.status(403).json({ error: 'Not authorized' });
        }
        order.status = 'cancelled';
        await order.save();
        res.json({ message: 'Order cancelled', order });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
exports.default = router;
//# sourceMappingURL=order.js.map
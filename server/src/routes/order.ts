import express, { Request, Response } from 'express';
import Order from '../models/Order';
import { protect, adminOnly } from '../middleware/auth';

const router = express.Router();

// @route   GET /api/orders
// @desc    Get orders (user gets their orders, admin gets all)
// @access  Private
router.get('/', protect, async (req: Request, res: Response) => {
    try {
        const query = req.user?.role === 'admin'
            ? {}
            : { user: req.user?._id };

        const orders = await Order.find(query)
            .sort('-createdAt')
            .limit(50);

        res.json(orders);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

// @route   GET /api/orders/:id
// @desc    Get single order
// @access  Private
router.get('/:id', protect, async (req: Request, res: Response) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        // Check ownership (unless admin)
        if (req.user?.role !== 'admin' &&
            order.user.toString() !== req.user?._id.toString()) {
            return res.status(403).json({ error: 'Not authorized' });
        }

        res.json(order);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

// @route   POST /api/orders
// @desc    Create new order
// @access  Private
router.post('/', protect, async (req: Request, res: Response) => {
    try {
        const { items, deliveryAddress, contactInfo, paymentMethod, notes } = req.body;

        // Calculate totals
        const subtotal = items.reduce((sum: number, item: any) =>
            sum + (item.price * item.quantity), 0);
        const deliveryFee = subtotal >= 50000 ? 0 : 2000; // Free delivery over ₦50,000
        const total = subtotal + deliveryFee;

        const order = await Order.create({
            user: req.user?._id,
            items,
            subtotal,
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
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

// @route   PATCH /api/orders/:id/status
// @desc    Update order status
// @access  Admin
router.patch('/:id/status', protect, adminOnly, async (req: Request, res: Response) => {
    try {
        const { status } = req.body;

        const validStatuses = ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }

        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        res.json(order);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

// @route   DELETE /api/orders/:id
// @desc    Cancel order
// @access  Private
router.delete('/:id', protect, async (req: Request, res: Response) => {
    try {
        const order = await Order.findById(req.params.id);

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
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

export default router;

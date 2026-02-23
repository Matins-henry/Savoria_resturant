"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const User_1 = __importDefault(require("../models/User"));
const Order_1 = __importDefault(require("../models/Order"));
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// @route   GET /api/admin/stats
// @desc    Get dashboard statistics for admin
// @access  Admin
router.get('/stats', auth_1.protect, auth_1.adminOnly, async (req, res) => {
    try {
        const totalUsers = await User_1.default.countDocuments();
        const totalOrdersCount = await Order_1.default.countDocuments();
        // Calculate total revenue and active orders
        const orders = await Order_1.default.find({ status: { $ne: 'cancelled' } });
        const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
        const activeOrders = await Order_1.default.countDocuments({
            status: { $in: ['pending', 'preparing', 'ready'] }
        });
        // 1. Revenue by Day (Last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const revenueByDay = await Order_1.default.aggregate([
            { $match: { createdAt: { $gte: thirtyDaysAgo }, status: { $ne: 'cancelled' } } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    revenue: { $sum: "$total" }
                }
            },
            { $sort: { _id: 1 } }
        ]);
        // 2. Top Selling Dishes
        const topDishes = await Order_1.default.aggregate([
            { $match: { status: { $ne: 'cancelled' } } },
            { $unwind: "$items" },
            {
                $group: {
                    _id: "$items.name",
                    count: { $sum: "$items.quantity" },
                    revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } }
                }
            },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ]);
        // 3. Category Distribution
        const categoryStats = await Order_1.default.aggregate([
            { $match: { status: { $ne: 'cancelled' } } },
            { $unwind: "$items" },
            {
                $group: {
                    _id: "$items.category",
                    count: { $sum: "$items.quantity" }
                }
            }
        ]);
        res.json({
            totalUsers,
            totalOrders: totalOrdersCount,
            totalRevenue,
            activeOrders,
            revenueByDay,
            topDishes,
            categoryStats
        });
    }
    catch (error) {
        console.error('[AdminStats] Error fetching stats:', error);
        res.status(400).json({ error: error.message });
    }
});
// @route   GET /api/admin/users
// @desc    Get all users with order counts
// @access  Admin
router.get('/users', auth_1.protect, auth_1.adminOnly, async (req, res) => {
    try {
        console.log('[AdminUsers] Fetching users (customers only)...');
        // Filter to show only 'user' role
        const users = await User_1.default.find({ role: 'user' }).sort({ createdAt: -1 }).lean();
        console.log(`[AdminUsers] Found ${users.length} customers via find()`);
        // Manually populate order counts (inefficient but safe for debugging)
        const usersWithCounts = await Promise.all(users.map(async (user) => {
            const ordersCount = await Order_1.default.countDocuments({ user: user._id });
            return {
                ...user,
                ordersCount
            };
        }));
        res.json(usersWithCounts);
    }
    catch (error) {
        console.error('[AdminUsers] Error fetching users:', error);
        res.status(400).json({ error: error.message });
    }
});
// @route   PATCH /api/admin/users/:id/block
// @desc    Block or unblock a user
// @access  Admin
router.patch('/users/:id/block', auth_1.protect, auth_1.adminOnly, async (req, res) => {
    try {
        const { isBlocked } = req.body;
        const user = await User_1.default.findByIdAndUpdate(req.params.id, { isBlocked }, { new: true });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        console.log(`[AdminUsers] User ${user.email} isBlocked set to ${isBlocked}`);
        res.json(user);
    }
    catch (error) {
        console.error('[AdminUsers] Error blocking user:', error);
        res.status(400).json({ error: error.message });
    }
});
exports.default = router;
//# sourceMappingURL=admin.js.map
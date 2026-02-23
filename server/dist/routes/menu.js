"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const MenuItem_1 = __importDefault(require("../models/MenuItem"));
const Review_1 = __importDefault(require("../models/Review"));
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// @route   GET /api/menu
// @desc    Get all menu items
// @access  Public
router.get('/', async (req, res) => {
    try {
        const { category, search, featured, available } = req.query;
        // Build query
        const query = {};
        if (category && category !== 'all') {
            query.category = category;
        }
        if (search) {
            query.$text = { $search: search };
        }
        if (featured === 'true') {
            query.isFeatured = true;
        }
        if (available === 'true') {
            query.isAvailable = true;
        }
        const items = await MenuItem_1.default.find(query).sort('-createdAt');
        res.json(items);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
// @route   GET /api/menu/:id
// @desc    Get single menu item
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const item = await MenuItem_1.default.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ error: 'Menu item not found' });
        }
        const reviews = await Review_1.default.find({ menuItem: req.params.id })
            .populate('user', 'name avatar')
            .sort('-createdAt');
        res.json({ ...item.toObject(), reviewList: reviews });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
// @route   POST /api/menu/:id/reviews
// @desc    Add a review
// @access  Private
router.post('/:id/reviews', auth_1.protect, async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const menuItemId = req.params.id;
        const menuItem = await MenuItem_1.default.findById(menuItemId);
        if (!menuItem) {
            return res.status(404).json({ error: 'Menu item not found' });
        }
        // Check if user already reviewed
        const alreadyReviewed = await Review_1.default.findOne({
            user: req.user?._id,
            menuItem: menuItemId
        });
        if (alreadyReviewed) {
            return res.status(400).json({ error: 'You have already reviewed this item' });
        }
        const review = await Review_1.default.create({
            user: req.user?._id,
            menuItem: menuItemId,
            rating: Number(rating),
            comment
        });
        // Update MenuItem rating and reviews count
        const reviews = await Review_1.default.find({ menuItem: menuItemId });
        menuItem.reviews = reviews.length;
        menuItem.rating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;
        await menuItem.save();
        res.status(201).json(review);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
// @route   POST /api/menu
// @desc    Create menu item
// @access  Admin
router.post('/', auth_1.protect, auth_1.adminOnly, async (req, res) => {
    try {
        const item = await MenuItem_1.default.create(req.body);
        res.status(201).json(item);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
// @route   PUT /api/menu/:id
// @desc    Update menu item
// @access  Admin
router.put('/:id', auth_1.protect, auth_1.adminOnly, async (req, res) => {
    try {
        const item = await MenuItem_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!item) {
            return res.status(404).json({ error: 'Menu item not found' });
        }
        res.json(item);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
// @route   DELETE /api/menu/:id
// @desc    Delete menu item
// @access  Admin
router.delete('/:id', auth_1.protect, auth_1.adminOnly, async (req, res) => {
    try {
        const item = await MenuItem_1.default.findByIdAndDelete(req.params.id);
        if (!item) {
            return res.status(404).json({ error: 'Menu item not found' });
        }
        res.json({ message: 'Menu item deleted' });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
// @route   PATCH /api/menu/:id/availability
// @desc    Toggle menu item availability
// @access  Admin
router.patch('/:id/availability', auth_1.protect, auth_1.adminOnly, async (req, res) => {
    try {
        const item = await MenuItem_1.default.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ error: 'Menu item not found' });
        }
        item.isAvailable = !item.isAvailable;
        await item.save();
        res.json(item);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
exports.default = router;
//# sourceMappingURL=menu.js.map
import express, { Request, Response } from 'express';
import MenuItem from '../models/MenuItem';
import Review from '../models/Review';
import { protect, adminOnly } from '../middleware/auth';

const router = express.Router();

// @route   GET /api/menu
// @desc    Get all menu items
// @access  Public
router.get('/', async (req: Request, res: Response) => {
    try {
        const { category, search, featured, available } = req.query;

        // Build query
        const query: any = {};

        if (category && category !== 'all') {
            query.category = category;
        }

        if (search) {
            query.$text = { $search: search as string };
        }

        if (featured === 'true') {
            query.isFeatured = true;
        }

        if (available === 'true') {
            query.isAvailable = true;
        }

        const items = await MenuItem.find(query).sort('-createdAt');
        res.json(items);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

// @route   GET /api/menu/:id
// @desc    Get single menu item
// @access  Public
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const item = await MenuItem.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ error: 'Menu item not found' });
        }

        const reviews = await Review.find({ menuItem: req.params.id })
            .populate('user', 'name avatar')
            .sort('-createdAt');

        res.json({ ...item.toObject(), reviewList: reviews });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

// @route   POST /api/menu/:id/reviews
// @desc    Add a review
// @access  Private
router.post('/:id/reviews', protect, async (req: Request, res: Response) => {
    try {
        const { rating, comment } = req.body;
        const menuItemId = req.params.id;

        const menuItem = await MenuItem.findById(menuItemId);
        if (!menuItem) {
            return res.status(404).json({ error: 'Menu item not found' });
        }

        // Check if user already reviewed
        const alreadyReviewed = await Review.findOne({
            user: req.user?._id,
            menuItem: menuItemId
        });

        if (alreadyReviewed) {
            return res.status(400).json({ error: 'You have already reviewed this item' });
        }

        const review = await Review.create({
            user: req.user?._id,
            menuItem: menuItemId,
            rating: Number(rating),
            comment
        });

        // Update MenuItem rating and reviews count
        const reviews = await Review.find({ menuItem: menuItemId });
        menuItem.reviews = reviews.length;
        menuItem.rating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;

        await menuItem.save();

        res.status(201).json(review);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

// @route   POST /api/menu
// @desc    Create menu item
// @access  Admin
router.post('/', protect, adminOnly, async (req: Request, res: Response) => {
    try {
        const item = await MenuItem.create(req.body);
        res.status(201).json(item);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

// @route   PUT /api/menu/:id
// @desc    Update menu item
// @access  Admin
router.put('/:id', protect, adminOnly, async (req: Request, res: Response) => {
    try {
        const item = await MenuItem.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!item) {
            return res.status(404).json({ error: 'Menu item not found' });
        }
        res.json(item);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

// @route   DELETE /api/menu/:id
// @desc    Delete menu item
// @access  Admin
router.delete('/:id', protect, adminOnly, async (req: Request, res: Response) => {
    try {
        const item = await MenuItem.findByIdAndDelete(req.params.id);
        if (!item) {
            return res.status(404).json({ error: 'Menu item not found' });
        }
        res.json({ message: 'Menu item deleted' });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

// @route   PATCH /api/menu/:id/availability
// @desc    Toggle menu item availability
// @access  Admin
router.patch('/:id/availability', protect, adminOnly, async (req: Request, res: Response) => {
    try {
        const item = await MenuItem.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ error: 'Menu item not found' });
        }

        item.isAvailable = !item.isAvailable;
        await item.save();

        res.json(item);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

export default router;

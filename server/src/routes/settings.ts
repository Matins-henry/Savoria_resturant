import express, { Request, Response } from 'express';
import Settings from '../models/Settings';
import { protect, adminOnly } from '../middleware/auth';

const router = express.Router();

// @route   GET /api/settings
// @desc    Get restaurant settings (Public)
// @access  Public
router.get('/', async (req: Request, res: Response) => {
    try {
        let settings = await Settings.findOne();

        // If not initialized, create default
        if (!settings) {
            settings = await Settings.create({});
        }

        res.json(settings);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// @route   PUT /api/settings
// @desc    Update restaurant settings
// @access  Admin
router.put('/', protect, adminOnly, async (req: Request, res: Response) => {
    try {
        let settings = await Settings.findOne();

        if (!settings) {
            // Should exist from GET, but just in case
            settings = new Settings(req.body);
        } else {
            // Update fields
            // Using Object.assign to merge deep objects safely if structure matches, 
            // or just rely on mongoose set
            settings.set(req.body);
        }

        const updatedSettings = await settings.save();
        res.json(updatedSettings);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

export default router;

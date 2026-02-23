"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Settings_1 = __importDefault(require("../models/Settings"));
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// @route   GET /api/settings
// @desc    Get restaurant settings (Public)
// @access  Public
router.get('/', async (req, res) => {
    try {
        let settings = await Settings_1.default.findOne();
        // If not initialized, create default
        if (!settings) {
            settings = await Settings_1.default.create({});
        }
        res.json(settings);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// @route   PUT /api/settings
// @desc    Update restaurant settings
// @access  Admin
router.put('/', auth_1.protect, auth_1.adminOnly, async (req, res) => {
    try {
        let settings = await Settings_1.default.findOne();
        if (!settings) {
            // Should exist from GET, but just in case
            settings = new Settings_1.default(req.body);
        }
        else {
            // Update fields
            // Using Object.assign to merge deep objects safely if structure matches, 
            // or just rely on mongoose set
            settings.set(req.body);
        }
        const updatedSettings = await settings.save();
        res.json(updatedSettings);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
exports.default = router;
//# sourceMappingURL=settings.js.map
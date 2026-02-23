"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = exports.adminOnly = exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
// Protect routes - require authentication
const protect = async (req, res, next) => {
    try {
        let token;
        // Get token from header
        if (req.headers.authorization?.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
        if (!token) {
            console.log('[AuthMiddleware] No token provided in headers');
            return res.status(401).json({ error: 'Not authorized, no token' });
        }
        // Verify token
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'secret');
        // Get user from token
        const user = await User_1.default.findById(decoded.id);
        if (!user) {
            console.log('[AuthMiddleware] User not found for ID:', decoded.id);
            return res.status(401).json({ error: 'User not found' });
        }
        req.user = user;
        if (user.isBlocked) {
            console.log(`[AuthMiddleware] User ${user._id} is blocked`);
            return res.status(403).json({ error: 'Your account has been suspended. Please contact support.' });
        }
        next();
    }
    catch (error) {
        console.error('[AuthMiddleware] Token invalid:', error);
        res.status(401).json({ error: 'Not authorized, token invalid' });
    }
};
exports.protect = protect;
// Admin only middleware
const adminOnly = (req, res, next) => {
    if (req.user?.role !== 'admin') {
        console.log(`[AuthMiddleware] Access denied for user ${req.user?._id}: Role is ${req.user?.role}`);
        return res.status(403).json({ error: 'Admin access only' });
    }
    next();
};
exports.adminOnly = adminOnly;
// Generate JWT token
const generateToken = (id, role) => {
    return jsonwebtoken_1.default.sign({ id, role }, process.env.JWT_SECRET || 'secret', { expiresIn: '30d' });
};
exports.generateToken = generateToken;
//# sourceMappingURL=auth.js.map
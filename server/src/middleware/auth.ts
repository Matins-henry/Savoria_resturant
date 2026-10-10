import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';

// Extend Express Request to include user
declare global {
    namespace Express {
        interface Request {
            user?: IUser;
        }
    }
}

interface JwtPayload {
    id: string;
    role: string;
}

// Protect routes - require authentication
export const protect = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let token: string | undefined;

        // Get token from header
        if (req.headers.authorization?.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            console.log('[AuthMiddleware] No token provided in headers');
            return res.status(401).json({ error: 'Not authorized, no token' });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as JwtPayload;

        // Get user from token
        const user = await User.findById(decoded.id);
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
    } catch (error) {
        console.error('[AuthMiddleware] Token invalid:', error);
        res.status(401).json({ error: 'Not authorized, token invalid' });
    }
};

// Admin only middleware
export const adminOnly = (req: Request, res: Response, next: NextFunction) => {
    if (req.user?.role !== 'admin') {
        console.log(`[AuthMiddleware] Access denied for user ${req.user?._id}: Role is ${req.user?.role}`);
        return res.status(403).json({ error: 'Admin access only' });
    }
    next();
};

// Generate JWT token
export const generateToken = (id: string, role: string): string => {
    return jwt.sign(
        { id, role },
        process.env.JWT_SECRET || 'secret',
        { expiresIn: '30d' }
    );
};

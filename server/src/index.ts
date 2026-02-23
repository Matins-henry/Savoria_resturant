import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Load environment variables
dotenv.config();

// Import routes
import authRoutes from './routes/auth';
import menuRoutes from './routes/menu';
import orderRoutes from './routes/order';
import adminRoutes from './routes/admin';
import bookingRoutes from './routes/booking';
import settingsRoutes from './routes/settings';
import uploadRoutes from './routes/upload';

const app: Application = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());

// Main entry point message
app.get('/', (req: Request, res: Response) => {
    res.send('Savoria API is running. Please access the frontend at the client URL.');
});

// API root message
app.get('/api', (req: Request, res: Response) => {
    res.send('Savoria API root. Please use the frontend URL to view the restaurant.');
});

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
    res.json({ status: 'OK', message: 'Savoria API is running' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/upload', uploadRoutes);

// Serve static files
app.use('/uploads', express.static('uploads'));

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Connect to MongoDB and start server
const startServer = async () => {
    try {
        const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/savoria';
        await mongoose.connect(mongoUri);
        console.log('✅ MongoDB Connected');

        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        // Start server anyway for development without DB
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT} (without DB)`);
        });
    }
};

startServer();

export default app;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
// Load environment variables
dotenv_1.default.config();
// Import routes
const auth_1 = __importDefault(require("./routes/auth"));
const menu_1 = __importDefault(require("./routes/menu"));
const order_1 = __importDefault(require("./routes/order"));
const admin_1 = __importDefault(require("./routes/admin"));
const booking_1 = __importDefault(require("./routes/booking"));
const settings_1 = __importDefault(require("./routes/settings"));
const upload_1 = __importDefault(require("./routes/upload"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Middleware
app.use((0, cors_1.default)({
    origin: 'http://localhost:5173', // Vite dev server
    credentials: true
}));
app.use(express_1.default.json());
// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Savoria API is running' });
});
// Routes
app.use('/api/auth', auth_1.default);
app.use('/api/menu', menu_1.default);
app.use('/api/orders', order_1.default);
app.use('/api/admin', admin_1.default);
app.use('/api/bookings', booking_1.default);
app.use('/api/settings', settings_1.default);
app.use('/api/upload', upload_1.default);
// Serve static files
app.use('/uploads', express_1.default.static('uploads'));
// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});
// Connect to MongoDB and start server
const startServer = async () => {
    try {
        const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/savoria';
        await mongoose_1.default.connect(mongoUri);
        console.log('✅ MongoDB Connected');
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });
    }
    catch (error) {
        console.error('❌ MongoDB connection error:', error);
        // Start server anyway for development without DB
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT} (without DB)`);
        });
    }
};
startServer();
exports.default = app;
//# sourceMappingURL=index.js.map
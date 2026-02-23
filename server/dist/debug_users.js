"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// Load env from the same directory
dotenv_1.default.config({ path: path_1.default.join(__dirname, '../.env') });
const checkUsers = async () => {
    try {
        const uri = process.env.MONGODB_URI;
        console.log('Connecting to:', uri?.split('@')[1]); // Log safe part of URI
        if (!uri) {
            throw new Error('MONGODB_URI is undefined');
        }
        await mongoose_1.default.connect(uri);
        console.log('Connected to MongoDB');
        if (!mongoose_1.default.connection.db) {
            throw new Error('Database connection not established');
        }
        // Check collections
        const collections = await mongoose_1.default.connection.db.listCollections().toArray();
        console.log('Collections:', collections.map(c => c.name));
        // Count users directly
        const count = await mongoose_1.default.connection.db.collection('users').countDocuments();
        console.log(`Direct count of 'users' collection: ${count}`);
        // Find all users
        const users = await mongoose_1.default.connection.db.collection('users').find({}).toArray();
        console.log('Users found:', users.map(u => ({ id: u._id, name: u.name, email: u.email, role: u.role })));
    }
    catch (error) {
        console.error('Error:', error);
    }
    finally {
        await mongoose_1.default.disconnect();
    }
};
checkUsers();
//# sourceMappingURL=debug_users.js.map
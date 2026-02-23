"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// Load env
dotenv_1.default.config({ path: path_1.default.join(__dirname, '../.env') });
const promoteUser = async () => {
    try {
        const uri = process.env.MONGODB_URI;
        if (!uri)
            throw new Error('MONGODB_URI is undefined');
        await mongoose_1.default.connect(uri);
        console.log('Connected to MongoDB');
        const email = 'henrymathias03@gmail.com';
        if (!mongoose_1.default.connection.db) {
            throw new Error('Database connection not established');
        }
        // Update user role to admin
        const result = await mongoose_1.default.connection.db.collection('users').updateOne({ email: email }, { $set: { role: 'admin' } });
        if (result.matchedCount === 0) {
            console.log(`User with email ${email} not found.`);
        }
        else {
            console.log(`Successfully promoted ${email} to admin!`);
            console.log('Modified count:', result.modifiedCount);
        }
    }
    catch (error) {
        console.error('Error:', error);
    }
    finally {
        await mongoose_1.default.disconnect();
    }
};
promoteUser();
//# sourceMappingURL=promote_admin.js.map
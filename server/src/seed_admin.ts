import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import User from './models/User';

// Load env
dotenv.config({ path: path.join(__dirname, '../.env') });

const seedAdmin = async () => {
    try {
        const uri = process.env.MONGODB_URI;
        if (!uri) throw new Error('MONGODB_URI is undefined');

        await mongoose.connect(uri);
        console.log('Connected to MongoDB');

        // 1. Demote henrymathias03@gmail.com
        const demoteResult = await User.updateOne(
            { email: 'henrymathias03@gmail.com' },
            { $set: { role: 'user' } }
        );
        console.log(`Demoted henrymathias03: ${demoteResult.modifiedCount > 0 ? 'Success' : 'No change'}`);

        // 2. Create/Update Fixed Admin
        const adminEmail = 'admin@savoria.com';
        const adminPassword = 'admin123'; // Logic will hash this on save if we create new instance

        const existingAdmin = await User.findOne({ email: adminEmail });

        if (existingAdmin) {
            console.log('Admin user already exists. Updating role/password...');
            existingAdmin.role = 'admin';
            existingAdmin.password = adminPassword; // Triggers pre-save hash
            await existingAdmin.save();
        } else {
            console.log('Creating new Admin user...');
            await User.create({
                name: 'Savoria Admin',
                email: adminEmail,
                password: adminPassword,
                role: 'admin',
                avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=f59e0b&color=fff'
            });
        }

        console.log('Admin user ready:', adminEmail);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
};

seedAdmin();

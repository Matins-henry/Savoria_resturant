import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Load env
dotenv.config({ path: path.join(__dirname, '../.env') });

const promoteUser = async () => {
    try {
        const uri = process.env.MONGODB_URI;
        if (!uri) throw new Error('MONGODB_URI is undefined');

        await mongoose.connect(uri);
        console.log('Connected to MongoDB');

        const email = 'henrymathias03@gmail.com';

        if (!mongoose.connection.db) {
            throw new Error('Database connection not established');
        }

        // Update user role to admin
        const result = await mongoose.connection.db.collection('users').updateOne(
            { email: email },
            { $set: { role: 'admin' } }
        );

        if (result.matchedCount === 0) {
            console.log(`User with email ${email} not found.`);
        } else {
            console.log(`Successfully promoted ${email} to admin!`);
            console.log('Modified count:', result.modifiedCount);
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
};

promoteUser();

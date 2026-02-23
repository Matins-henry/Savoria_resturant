import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Load env from the same directory
dotenv.config({ path: path.join(__dirname, '../.env') });

const checkUsers = async () => {
    try {
        const uri = process.env.MONGODB_URI;
        console.log('Connecting to:', uri?.split('@')[1]); // Log safe part of URI

        if (!uri) {
            throw new Error('MONGODB_URI is undefined');
        }

        await mongoose.connect(uri);
        console.log('Connected to MongoDB');

        if (!mongoose.connection.db) {
            throw new Error('Database connection not established');
        }

        // Check collections
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('Collections:', collections.map(c => c.name));

        // Count users directly
        const count = await mongoose.connection.db.collection('users').countDocuments();
        console.log(`Direct count of 'users' collection: ${count}`);

        // Find all users
        const users = await mongoose.connection.db.collection('users').find({}).toArray();
        console.log('Users found:', users.map(u => ({ id: u._id, name: u.name, email: u.email, role: u.role })));

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
};

checkUsers();

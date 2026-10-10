const mongoose = require('mongoose');
require('dotenv').config({ path: './server/.env' });

async function debugDB() {
    const uri = process.env.MONGODB_URI;
    console.log('Connecting to URI (masked):', uri.replace(/:([^@]+)@/, ':****@'));

    try {
        await mongoose.connect(uri);
        const db = mongoose.connection.db;
        console.log('--- DB INFO ---');
        console.log('Database Name:', db.databaseName);

        const collections = await db.listCollections().toArray();
        console.log('Collections:', collections.map(c => c.name));

        for (const col of collections) {
            const count = await db.collection(col.name).countDocuments();
            console.log(`Count in [${col.name}]:`, count);
        }

        await mongoose.disconnect();
    } catch (err) {
        console.error('Connection Error:', err);
    }
}

debugDB();

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import MenuItem from './models/MenuItem';

dotenv.config();

const menuItems = [
    {
        name: "Smokey Jollof Rice",
        description: "The pride of Nigeria. Long-grain parboiled rice cooked in a rich, smokey tomato and bell pepper sauce. Served with crispy fried chicken and sweet dodo (plantain).",
        price: 8500,
        image: "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=500&h=400&fit=crop",
        category: "main",
        rating: 4.9,
        reviews: 245,
        isFeatured: true,
        prepTime: 30,
        calories: 750,
        isAvailable: true
    },
    {
        name: "Egusi Soup & Pounded Yam",
        description: "Rich melon seed soup cooked with spinach, palm oil, and assorted meats (beef, shaki, cow leg). Served with smooth, fluffy pounded yam.",
        price: 12500,
        image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=500&h=400&fit=crop",
        category: "main",
        rating: 4.8,
        reviews: 182,
        isFeatured: true,
        prepTime: 25,
        calories: 920,
        isAvailable: true
    },
    {
        name: "Abula (Amala & Ewedu)",
        description: "Traditional Yoruba delight. Soft Amala served with Gbegiri (bean soup), Ewedu (jute leaves), and a spicy tomato stew with tender goat meat.",
        price: 9500,
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&h=400&fit=crop", // placeholder
        category: "main",
        rating: 4.9,
        reviews: 134,
        prepTime: 20,
        calories: 680,
        isAvailable: true
    },
    {
        name: "Premium Beef Suya",
        description: "Traditional Hausa spicy grilled beef skewers. Sliced thin and coated in Yaji (peanut-based spice). Served with red onions and tomatoes.",
        price: 6500,
        image: "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=500&h=400&fit=crop",
        category: "appetizer",
        rating: 4.7,
        reviews: 312,
        isFeatured: true,
        prepTime: 15,
        calories: 450,
        isAvailable: true
    },
    {
        name: "Ofe Akwu (Banga Stew)",
        description: "Luxurious palm fruit stew from the Niger Delta, flavored with scent leaves and native spices. Served with fresh catfish and white rice.",
        price: 14500,
        image: "https://images.unsplash.com/photo-1546245389-9943468b2e3c?w=500&h=400&fit=crop",
        category: "main",
        rating: 4.9,
        reviews: 98,
        prepTime: 40,
        calories: 820,
        isAvailable: true
    },
    {
        name: "Grilled Snapper & Boli",
        description: "Whole red snapper charcoal-grilled with Nigerian spices. Served with roasted ripe plantain (boli) and a spicy Ube-inspired sauce.",
        price: 18500,
        image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=500&h=400&fit=crop",
        category: "seafood",
        rating: 4.8,
        reviews: 76,
        isFeatured: true,
        prepTime: 35,
        calories: 580,
        isAvailable: true
    },
    {
        name: "Truffle Wagyu Steak",
        description: "Premium A5 Wagyu with black truffle butter, roasted vegetables, and aged red wine reduction. Served with truffle mashed potatoes.",
        price: 45000,
        image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&h=400&fit=crop",
        category: "main",
        rating: 4.9,
        reviews: 128,
        prepTime: 35,
        calories: 850,
        isAvailable: true
    },
    {
        name: "Seared Atlantic Salmon",
        description: "Wild-caught Atlantic salmon with lemon herb crust, grilled asparagus, and champagne beurre blanc sauce.",
        price: 28000,
        image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=500&h=400&fit=crop",
        category: "seafood",
        rating: 4.8,
        reviews: 96,
        prepTime: 25,
        calories: 520,
        isAvailable: true
    },
    {
        name: "Duck Confit",
        description: "8-hour slow-cooked duck leg with cherry gastrique, truffle potato gratin, and wilted baby spinach.",
        price: 32000,
        image: "https://images.unsplash.com/photo-1432139555190-58524dae6a55?w=500&h=400&fit=crop",
        category: "main",
        rating: 4.7,
        reviews: 72,
        prepTime: 45,
        calories: 720,
        isAvailable: true
    },
    {
        name: "Chocolate Soufflé",
        description: "Warm Valrhona 70% dark chocolate soufflé with Madagascar vanilla bean ice cream and raspberry coulis.",
        price: 9500,
        image: "https://images.unsplash.com/photo-1541783245831-57d6fb0926d3?w=500&h=400&fit=crop",
        category: "desserts",
        rating: 4.9,
        reviews: 156,
        prepTime: 20,
        calories: 380,
        isAvailable: true
    },
    {
        name: "Beef Carpaccio",
        description: "Paper-thin sliced prime beef with wild arugula, capers, aged parmesan, and white truffle oil.",
        price: 15000,
        image: "https://images.unsplash.com/photo-1588168333986-5078d3ae3976?w=500&h=400&fit=crop",
        category: "appetizer",
        rating: 4.7,
        reviews: 53,
        prepTime: 15,
        calories: 280,
        isAvailable: true
    },
    {
        name: "Vintage Wine Selection",
        description: "Curated selection of premium wines from renowned vineyards in Burgundy, Napa Valley, and Tuscany.",
        price: 65000,
        image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=500&h=400&fit=crop",
        category: "drinks",
        rating: 4.9,
        reviews: 67,
        isAvailable: true
    }
];

const seedDB = async () => {
    try {
        const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/savoria';
        await mongoose.connect(mongoUri);
        console.log('✅ Connected to MongoDB');

        await MenuItem.deleteMany({});
        console.log('🗑️  Cleared Menu collection');

        await MenuItem.insertMany(menuItems);
        console.log('🌱 Seeded Menu collection');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

seedDB();

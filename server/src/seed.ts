import mongoose from 'mongoose';
import dotenv from 'dotenv';
import MenuItem from './models/MenuItem';

dotenv.config();

const menuItems = [
    {
        name: "Truffle Wagyu Steak",
        description: "Premium A5 Wagyu with black truffle butter, roasted vegetables, and aged red wine reduction. Served with truffle mashed potatoes.",
        price: 89.99,
        image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&h=400&fit=crop",
        category: "main",
        rating: 4.9,
        reviews: 128,
        isFeatured: true,
        prepTime: 35,
        calories: 850,
        isAvailable: true
    },
    {
        name: "Seared Atlantic Salmon",
        description: "Wild-caught Atlantic salmon with lemon herb crust, grilled asparagus, and champagne beurre blanc sauce.",
        price: 42.99,
        image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=500&h=400&fit=crop",
        category: "seafood",
        rating: 4.8,
        reviews: 96,
        prepTime: 25,
        calories: 520,
        isAvailable: true
    },
    {
        name: "Lobster Thermidor",
        description: "Whole Maine lobster with cognac cream sauce, aged gruyère gratin, and fresh herbs. A timeless French classic.",
        price: 75.99,
        image: "https://images.unsplash.com/photo-1559737558-2f5a35f4523b?w=500&h=400&fit=crop",
        category: "seafood",
        rating: 4.9,
        reviews: 84,
        isFeatured: true,
        prepTime: 40,
        calories: 680,
        isAvailable: true
    },
    {
        name: "Duck Confit",
        description: "8-hour slow-cooked duck leg with cherry gastrique, truffle potato gratin, and wilted baby spinach.",
        price: 48.99,
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
        price: 18.99,
        image: "https://images.unsplash.com/photo-1541783245831-57d6fb0926d3?w=500&h=400&fit=crop",
        category: "desserts",
        rating: 4.9,
        reviews: 156,
        isFeatured: true,
        prepTime: 20,
        calories: 380,
        isAvailable: true
    },
    {
        name: "Caprese Salad",
        description: "Heirloom tomatoes, imported buffalo mozzarella from Campania, fresh basil, and 25-year aged balsamic.",
        price: 16.99,
        image: "https://images.unsplash.com/photo-1608897013039-887f21d8c804?w=500&h=400&fit=crop",
        category: "appetizer",
        rating: 4.6,
        reviews: 64,
        prepTime: 10,
        calories: 220,
        isAvailable: true
    },
    {
        name: "Beef Carpaccio",
        description: "Paper-thin sliced prime beef with wild arugula, capers, aged parmesan, and white truffle oil.",
        price: 24.99,
        image: "https://images.unsplash.com/photo-1588168333986-5078d3ae3976?w=500&h=400&fit=crop",
        category: "appetizer",
        rating: 4.7,
        reviews: 53,
        prepTime: 15,
        calories: 280,
        isAvailable: true
    },
    {
        name: "Grilled Lamb Chops",
        description: "New Zealand lamb chops with rosemary garlic butter, house-made mint pesto, and roasted root vegetables.",
        price: 52.99,
        image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=500&h=400&fit=crop",
        category: "main",
        rating: 4.8,
        reviews: 89,
        prepTime: 30,
        calories: 780,
        isAvailable: true
    },
    {
        name: "Tiramisu",
        description: "Traditional Italian recipe with espresso-soaked Savoiardi, mascarpone cream, and Callebaut cocoa.",
        price: 14.99,
        image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=500&h=400&fit=crop",
        category: "desserts",
        rating: 4.8,
        reviews: 142,
        prepTime: 15,
        calories: 320,
        isAvailable: true
    },
    {
        name: "French Onion Soup",
        description: "Caramelized onion broth simmered for 8 hours, topped with crusty sourdough and melted gruyère.",
        price: 12.99,
        image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=500&h=400&fit=crop",
        category: "appetizer", // Changed from Soup to valid enum 'appetizer' temporarily or I should update enum
        rating: 4.6,
        reviews: 78,
        prepTime: 20,
        calories: 280,
        isAvailable: true
    },
    {
        name: "Oysters Rockefeller",
        description: "Fresh Blue Point oysters baked with spinach, herbs, Pernod, and buttery breadcrumbs.",
        price: 28.99,
        image: "https://images.unsplash.com/photo-1606731219412-2b5f1bbbf7a2?w=500&h=400&fit=crop",
        category: "seafood",
        rating: 4.7,
        reviews: 45,
        prepTime: 25,
        calories: 180,
        isAvailable: true
    },
    {
        name: "Vintage Wine Selection",
        description: "Curated selection of premium wines from renowned vineyards in Burgundy, Napa Valley, and Tuscany.",
        price: 65.00,
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

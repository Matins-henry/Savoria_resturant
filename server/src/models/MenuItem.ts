import mongoose, { Document, Schema } from 'mongoose';

export interface IMenuItem extends Document {
    name: string;
    description: string;
    price: number;
    category: 'appetizer' | 'main' | 'seafood' | 'vegetarian' | 'desserts' | 'drinks';
    image: string;
    rating: number;
    reviews: number;
    isAvailable: boolean;
    isFeatured: boolean;
    prepTime: number; // in minutes
    calories?: number;
    ingredients: string[];
    allergens: string[];
    createdAt: Date;
    updatedAt: Date;
}

const menuItemSchema = new Schema<IMenuItem>({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Description is required']
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price cannot be negative']
    },
    category: {
        type: String,
        enum: ['appetizer', 'main', 'seafood', 'vegetarian', 'desserts', 'drinks'],
        required: [true, 'Category is required']
    },
    image: {
        type: String,
        default: '/images/placeholder-food.jpg'
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    reviews: {
        type: Number,
        default: 0
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    prepTime: {
        type: Number,
        default: 20
    },
    calories: Number,
    ingredients: [String],
    allergens: [String]
}, {
    timestamps: true
});

// Index for search
menuItemSchema.index({ name: 'text', description: 'text' });

export default mongoose.model<IMenuItem>('MenuItem', menuItemSchema);

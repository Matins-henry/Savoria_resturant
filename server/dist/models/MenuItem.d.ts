import mongoose, { Document } from 'mongoose';
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
    prepTime: number;
    calories?: number;
    ingredients: string[];
    allergens: string[];
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<IMenuItem, {}, {}, {}, mongoose.Document<unknown, {}, IMenuItem, {}, {}> & IMenuItem & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=MenuItem.d.ts.map
import mongoose, { Document } from 'mongoose';
export interface IOrderItem {
    menuItem: mongoose.Types.ObjectId;
    name: string;
    price: number;
    quantity: number;
    image?: string;
}
export interface IOrder extends Document {
    user: mongoose.Types.ObjectId;
    items: IOrderItem[];
    status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
    subtotal: number;
    tax: number;
    deliveryFee: number;
    total: number;
    paymentMethod: 'card' | 'cash';
    paymentStatus: 'pending' | 'paid' | 'refunded';
    deliveryAddress: {
        street: string;
        city: string;
        state: string;
        zip: string;
    };
    contactInfo: {
        name: string;
        email: string;
        phone: string;
    };
    notes?: string;
    estimatedDelivery?: Date;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<IOrder, {}, {}, {}, mongoose.Document<unknown, {}, IOrder, {}, {}> & IOrder & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Order.d.ts.map
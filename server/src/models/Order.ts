import mongoose, { Document, Schema } from 'mongoose';

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

const orderSchema = new Schema<IOrder>({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [{
        menuItem: {
            type: Schema.Types.ObjectId,
            ref: 'MenuItem'
        },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true, min: 1 },
        image: String
    }],
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'],
        default: 'pending'
    },
    subtotal: {
        type: Number,
        required: true
    },
    tax: {
        type: Number,
        required: true
    },
    deliveryFee: {
        type: Number,
        default: 0
    },
    total: {
        type: Number,
        required: true
    },
    paymentMethod: {
        type: String,
        enum: ['card', 'cash'],
        default: 'card'
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'refunded'],
        default: 'pending'
    },
    deliveryAddress: {
        street: String,
        city: String,
        state: String,
        zip: String
    },
    contactInfo: {
        name: String,
        email: String,
        phone: String
    },
    notes: String,
    estimatedDelivery: Date
}, {
    timestamps: true
});

// Auto-populate user on find
orderSchema.pre(/^find/, function (next) {
    (this as mongoose.Query<any, any>).populate('user', 'name email');
    next();
});

export default mongoose.model<IOrder>('Order', orderSchema);

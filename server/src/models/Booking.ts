import mongoose from 'mongoose';

export interface IBooking extends mongoose.Document {
    user?: mongoose.Types.ObjectId;
    name: string;
    email: string;
    phone: string;
    date: string; // Storing as string YYYY-MM-DD for simplicity, or Date
    time: string;
    guests: number;
    type?: string;
    requests?: string;
    status: 'Pending' | 'Confirmed' | 'Cancelled';
    createdAt: Date;
    updatedAt: Date;
}

const bookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    guests: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        default: 'Dinner'
    },
    requests: {
        type: String
    },
    status: {
        type: String,
        enum: ['Pending', 'Confirmed', 'Cancelled'],
        default: 'Pending'
    }
}, {
    timestamps: true
});

export default mongoose.model<IBooking>('Booking', bookingSchema);

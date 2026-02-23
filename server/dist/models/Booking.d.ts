import mongoose from 'mongoose';
export interface IBooking extends mongoose.Document {
    user?: mongoose.Types.ObjectId;
    name: string;
    email: string;
    phone: string;
    date: string;
    time: string;
    guests: number;
    type?: string;
    requests?: string;
    status: 'Pending' | 'Confirmed' | 'Cancelled';
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<IBooking, {}, {}, {}, mongoose.Document<unknown, {}, IBooking, {}, {}> & IBooking & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Booking.d.ts.map
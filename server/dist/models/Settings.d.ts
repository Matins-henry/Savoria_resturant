import mongoose, { Document } from 'mongoose';
export interface ISettings extends Document {
    restaurantName: string;
    description: string;
    contact: {
        phone: string;
        email: string;
        address: string;
    };
    hours: {
        monday: string;
        tuesday: string;
        wednesday: string;
        thursday: string;
        friday: string;
        saturday: string;
        sunday: string;
    };
    delivery: {
        freeDeliveryThreshold: number;
        standardFee: number;
        taxRate: number;
        currency: string;
    };
    socials: {
        facebook: string;
        instagram: string;
        twitter: string;
    };
    updatedAt: Date;
}
declare const _default: mongoose.Model<ISettings, {}, {}, {}, mongoose.Document<unknown, {}, ISettings, {}, {}> & ISettings & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Settings.d.ts.map
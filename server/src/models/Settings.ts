import mongoose, { Document, Schema } from 'mongoose';

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

const SettingsSchema: Schema = new Schema({
    restaurantName: { type: String, required: true, default: 'Savoria' },
    description: { type: String, default: 'Fine Dining Experience' },
    contact: {
        phone: { type: String, default: '' },
        email: { type: String, default: '' },
        address: { type: String, default: '' }
    },
    hours: {
        monday: { type: String, default: '10:00 AM - 10:00 PM' },
        tuesday: { type: String, default: '10:00 AM - 10:00 PM' },
        wednesday: { type: String, default: '10:00 AM - 10:00 PM' },
        thursday: { type: String, default: '10:00 AM - 10:00 PM' },
        friday: { type: String, default: '10:00 AM - 11:00 PM' },
        saturday: { type: String, default: '10:00 AM - 11:00 PM' },
        sunday: { type: String, default: '10:00 AM - 11:00 PM' }
    },
    delivery: {
        freeDeliveryThreshold: { type: Number, default: 50 },
        standardFee: { type: Number, default: 5 },
        taxRate: { type: Number, default: 0.1 },
        currency: { type: String, default: '$' }
    },
    socials: {
        facebook: { type: String, default: '' },
        instagram: { type: String, default: '' },
        twitter: { type: String, default: '' }
    }
}, {
    timestamps: true
});

export default mongoose.model<ISettings>('Settings', SettingsSchema);

import mongoose, { Document, Schema } from 'mongoose';

export interface IReview extends Document {
    user: mongoose.Types.ObjectId;
    menuItem: mongoose.Types.ObjectId;
    rating: number;
    comment: string;
    createdAt: Date;
    updatedAt: Date;
}

const reviewSchema = new Schema<IReview>({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    menuItem: {
        type: Schema.Types.ObjectId,
        ref: 'MenuItem',
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        required: true,
        trim: true
    }
}, {
    timestamps: true
});

// Create index for faster querying of reviews for a specific menu item
reviewSchema.index({ menuItem: 1, createdAt: -1 });

export default mongoose.model<IReview>('Review', reviewSchema);

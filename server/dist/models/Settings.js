"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const SettingsSchema = new mongoose_1.Schema({
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
exports.default = mongoose_1.default.model('Settings', SettingsSchema);
//# sourceMappingURL=Settings.js.map
import { useState, useEffect, useRef } from "react";
import { Image as ImageIcon, Plus, X, Save, Upload, Loader2 } from "lucide-react";
import Input from "../../UI/Input";
import Button from "../../UI/Button";
import { menuService } from "../../../services/api";
import { useToast } from "../../../context/ToastContext";
import { motion, AnimatePresence } from "framer-motion";

interface MealFormProps {
    initialData?: any;
    onSubmit: (data: any) => Promise<void>;
    isLoading?: boolean;
    title: string;
}

export default function MealForm({ initialData, onSubmit, isLoading, title }: MealFormProps) {
    const { showToast } = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        category: "",
        image: "",
        isAvailable: true,
        isFeatured: false
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || "",
                description: initialData.description || "",
                price: initialData.price?.toString() || "",
                category: initialData.category || "",
                image: initialData.image || "",
                isAvailable: initialData.isAvailable ?? true,
                isFeatured: initialData.isFeatured ?? false
            });
        }
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const finalValue = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
        setFormData(prev => ({ ...prev, [name]: finalValue }));
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validation
        if (!file.type.startsWith('image/')) {
            showToast("Please select an image file", "error");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            showToast("Image size must be less than 5MB", "error");
            return;
        }

        const uploadData = new FormData();
        uploadData.append('image', file);

        setIsUploading(true);
        try {
            const result = await menuService.uploadImage(uploadData);
            setFormData(prev => ({ ...prev, image: result.url }));
            showToast("Image uploaded successfully", "success");
        } catch (error: any) {
            showToast(error.response?.data?.error || "Failed to upload image", "error");
        } finally {
            setIsUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSubmit({
            ...formData,
            price: parseFloat(formData.price)
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-10 glass rounded-[2.5rem] p-8 md:p-12 shadow-2xl glow-gold border border-white/10 relative overflow-hidden">
            {/* Decorative Ambient Background */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 blur-[80px] rounded-full -mr-20 -mt-20 pointer-events-none" />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-8 relative z-10">
                <div>
                    <h2 className="text-3xl font-serif text-white tracking-tight">{title}</h2>
                    <p className="text-gray-400 font-light mt-1 text-sm tracking-wide">Refine the culinary details for your masterpiece</p>
                </div>

                <div className="flex items-center gap-4">
                    <Button variant="ghost" type="button" onClick={() => window.history.back()} className="text-gray-400 hover:text-white border-white/5 h-11 px-6">
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        type="submit"
                        isLoading={isLoading}
                        leftIcon={<Save className="h-4 w-4" />}
                        className="h-11 px-8 bg-gradient-to-r from-amber-500 to-orange-600 border-0 shadow-lg shadow-amber-500/20"
                    >
                        {initialData ? "Save Changes" : "Create Item"}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative z-10">
                {/* Left Column: Image Management */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                            <ImageIcon className="h-4 w-4 text-amber-500" />
                        </div>
                        <label className="text-sm font-semibold text-gray-300 uppercase tracking-widest">Item Image</label>
                    </div>

                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className="aspect-square rounded-[2rem] glass-dark border-2 border-dashed border-white/10 flex flex-col items-center justify-center overflow-hidden group relative cursor-pointer hover:border-amber-500/30 transition-all"
                    >
                        <AnimatePresence mode="wait">
                            {formData.image ? (
                                <motion.div
                                    key="preview"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="w-full h-full"
                                >
                                    <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-gray-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                                        <div className="flex gap-3">
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    fileInputRef.current?.click();
                                                }}
                                                className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-md transition-all border border-white/10"
                                            >
                                                <Upload className="h-5 w-5" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setFormData(prev => ({ ...prev, image: "" }));
                                                }}
                                                className="p-3 bg-red-500/80 hover:bg-red-500 rounded-full text-white backdrop-blur-md transition-all"
                                            >
                                                <X className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="placeholder"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="text-center p-8"
                                >
                                    {isUploading ? (
                                        <Loader2 className="h-10 w-10 text-amber-500 animate-spin mx-auto mb-4" />
                                    ) : (
                                        <div className="w-16 h-16 bg-white/5 rounded-[1.5rem] flex items-center justify-center mx-auto mb-4 border border-white/5 group-hover:scale-110 transition-transform duration-500">
                                            <Upload className="h-6 w-6 text-gray-500 group-hover:text-amber-500 transition-colors" />
                                        </div>
                                    )}
                                    <p className="text-gray-400 font-medium">Click to upload</p>
                                    <p className="text-gray-600 text-xs mt-2 uppercase tracking-tighter">JPG, PNG up to 5MB</p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Hidden File Input */}
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/*"
                            className="hidden"
                        />
                    </div>

                    <div className="pt-2">
                        <Input
                            label="Manual Image URL"
                            name="image"
                            value={formData.image}
                            onChange={handleChange}
                            placeholder="https://images.unsplash.com/..."
                            className="h-12"
                        />
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-3 ml-1">Or paste a direct asset link</p>
                    </div>
                </div>

                {/* Right Column: Culinary Specs */}
                <div className="lg:col-span-2 space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="md:col-span-2">
                            <Input
                                label="Dish Name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="e.g. Signature Truffle Wagyu"
                                required
                                className="h-14 text-lg"
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="text-xs uppercase tracking-widest font-semibold text-gray-500 ml-1">Menu Category</label>
                            <div className="relative group">
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all appearance-none cursor-pointer hover:bg-white/[0.08]"
                                >
                                    <option value="" className="bg-gray-950">Select Category</option>
                                    <option value="appetizer" className="bg-gray-950">✦ Starter / Appetizer</option>
                                    <option value="main" className="bg-gray-950">✦ Main Course</option>
                                    <option value="seafood" className="bg-gray-950">✦ Seafood</option>
                                    <option value="vegetarian" className="bg-gray-950">✦ Vegetarian</option>
                                    <option value="desserts" className="bg-gray-950">✦ Desserts</option>
                                    <option value="drinks" className="bg-gray-950">✦ Drinks / Beverages</option>
                                </select>
                                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                                    <Plus className="h-4 w-4 rotate-45 transform group-hover:rotate-0 transition-transform h-4 w-4" />
                                </div>
                            </div>
                        </div>

                        <Input
                            label="Price (₦)"
                            name="price"
                            type="number"
                            step="0.01"
                            value={formData.price}
                            onChange={handleChange}
                            placeholder="0.00"
                            required
                            className="h-14"
                        />
                    </div>

                    <div className="space-y-3">
                        <label className="text-xs uppercase tracking-widest font-semibold text-gray-500 ml-1">Description & Pairing</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={4}
                            className="w-full bg-white/5 border border-white/5 rounded-[1.5rem] px-5 py-4 text-white focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all resize-none hover:bg-white/[0.08]"
                            placeholder="Describe the flavor profiles, ingredients, and suggested wine pairings..."
                        />
                    </div>

                    <div className="flex flex-wrap gap-10 bg-white/5 border border-white/5 rounded-[1.5rem] p-6">
                        <label className="flex items-center gap-4 cursor-pointer group">
                            <div className="relative">
                                <input
                                    type="checkbox"
                                    name="isAvailable"
                                    checked={formData.isAvailable}
                                    onChange={handleChange}
                                    className="sr-only peer"
                                />
                                <div className="w-12 h-6 bg-gray-800 rounded-full peer peer-checked:bg-green-500/40 border border-white/10 transition-all after:content-[''] after:absolute after:top-1 after:left-1 after:bg-gray-400 after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-6 peer-checked:after:bg-green-400 shadow-inner"></div>
                            </div>
                            <div>
                                <span className="block text-sm font-semibold text-white tracking-wide">Available</span>
                                <span className="text-[10px] text-gray-500 uppercase font-bold">Public Listing</span>
                            </div>
                        </label>

                        <label className="flex items-center gap-4 cursor-pointer group">
                            <div className="relative">
                                <input
                                    type="checkbox"
                                    name="isFeatured"
                                    checked={formData.isFeatured}
                                    onChange={handleChange}
                                    className="sr-only peer"
                                />
                                <div className="w-12 h-6 bg-gray-800 rounded-full peer peer-checked:bg-amber-500/40 border border-white/10 transition-all after:content-[''] after:absolute after:top-1 after:left-1 after:bg-gray-400 after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-6 peer-checked:after:bg-amber-400 shadow-inner"></div>
                            </div>
                            <div>
                                <span className="block text-sm font-semibold text-white tracking-wide">Featured</span>
                                <span className="text-[10px] text-gray-500 uppercase font-bold">Priority View</span>
                            </div>
                        </label>
                    </div>
                </div>
            </div>
        </form>
    );
}

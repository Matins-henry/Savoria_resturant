import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { Star, Plus, Heart, Clock, Flame } from "lucide-react";
import { useState, useRef } from "react";

export interface Meal {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    category: string;
    rating: number;
    reviews: number;
    featured?: boolean;
    spicy?: boolean;
    prepTime?: string;
    calories?: number;
    reviewList?: any[];
}

interface MealCardProps {
    meal: Meal;
    onAddToCart?: (meal: Meal) => void;
    onToggleFavorite?: (meal: Meal) => void;
    isFavorite?: boolean;
    variant?: "default" | "compact";
}

export default function MealCard({
    meal,
    onAddToCart,
    onToggleFavorite,
    isFavorite = false,
    variant = "default",
}: MealCardProps) {
    const [isHovered, setIsHovered] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);

    // Mouse tilt effect logic
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);

    const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();

        const width = rect.width;
        const height = rect.height;

        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;

        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        x.set(0);
        y.set(0);
    };

    // Compact variant for list view
    if (variant === "compact") {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ x: 8 }}
                className="group flex gap-5 p-5 bg-gradient-to-r from-gray-900/80 to-gray-900/40 backdrop-blur-sm rounded-2xl border border-white/5 hover:border-amber-500/30 transition-all duration-500"
            >
                {/* Image */}
                <div className="relative w-28 h-28 rounded-xl overflow-hidden flex-shrink-0">
                    <img
                        src={meal.image}
                        alt={meal.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent" />
                    {meal.featured && (
                        <div className="absolute top-2 left-2 w-2.5 h-2.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 shadow-lg shadow-orange-500/50" />
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                    <div>
                        <div className="flex items-start justify-between gap-3 mb-1">
                            <h3 className="text-lg font-semibold text-white truncate group-hover:text-amber-400 transition-colors">
                                {meal.name}
                            </h3>
                            <span className="text-lg font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent whitespace-nowrap">
                                ₦{meal.price.toLocaleString()}
                            </span>
                        </div>
                        <p className="text-gray-500 text-sm line-clamp-1">{meal.description}</p>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                                <span className="text-sm text-white font-medium">{meal.rating}</span>
                            </div>
                            {meal.prepTime && (
                                <div className="flex items-center gap-1 text-gray-500 text-sm">
                                    <Clock className="h-3.5 w-3.5" />
                                    {meal.prepTime}
                                </div>
                            )}
                        </div>
                        <button
                            onClick={(e) => { e.preventDefault(); onAddToCart?.(meal); }}
                            className="text-sm text-amber-400 hover:text-amber-300 font-semibold transition-colors"
                        >
                            + Add to Cart
                        </button>
                    </div>
                </div>
            </motion.div>
        );
    }

    // Default variant - Premium card
    return (
        <motion.div
            ref={cardRef}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
            }}
            className="group relative perspective-1000"
        >
            {/* Card Container */}
            <div className="relative bg-gradient-to-br from-gray-900/90 to-gray-900/60 backdrop-blur-md rounded-[2.5rem] overflow-hidden border border-white/5 group-hover:border-amber-500/30 transition-all duration-500 shadow-2xl">
                {/* Image Container */}
                <div className="relative h-64 overflow-hidden">
                    {/* Loading Skeleton */}
                    {!imageLoaded && (
                        <div className="absolute inset-0 bg-gray-800 animate-pulse">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
                        </div>
                    )}

                    <motion.img
                        src={meal.image}
                        alt={meal.name}
                        onLoad={() => setImageLoaded(true)}
                        animate={{ scale: isHovered ? 1.1 : 1 }}
                        transition={{ duration: 0.7, ease: "easeOut" }}
                        className={`w-full h-full object-cover ${imageLoaded ? "opacity-100" : "opacity-0"}`}
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/30 to-transparent" />

                    {/* Top Badges */}
                    <div className="absolute top-4 left-4 flex items-center gap-2">
                        <motion.span
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="px-4 py-1.5 text-xs font-medium bg-gray-900/80 backdrop-blur-md text-white rounded-full border border-white/10"
                        >
                            {meal.category}
                        </motion.span>
                        {meal.spicy && (
                            <motion.span
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.3 }}
                                className="p-2 bg-gradient-to-r from-red-500 to-orange-500 rounded-full shadow-lg shadow-red-500/30"
                            >
                                <Flame className="h-3.5 w-3.5 text-white" />
                            </motion.span>
                        )}
                    </div>

                    {/* Featured Badge */}
                    {meal.featured && (
                        <motion.span
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="absolute top-4 right-4 px-4 py-1.5 text-xs font-semibold bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white rounded-full shadow-xl shadow-orange-500/40"
                        >
                            ✨ Chef's Choice
                        </motion.span>
                    )}

                    {/* Action Buttons */}
                    <div className="absolute bottom-4 right-4 flex items-center gap-2">
                        {/* Favorite Button */}
                        <motion.button
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => { e.preventDefault(); onToggleFavorite?.(meal); }}
                            className={`p-3 rounded-full backdrop-blur-md transition-all duration-300 ${isFavorite
                                ? "bg-red-500 text-white shadow-lg shadow-red-500/40"
                                : "bg-gray-900/80 text-gray-400 hover:text-red-400 border border-white/10"
                                }`}
                        >
                            <Heart className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />
                        </motion.button>
                    </div>

                    {/* Hover Info Overlay */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
                        className="absolute bottom-4 left-4 flex items-center gap-3"
                    >
                        {meal.prepTime && (
                            <span className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-gray-900/90 backdrop-blur-md text-gray-200 rounded-full border border-white/10">
                                <Clock className="h-3.5 w-3.5 text-amber-400" />
                                {meal.prepTime}
                            </span>
                        )}
                        {meal.calories && (
                            <span className="px-3 py-1.5 text-xs bg-gray-900/90 backdrop-blur-md text-gray-200 rounded-full border border-white/10">
                                {meal.calories} cal
                            </span>
                        )}
                    </motion.div>
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* Title & Price */}
                    <div className="flex items-start justify-between gap-4 mb-3">
                        <h3 className="text-xl font-bold text-white group-hover:text-amber-400 transition-colors duration-300 leading-tight">
                            {meal.name}
                        </h3>
                        <div className="text-right flex-shrink-0">
                            <span className="text-2xl font-bold bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
                                ₦{meal.price.toLocaleString()}
                            </span>
                        </div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-400 text-sm mb-5 line-clamp-2 leading-relaxed">
                        {meal.description}
                    </p>

                    {/* Rating & Add Button */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 rounded-full border border-amber-500/20">
                                <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                                <span className="text-white font-semibold text-sm">{meal.rating}</span>
                            </div>
                            <span className="text-gray-500 text-sm">({meal.reviews} reviews)</span>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={(e) => { e.preventDefault(); onAddToCart?.(meal); }}
                            className="group/btn flex items-center gap-2 px-5 py-2.5 text-sm font-semibold bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white rounded-full shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 transition-all"
                        >
                            <Plus className="h-4 w-4" />
                            <span>Add</span>
                        </motion.button>
                    </div>
                </div>

                {/* Hover Glow Effect */}
                <motion.div
                    animate={{ opacity: isHovered ? 1 : 0 }}
                    className="absolute inset-0 bg-gradient-to-t from-amber-500/10 via-transparent to-transparent pointer-events-none"
                />
            </div>

            {/* Card Glow */}
            <motion.div
                animate={{ opacity: isHovered ? 0.5 : 0 }}
                className="absolute -inset-2 bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-red-500/20 rounded-[2rem] blur-2xl -z-10"
            />
        </motion.div>
    );
}

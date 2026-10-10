import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    Star,
    Clock,
    Flame,
    Heart,
    Share2,
    ShoppingBag,
    Check,
    Leaf,
    AlertCircle,
    Sparkles,
} from "lucide-react";
import QuantitySelector from "../../Components/Features/QuantitySelector";
import MealCard from "../../Components/Features/MealCard";
import { useCart } from "../../context/CartContext";
import { useToast } from "../../context/ToastContext";
import { menuService } from "../../services/api";

export default function MealDetails() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { addItem } = useCart();
    const { showToast } = useToast();
    const [meal, setMeal] = useState<any | null>(null);
    const [relatedMeals, setRelatedMeals] = useState<any[]>([]);
    const [quantity, setQuantity] = useState(1);
    const [isFavorite, setIsFavorite] = useState(false);
    const [copied, setCopied] = useState(false);
    const [addedToCart, setAddedToCart] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Review states
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [isSubmittingReview, setIsSubmittingReview] = useState(false);

    useEffect(() => {
        const fetchMeal = async () => {
            if (!id) return;
            setIsLoading(true);
            try {
                const data = await menuService.getById(id);
                setMeal(data);

                // Fetch related meals
                const allMeals = await menuService.getAll({ category: data.category });
                setRelatedMeals(allMeals.filter((m: any) => m._id !== id).slice(0, 3));
            } catch (error) {
                console.error("Failed to fetch meal:", error);
                showToast("Failed to load meal details", "error");
            } finally {
                setIsLoading(false);
            }
        };

        fetchMeal();
    }, [id, showToast]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-950 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-gray-400 font-medium tracking-widest uppercase text-xs">Loading Experience...</p>
                </div>
            </div>
        );
    }

    if (!meal) {
        return (
            <div className="min-h-screen bg-gray-950 flex items-center justify-center">
                <div className="text-white text-xl">Meal not found</div>
            </div>
        );
    }

    const handleAddToCart = () => {
        if (!meal) return;
        addItem({
            id: meal._id,
            name: meal.name,
            price: meal.price,
            image: meal.image,
            category: meal.category
        }, quantity);

        showToast(`Added ${quantity}x ${meal.name} to cart`, "success");
        setAddedToCart(true);
        setTimeout(() => setAddedToCart(false), 2500);
    };

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        showToast("Link copied to clipboard", "info");
        setTimeout(() => setCopied(false), 2000);
    };

    const handleReviewSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!comment.trim()) {
            showToast("Please enter a comment", "error");
            return;
        }

        setIsSubmittingReview(true);
        try {
            await menuService.addReview(meal._id, { rating, comment });
            showToast("Review submitted successfully!", "success");
            setComment("");
            setRating(5);
            // Re-fetch meal to show new review
            const updatedMeal = await menuService.getById(id!);
            setMeal(updatedMeal);
        } catch (error: any) {
            showToast(error.response?.data?.error || "Failed to submit review", "error");
        } finally {
            setIsSubmittingReview(false);
        }
    };

    const totalPrice = (meal.price * quantity).toLocaleString();

    return (
        <div className="min-h-screen bg-gray-950">
            {/* ===== HERO SECTION ===== */}
            <section className="relative pt-24 pb-16">
                <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-gray-950" />
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-0 left-1/3 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[150px]" />
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="mb-8"
                    >
                        <button
                            onClick={() => navigate(-1)}
                            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
                        >
                            <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                            <span>Back to Menu</span>
                        </button>
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
                        {/* ===== IMAGE SECTION ===== */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6 }}
                            className="relative"
                        >
                            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden group">
                                <div className="absolute -inset-4 bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-red-500/20 rounded-[2rem] blur-2xl opacity-50" />
                                <div className="relative h-full rounded-3xl overflow-hidden border border-white/10">
                                    <img
                                        src={meal.image}
                                        alt={meal.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent" />
                                    <div className="absolute top-6 left-6 flex items-center gap-3">
                                        <span className="px-4 py-2 text-sm font-medium bg-gray-900/80 backdrop-blur-md text-white rounded-full border border-white/10">
                                            {meal.category}
                                        </span>
                                        {meal.isFeatured && (
                                            <span className="px-4 py-2 text-sm font-semibold bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white rounded-full shadow-xl shadow-orange-500/40 flex items-center gap-1.5">
                                                <Sparkles className="h-3.5 w-3.5" />
                                                Chef's Choice
                                            </span>
                                        )}
                                    </div>

                                    <div className="absolute top-6 right-6 flex items-center gap-3">
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => setIsFavorite(!isFavorite)}
                                            className={`p-3.5 rounded-full backdrop-blur-md transition-all ${isFavorite
                                                ? "bg-red-500 text-white shadow-lg shadow-red-500/40"
                                                : "bg-gray-900/80 text-gray-300 hover:text-red-400 border border-white/10"
                                                }`}
                                        >
                                            <Heart className={`h-5 w-5 ${isFavorite ? "fill-current" : ""}`} />
                                        </motion.button>

                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={handleShare}
                                            className="p-3.5 rounded-full bg-gray-900/80 backdrop-blur-md text-gray-300 hover:text-white border border-white/10 transition-colors"
                                        >
                                            {copied ? <Check className="h-5 w-5 text-green-400" /> : <Share2 className="h-5 w-5" />}
                                        </motion.button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* ===== DETAILS SECTION ===== */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                                {meal.name}
                            </h1>

                            <div className="flex flex-wrap items-center gap-4 mb-8">
                                <div className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 rounded-full border border-amber-500/20">
                                    <Star className="h-5 w-5 text-amber-400 fill-amber-400" />
                                    <span className="text-white font-semibold">{meal.rating.toFixed(1)}</span>
                                    <span className="text-gray-500">({meal.reviews} reviews)</span>
                                </div>
                                {meal.prepTime && (
                                    <div className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 rounded-full border border-white/5">
                                        <Clock className="h-5 w-5 text-gray-400" />
                                        <span className="text-gray-300">{meal.prepTime} min</span>
                                    </div>
                                )}
                                {meal.spicy && (
                                    <div className="flex items-center gap-2 px-4 py-2 bg-red-500/10 rounded-full border border-red-500/20">
                                        <Flame className="h-5 w-5 text-red-400" />
                                        <span className="text-red-400 font-medium">Spicy</span>
                                    </div>
                                )}
                            </div>

                            <p className="text-gray-400 text-lg leading-relaxed mb-8">
                                {meal.description}
                            </p>

                            <div className="flex flex-wrap gap-3 mb-8">
                                {meal.calories && (
                                    <span className="px-4 py-2 bg-gray-800/50 rounded-full text-gray-300 text-sm border border-white/5">
                                        🔥 {meal.calories} calories
                                    </span>
                                )}
                                {meal.dietary?.map((d: string) => (
                                    <span
                                        key={d}
                                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full text-green-400 text-sm"
                                    >
                                        <Leaf className="h-3.5 w-3.5" />
                                        {d}
                                    </span>
                                ))}
                            </div>

                            {meal.ingredients && meal.ingredients.length > 0 && (
                                <div className="mb-8">
                                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                        <span className="w-8 h-px bg-gradient-to-r from-amber-500 to-transparent" />
                                        Ingredients
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {meal.ingredients.map((ingredient: string) => (
                                            <span
                                                key={ingredient}
                                                className="px-4 py-2 bg-gray-800/50 backdrop-blur-sm border border-white/5 rounded-xl text-gray-300 text-sm hover:border-amber-500/30 hover:text-white transition-all"
                                            >
                                                {ingredient}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {meal.allergens && meal.allergens.length > 0 && (
                                <div className="flex items-start gap-4 p-5 bg-red-500/10 border border-red-500/20 rounded-2xl mb-8">
                                    <div className="p-2 rounded-lg bg-red-500/20">
                                        <AlertCircle className="h-5 w-5 text-red-400" />
                                    </div>
                                    <div>
                                        <p className="text-red-400 font-semibold text-sm mb-1">Allergen Information</p>
                                        <p className="text-gray-400 text-sm">
                                            Contains: {meal.allergens.join(", ")}
                                        </p>
                                    </div>
                                </div>
                            )}

                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 p-6 bg-gradient-to-br from-gray-900/80 to-gray-900/40 backdrop-blur-sm border border-white/5 rounded-2xl">
                                <div>
                                    <p className="text-gray-500 text-sm mb-2">Quantity</p>
                                    <QuantitySelector value={quantity} onChange={setQuantity} size="lg" />
                                </div>
                                <div className="flex-1 flex items-center gap-6">
                                    <div>
                                        <p className="text-gray-500 text-sm mb-1">Total Price</p>
                                        <p className="text-3xl font-bold bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
                                            ₦{totalPrice}
                                        </p>
                                    </div>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleAddToCart}
                                        disabled={addedToCart}
                                        className={`flex-1 sm:flex-none flex items-center justify-center gap-3 px-10 py-5 rounded-2xl font-semibold text-lg transition-all ${addedToCart
                                            ? "bg-green-500 text-white shadow-lg shadow-green-500/30"
                                            : "bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white shadow-xl shadow-orange-500/30 hover:shadow-orange-500/50"
                                            }`}
                                    >
                                        {addedToCart ? (
                                            <><Check className="h-6 w-6" /> Added to Cart</>
                                        ) : (
                                            <><ShoppingBag className="h-6 w-6" /> Add to Cart</>
                                        )}
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ===== REVIEWS SECTION ===== */}
            <section className="py-24 border-t border-white/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                        <div className="lg:col-span-1">
                            <h2 className="text-3xl font-bold text-white mb-6">Customer Reviews</h2>
                            <div className="p-8 bg-gray-900/50 rounded-3xl border border-white/5 text-center">
                                <p className="text-6xl font-bold text-white mb-4">{meal.rating.toFixed(1)}</p>
                                <div className="flex justify-center gap-1 mb-4">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <Star key={s} className={`h-6 w-6 ${s <= Math.round(meal.rating) ? "text-amber-400 fill-amber-400" : "text-gray-700"}`} />
                                    ))}
                                </div>
                                <p className="text-gray-500 italic">Based on {meal.reviews} authentic reviews</p>
                            </div>

                            <div className="mt-12">
                                <h3 className="text-xl font-bold text-white mb-6">Experience & Feedback</h3>
                                <form onSubmit={handleReviewSubmit} className="space-y-4">
                                    <div>
                                        <p className="text-sm text-gray-400 mb-3">Rate your experience</p>
                                        <div className="flex gap-2">
                                            {[1, 2, 3, 4, 5].map((s) => (
                                                <button
                                                    key={s}
                                                    type="button"
                                                    onClick={() => setRating(s)}
                                                    className={`p-2 rounded-lg transition-all ${rating === s ? "bg-amber-500 text-white scale-110 shadow-lg shadow-amber-500/20" : "bg-gray-800 text-gray-500 hover:text-amber-400"}`}
                                                >
                                                    <Star className={`h-6 w-6 ${rating >= s ? "fill-current" : ""}`} />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-400 mb-2">Your comment</p>
                                        <textarea
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                            placeholder="Tell us about the flavors, presentation, and service..."
                                            className="w-full bg-gray-800 border border-white/5 rounded-2xl p-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-amber-500/50 min-h-[120px] transition-all"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={isSubmittingReview}
                                        className="w-full py-4 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white font-bold rounded-2xl shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 transition-all disabled:opacity-50"
                                    >
                                        {isSubmittingReview ? "Submitting..." : "Post Review"}
                                    </button>
                                </form>
                            </div>
                        </div>

                        <div className="lg:col-span-2 space-y-8">
                            {meal.reviewList && meal.reviewList.length > 0 ? (
                                meal.reviewList.map((review: any) => (
                                    <motion.div
                                        key={review._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        className="p-8 bg-gray-900/30 border border-white/5 rounded-3xl"
                                    >
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center gap-4">
                                                <img
                                                    src={review.user?.avatar || `https://ui-avatars.com/api/?name=${review.user?.name || "Guest"}&background=random`}
                                                    alt={review.user?.name}
                                                    className="w-12 h-12 rounded-full ring-2 ring-amber-500/20"
                                                />
                                                <div>
                                                    <p className="text-white font-bold">{review.user?.name || "Premium Member"}</p>
                                                    <p className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-0.5">
                                                {[1, 2, 3, 4, 5].map((s) => (
                                                    <Star key={s} className={`h-3.5 w-3.5 ${s <= review.rating ? "text-amber-400 fill-amber-400" : "text-gray-800"}`} />
                                                ))}
                                            </div>
                                        </div>
                                        <p className="text-gray-400 leading-relaxed italic">
                                            "{review.comment}"
                                        </p>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-white/5 rounded-3xl">
                                    <div className="p-4 rounded-full bg-gray-900 mb-4">
                                        <Sparkles className="h-8 w-8 text-amber-500/40" />
                                    </div>
                                    <h3 className="text-white font-bold text-xl mb-2">Be the First to Review</h3>
                                    <p className="text-gray-500 max-w-xs">Share your culinary experience with our community and help others discover this dish.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== RELATED DISHES ===== */}
            {relatedMeals.length > 0 && (
                <section className="py-24 border-t border-white/5">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="mb-12"
                        >
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                                You May Also Like
                            </h2>
                            <p className="text-gray-500 text-lg">
                                More delicious dishes from our {meal.category} collection
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {relatedMeals.map((rm: any) => (
                                <Link key={rm._id} to={`/meal/${rm._id}`}>
                                    <MealCard
                                        meal={{
                                            id: rm._id,
                                            name: rm.name,
                                            description: rm.description,
                                            price: rm.price,
                                            image: rm.image,
                                            category: rm.category,
                                            rating: rm.rating,
                                            reviews: rm.reviews,
                                            featured: rm.isFeatured,
                                            prepTime: rm.prepTime?.toString(),
                                            calories: rm.calories
                                        }}
                                        onAddToCart={() => { }}
                                    />
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
}

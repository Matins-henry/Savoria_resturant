import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search,
    Grid3X3,
    List,
    UtensilsCrossed,
    Beef,
    Fish,
    Salad,
    Cake,
    Wine,
    Soup,
    X,
    Sparkles,
    ArrowUpDown,
} from "lucide-react";
import MealCard, { type Meal } from "../../Components/Features/MealCard";
import CategoryFilter from "../../Components/Features/CategoryFilter";
import { menuService } from "../../services/api";
import { useCart } from "../../context/CartContext";
import { useToast } from "../../context/ToastContext";

const categories = [
    { id: "all", name: "All Dishes", icon: <UtensilsCrossed className="h-4 w-4" /> },
    { id: "main", name: "Main Course", icon: <Beef className="h-4 w-4" /> },
    { id: "seafood", name: "Seafood", icon: <Fish className="h-4 w-4" /> },
    { id: "appetizer", name: "Appetizer", icon: <Salad className="h-4 w-4" /> },
    { id: "soup", name: "Soup", icon: <Soup className="h-4 w-4" /> },
    { id: "desserts", name: "Dessert", icon: <Cake className="h-4 w-4" /> },
    { id: "drinks", name: "Beverages", icon: <Wine className="h-4 w-4" /> },
];

export default function Menu() {
    const { addItem } = useCart();
    const { showToast } = useToast();
    const [mockMeals, setMockMeals] = useState<Meal[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch meals from API
    useEffect(() => {
        const fetchMeals = async () => {
            try {
                const data = await menuService.getAll();
                // Map API data to Meal interface if needed, but they should match
                const meals = data.map((item: any) => ({
                    id: item._id,
                    name: item.name,
                    description: item.description,
                    price: item.price,
                    image: item.image,
                    category: item.category, // API returns lowercase 'main' etc
                    rating: item.rating,
                    reviews: item.reviews,
                    featured: item.isFeatured,
                    prepTime: `${item.prepTime} min`,
                    calories: item.calories
                }));
                setMockMeals(meals);
            } catch (error) {
                console.error("Failed to fetch menu:", error);
                showToast("Failed to load menu items", "error");
            } finally {
                setLoading(false);
            }
        };
        fetchMeals();
    }, [showToast]);

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [favorites, setFavorites] = useState<Set<string>>(new Set());
    const [sortBy, setSortBy] = useState<"featured" | "price-low" | "price-high" | "rating">("featured");

    // ... (keep existing useMemo filters)
    const filteredMeals = useMemo(() => {
        let result = mockMeals;
        if (selectedCategory !== "all") result = result.filter((m) => m.category.toLowerCase() === selectedCategory.toLowerCase());
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            result = result.filter((m) => m.name.toLowerCase().includes(q) || m.description.toLowerCase().includes(q) || m.category.toLowerCase().includes(q));
        }
        switch (sortBy) {
            case "price-low": return [...result].sort((a, b) => a.price - b.price);
            case "price-high": return [...result].sort((a, b) => b.price - a.price);
            case "rating": return [...result].sort((a, b) => b.rating - a.rating);
            default: return [...result].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        }
    }, [mockMeals, searchQuery, selectedCategory, sortBy]);

    const categoriesWithCounts = useMemo(() => categories.map((c) => ({
        ...c,
        count: c.id === "all" ? mockMeals.length : mockMeals.filter((m) => m.category.toLowerCase() === c.id).length,
    })), [mockMeals]);

    const handleToggleFavorite = (meal: Meal) => {
        setFavorites((prev) => {
            const s = new Set(prev);
            s.has(meal.id) ? s.delete(meal.id) : s.add(meal.id);
            return s;
        });
    };

    const handleAddToCart = (meal: Meal) => {
        addItem({
            id: meal.id,
            name: meal.name,
            price: meal.price,
            image: meal.image,
            category: meal.category
        });
        showToast(`Added ${meal.name} to cart`, "success");
    };

    return (
        <div className="min-h-screen bg-gray-950">
            {/* ===== HERO HEADER ===== */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                {/* Background */}
                <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-950 to-gray-950" />
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <motion.div
                        animate={{ opacity: [0.3, 0.5, 0.3], scale: [1, 1.1, 1] }}
                        transition={{ duration: 8, repeat: Infinity }}
                        className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[150px]"
                    />
                    <motion.div
                        animate={{ opacity: [0.2, 0.4, 0.2], scale: [1, 1.1, 1] }}
                        transition={{ duration: 10, repeat: Infinity, delay: 1 }}
                        className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[150px]"
                    />
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
                    </div>
                ) : (
                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        {/* Header */}
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="text-center mb-12"
                        >
                            <motion.span
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2 }}
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/10 border border-amber-500/30 text-amber-400 text-sm font-medium mb-6"
                            >
                                <UtensilsCrossed className="h-4 w-4" />
                                Explore Our Collection
                                <Sparkles className="h-3 w-3 text-amber-300" />
                            </motion.span>

                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
                                Our{" "}
                                <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
                                    Menu
                                </span>
                            </h1>
                            <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
                                From appetizers to desserts, discover dishes crafted with passion,
                                precision, and the world's finest ingredients.
                            </p>
                        </motion.div>

                        {/* Search Bar */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="max-w-2xl mx-auto mb-10"
                        >
                            <div className="relative group">
                                {/* Glow */}
                                <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-red-500/20 rounded-2xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />

                                <div className="relative bg-gray-900/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
                                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search for dishes, ingredients, or categories..."
                                        className="w-full bg-transparent pl-16 pr-16 py-5 text-lg text-white placeholder-gray-500 focus:outline-none"
                                    />
                                    <AnimatePresence>
                                        {searchQuery && (
                                            <motion.button
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.8 }}
                                                onClick={() => setSearchQuery("")}
                                                className="absolute right-6 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/10 text-gray-400 hover:text-white hover:bg-white/20 transition-all"
                                            >
                                                <X className="h-4 w-4" />
                                            </motion.button>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </motion.div>

                        {/* Category Filter */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="flex justify-center"
                        >
                            <CategoryFilter
                                categories={categoriesWithCounts}
                                selectedCategory={selectedCategory}
                                onSelectCategory={setSelectedCategory}
                            />
                        </motion.div>
                    </div>
                )}
            </section>

            {/* ===== MENU CONTENT ===== */}
            <section className="pb-32">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Toolbar */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10 pb-6 border-b border-white/5"
                    >
                        {/* Results Count */}
                        <div>
                            <p className="text-gray-400">
                                Showing{" "}
                                <span className="text-white font-semibold">{filteredMeals.length}</span>{" "}
                                {filteredMeals.length === 1 ? "dish" : "dishes"}
                                {selectedCategory !== "all" && (
                                    <span>
                                        {" "}in{" "}
                                        <span className="text-amber-400 font-medium">{selectedCategory}</span>
                                    </span>
                                )}
                            </p>
                        </div>

                        {/* Controls */}
                        <div className="flex items-center gap-3">
                            {/* Sort Dropdown */}
                            <div className="relative">
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                                    className="appearance-none bg-gray-900/80 backdrop-blur-sm border border-white/10 text-gray-300 rounded-xl pl-4 pr-10 py-2.5 text-sm focus:outline-none focus:border-amber-500/50 cursor-pointer"
                                >
                                    <option value="featured">Featured</option>
                                    <option value="price-low">Price: Low to High</option>
                                    <option value="price-high">Price: High to Low</option>
                                    <option value="rating">Highest Rated</option>
                                </select>
                                <ArrowUpDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
                            </div>

                            {/* View Mode Toggle */}
                            <div className="flex items-center bg-gray-900/80 backdrop-blur-sm border border-white/10 rounded-xl p-1">
                                <button
                                    onClick={() => setViewMode("grid")}
                                    className={`p-2.5 rounded-lg transition-all ${viewMode === "grid"
                                        ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg"
                                        : "text-gray-400 hover:text-white"
                                        }`}
                                >
                                    <Grid3X3 className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={() => setViewMode("list")}
                                    className={`p-2.5 rounded-lg transition-all ${viewMode === "list"
                                        ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg"
                                        : "text-gray-400 hover:text-white"
                                        }`}
                                >
                                    <List className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </motion.div>

                    {/* Meals Grid/List */}
                    <AnimatePresence mode="wait">
                        {filteredMeals.length > 0 ? (
                            <motion.div
                                key={viewMode}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                                className={
                                    viewMode === "grid"
                                        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                                        : "space-y-4"
                                }
                            >
                                {filteredMeals.map((meal) => (
                                    <Link key={meal.id} to={`/meal/${meal.id}`}>
                                        <MealCard
                                            meal={meal}
                                            variant={viewMode === "list" ? "compact" : "default"}
                                            isFavorite={favorites.has(meal.id)}
                                            onToggleFavorite={handleToggleFavorite}
                                            onAddToCart={handleAddToCart}
                                        />
                                    </Link>
                                ))}
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-center py-24"
                            >
                                <div className="w-24 h-24 mx-auto mb-8 rounded-3xl bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center border border-white/5">
                                    <Search className="h-10 w-10 text-gray-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-3">No dishes found</h3>
                                <p className="text-gray-500 mb-8 max-w-md mx-auto">
                                    We couldn't find any dishes matching your search. Try adjusting your filters or search query.
                                </p>
                                <button
                                    onClick={() => { setSearchQuery(""); setSelectedCategory("all"); }}
                                    className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-full shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-shadow"
                                >
                                    <X className="h-4 w-4" />
                                    Clear All Filters
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </section>
        </div>
    );
}

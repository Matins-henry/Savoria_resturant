import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";
import { useRef } from "react";
import {
    ArrowRight,
    Star,
    Clock,
    MapPin,
    Award,
    UtensilsCrossed,
    Sparkles,
    Quote,
    Calendar,
} from "lucide-react";
import { useState, useEffect } from "react";
import { menuService } from "../../services/api";
import { useToast } from "../../context/ToastContext";
import { type Meal } from "../../Components/Features/MealCard";

// Assets
import heroBackground from "../../assets/Hero background.jpg";
import Diner1 from "../../assets/Diner1.png";
import Diner2 from "../../assets/Diner2.png";
import Diner3 from "../../assets/Diner3.png";

export default function Home() {
    const heroRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ["start start", "end start"],
    });

    const heroImageScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
    const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

    // Mouse Parallax for Hero
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const smoothMouseX = useSpring(mouseX, { damping: 50, stiffness: 400 });
    const smoothMouseY = useSpring(mouseY, { damping: 50, stiffness: 400 });

    const rotateX = useTransform(smoothMouseY, [-300, 300], [5, -5]);
    const rotateY = useTransform(smoothMouseX, [-300, 300], [-5, 5]);

    const handleMouseMove = (e: React.MouseEvent) => {
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;
        mouseX.set(clientX - innerWidth / 2);
        mouseY.set(clientY - innerHeight / 2);
    };

    const { showToast } = useToast();
    const [featuredDishes, setFeaturedDishes] = useState<Meal[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDishes = async () => {
            try {
                const data = await menuService.getAll({ available: 'true' });
                const dishes = data.slice(0, 3).map((item: any) => ({
                    id: item._id,
                    name: item.name,
                    description: item.description,
                    price: item.price,
                    image: item.image,
                    category: item.category,
                    rating: item.rating,
                    reviews: item.reviews,
                    featured: item.isFeatured,
                    prepTime: `${item.prepTime} min`,
                    calories: item.calories
                }));
                setFeaturedDishes(dishes);
            } catch (error) {
                console.error("Failed to fetch featured dishes:", error);
                showToast("Failed to load featured dishes", "error");
            } finally {
                setIsLoading(false);
            }
        };
        fetchDishes();
    }, [showToast]);

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15, delayChildren: 0.2 },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 40 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as any },
        },
    };

    return (
        <div className="bg-gray-950 overflow-hidden selection:bg-amber-500/30">
            {/* ===== HERO SECTION ===== */}
            <section
                ref={heroRef}
                onMouseMove={handleMouseMove}
                className="relative min-h-screen flex items-center overflow-hidden perspective-1000"
            >
                {/* Background Image with Parallax */}
                <motion.div
                    style={{ scale: heroImageScale, opacity: heroOpacity }}
                    className="absolute inset-0"
                >
                    <img
                        src={heroBackground}
                        alt="Elegant restaurant interior with ambient lighting"
                        className="w-full h-full object-cover object-center"
                        loading="eager"
                    />

                    {/* Multi-layer Gradient Overlays */}
                    {/* Left-to-right dark overlay (80% → 40%) */}
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-950/95 via-gray-950/80 to-gray-950/40" />
                    {/* Bottom-to-top gradient for depth */}
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/60 to-transparent" />
                    {/* Top gradient for navbar blend */}
                    <div className="absolute inset-0 bg-gradient-to-b from-gray-950/70 via-transparent to-transparent" />
                    {/* Subtle amber/orange tint for warmth */}
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-900/10 via-transparent to-orange-900/10" />
                </motion.div>

                {/* Dot Grid Pattern Overlay */}
                <div className="absolute inset-0 opacity-[0.03]">
                    <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <pattern
                                id="heroGrid"
                                x="0"
                                y="0"
                                width="32"
                                height="32"
                                patternUnits="userSpaceOnUse"
                            >
                                <circle cx="1" cy="1" r="1" fill="white" />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#heroGrid)" />
                    </svg>
                </div>

                {/* Floating Gradient Orbs */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {/* Large orb - top right */}
                    <motion.div
                        animate={{
                            y: [0, -30, 0],
                            x: [0, 15, 0],
                            opacity: [0.4, 0.6, 0.4],
                            scale: [1, 1.1, 1],
                        }}
                        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-amber-500/20 rounded-full blur-[150px]"
                    />
                    {/* Medium orb - bottom left */}
                    <motion.div
                        animate={{
                            y: [0, 25, 0],
                            x: [0, -20, 0],
                            opacity: [0.3, 0.5, 0.3],
                            scale: [1, 1.15, 1],
                        }}
                        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                        className="absolute bottom-1/3 left-1/5 w-[400px] h-[400px] bg-orange-500/20 rounded-full blur-[120px]"
                    />
                    {/* Small orb - center */}
                    <motion.div
                        animate={{
                            y: [0, -20, 0],
                            opacity: [0.2, 0.4, 0.2],
                        }}
                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-red-500/15 rounded-full blur-[100px]"
                    />
                </div>

                {/* Hero Content */}
                <div className="relative w-full max-w-[1400px] mx-auto pl-6 sm:pl-10 lg:pl-16 xl:pl-24 pr-4 sm:pr-6 py-32 lg:py-40">
                    <motion.div
                        style={{ rotateX, rotateY }}
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="max-w-3xl will-change-transform"
                    >
                        {/* Award Badge */}
                        <motion.div variants={itemVariants}>
                            <span className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-500/20 via-orange-500/15 to-amber-500/20 border border-amber-500/30 text-amber-400 text-sm font-medium mb-8 backdrop-blur-sm shadow-lg shadow-amber-500/10">
                                <Award className="h-4 w-4" />
                                <span>Award-Winning Fine Dining Experience</span>
                                <Sparkles className="h-4 w-4 text-amber-300" />
                            </span>
                        </motion.div>

                        {/* Main Headline */}
                        <motion.h1
                            variants={itemVariants}
                            className="font-serif text-5xl sm:text-6xl lg:text-7xl font-medium text-white leading-[1.1] mb-8 tracking-tight"
                        >
                            Where Every Meal
                            <br />
                            Becomes a{" "}
                            <span className="relative inline-block">
                                <span className="relative z-10 bg-gradient-to-r from-amber-300 via-orange-400 to-red-400 bg-clip-text text-transparent">
                                    Masterpiece
                                </span>
                                {/* Animated SVG Underline */}
                                <motion.svg
                                    initial={{ pathLength: 0, opacity: 0 }}
                                    animate={{ pathLength: 1, opacity: 1 }}
                                    transition={{ duration: 1.5, delay: 1.2, ease: "easeInOut" }}
                                    className="absolute -bottom-2 left-0 w-full h-5"
                                    viewBox="0 0 280 20"
                                    fill="none"
                                    preserveAspectRatio="none"
                                >
                                    <motion.path
                                        initial={{ pathLength: 0 }}
                                        animate={{ pathLength: 1 }}
                                        transition={{ duration: 1.5, delay: 1.2, ease: "easeInOut" }}
                                        d="M0 15 Q50 5, 100 12 T200 8 T280 14"
                                        stroke="url(#heroUnderlineGradient)"
                                        strokeWidth="4"
                                        strokeLinecap="round"
                                        fill="none"
                                    />
                                    <defs>
                                        <linearGradient
                                            id="heroUnderlineGradient"
                                            x1="0%"
                                            y1="0%"
                                            x2="100%"
                                            y2="0%"
                                        >
                                            <stop offset="0%" stopColor="#fbbf24" />
                                            <stop offset="50%" stopColor="#f97316" />
                                            <stop offset="100%" stopColor="#ef4444" />
                                        </linearGradient>
                                    </defs>
                                </motion.svg>
                            </span>
                        </motion.h1>

                        {/* Description */}
                        <motion.p
                            variants={itemVariants}
                            className="text-xl lg:text-2xl text-gray-300 mb-10 leading-relaxed max-w-2xl"
                        >
                            Experience culinary excellence where tradition meets innovation.
                            Every dish is crafted with passion, precision, and the world's
                            finest ingredients by our award-winning chefs.
                        </motion.p>

                        {/* Dual CTA Buttons */}
                        <motion.div
                            variants={itemVariants}
                            className="flex flex-wrap items-center gap-4 mb-14"
                        >
                            {/* Primary CTA */}
                            <Link to="/menu">
                                <motion.button
                                    whileHover={{ scale: 1.03, boxShadow: "0 25px 50px -12px rgba(249, 115, 22, 0.5)" }}
                                    whileTap={{ scale: 0.98 }}
                                    className="group relative inline-flex items-center gap-3 px-8 py-4 overflow-hidden rounded-full shadow-2xl shadow-orange-500/30"
                                >
                                    {/* Button Gradient Background */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500" />
                                    {/* Hover Lighter Gradient */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    {/* Shine Effect */}
                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700" />
                                    </div>
                                    {/* Button Content */}
                                    <span className="relative text-white font-semibold text-lg">
                                        Explore Our Menu
                                    </span>
                                    <ArrowRight className="relative h-5 w-5 text-white group-hover:translate-x-1 transition-transform" />
                                </motion.button>
                            </Link>

                            {/* Secondary CTA - Ghost Button */}
                            <Link to="/booking">
                                <motion.button
                                    whileHover={{ scale: 1.03, backgroundColor: "rgba(255,255,255,0.1)" }}
                                    whileTap={{ scale: 0.98 }}
                                    className="group inline-flex items-center gap-3 px-8 py-4 text-white font-semibold text-lg border-2 border-white/25 rounded-full backdrop-blur-sm hover:border-white/40 transition-all"
                                >
                                    <Calendar className="h-5 w-5" />
                                    <span>Book a Table</span>
                                </motion.button>
                            </Link>
                        </motion.div>

                        {/* Trust Indicators */}
                        <motion.div
                            variants={itemVariants}
                            className="flex flex-wrap items-center gap-8 lg:gap-12 pt-8 border-t border-white/10"
                        >
                            {/* Rating */}
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 border border-amber-500/20 flex items-center justify-center">
                                    <Star className="h-6 w-6 text-amber-400 fill-amber-400" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-white">4.9</p>
                                    <p className="text-gray-500 text-sm">Rating</p>
                                </div>
                            </div>

                            {/* Years */}
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 border border-amber-500/20 flex items-center justify-center">
                                    <Clock className="h-6 w-6 text-amber-400" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-white">20+</p>
                                    <p className="text-gray-500 text-sm">Years</p>
                                </div>
                            </div>

                            {/* Locations */}
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 border border-amber-500/20 flex items-center justify-center">
                                    <MapPin className="h-6 w-6 text-amber-400" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-white">3</p>
                                    <p className="text-gray-500 text-sm">Locations</p>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>

                {/* Scroll Indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2.5, duration: 1 }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2"
                >
                    <motion.div
                        animate={{ y: [0, 10, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="flex flex-col items-center gap-3"
                    >
                        <span className="text-[11px] text-gray-500 uppercase tracking-[0.3em] font-medium">
                            Scroll to explore
                        </span>
                        <div className="w-7 h-11 rounded-full border-2 border-gray-600 flex justify-center pt-2">
                            <motion.div
                                animate={{ y: [0, 14, 0], opacity: [1, 0.3, 1] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                className="w-2 h-2 rounded-full bg-gradient-to-b from-amber-400 to-orange-500 shadow-lg shadow-orange-500/50"
                            />
                        </div>
                    </motion.div>
                </motion.div>
            </section>

            {/* ===== FEATURED DISHES SECTION ===== */}
            <section className="py-32 relative overflow-hidden">
                {/* Background */}
                <div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950" />
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[150px]" />
                    <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-orange-500/5 rounded-full blur-[150px]" />
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Section Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="text-center mb-20"
                    >
                        <motion.span
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/10 border border-amber-500/30 text-amber-400 text-sm font-medium mb-6 backdrop-blur-sm"
                        >
                            <UtensilsCrossed className="h-4 w-4" />
                            Our Signature Collection
                        </motion.span>
                        <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-medium text-white mb-6 tracking-tight">
                            Featured{" "}
                            <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
                                Dishes
                            </span>
                        </h2>
                        <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
                            Handcrafted with passion by our master chefs, each dish tells a story
                            of culinary excellence and artistic presentation.
                        </p>
                    </motion.div>

                    {/* Dishes Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {isLoading ? (
                            // Loading Skeletons
                            [...Array(3)].map((_, i) => (
                                <div key={i} className="h-[400px] bg-gray-900/50 rounded-3xl animate-pulse border border-white/5" />
                            ))
                        ) : featuredDishes.length > 0 ? (
                            featuredDishes.map((dish, index) => (
                                <motion.div
                                    key={dish.id}
                                    initial={{ opacity: 0, y: 50 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: index * 0.15 }}
                                    viewport={{ once: true }}
                                    className="group"
                                >
                                    <Link to={`/meal/${dish.id}`}>
                                        <div className="relative bg-gradient-to-br from-gray-900/80 to-gray-900/40 backdrop-blur-sm rounded-3xl overflow-hidden border border-white/5 hover:border-amber-500/30 transition-all duration-500">
                                            {/* Image */}
                                            <div className="relative h-64 overflow-hidden">
                                                <img
                                                    src={dish.image}
                                                    alt={dish.name}
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />

                                                {/* Category Badge */}
                                                <span className="absolute top-4 left-4 px-4 py-1.5 text-xs font-medium bg-gray-900/80 backdrop-blur-sm text-white rounded-full border border-white/10 capitalize">
                                                    {dish.category}
                                                </span>

                                                {/* Featured Badge */}
                                                {dish.featured && (
                                                    <span className="absolute top-4 right-4 px-4 py-1.5 text-xs font-semibold bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full shadow-lg shadow-orange-500/30 flex items-center gap-1">
                                                        <Sparkles className="h-3 w-3" />
                                                        Chef's Choice
                                                    </span>
                                                )}

                                                {/* Prep Time */}
                                                <div className="absolute bottom-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-gray-900/80 backdrop-blur-sm rounded-full border border-white/10">
                                                    <Clock className="h-3.5 w-3.5 text-amber-400" />
                                                    <span className="text-xs text-gray-300">{dish.prepTime}</span>
                                                </div>
                                            </div>

                                            {/* Content */}
                                            <div className="p-6">
                                                <div className="flex items-start justify-between gap-3 mb-3">
                                                    <h3 className="text-xl font-semibold text-white group-hover:text-amber-400 transition-colors">
                                                        {dish.name}
                                                    </h3>
                                                    <span className="text-xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent whitespace-nowrap">
                                                        ₦{dish.price.toLocaleString()}
                                                    </span>
                                                </div>

                                                <p className="text-gray-400 text-sm mb-4 line-clamp-2 leading-relaxed">
                                                    {dish.description}
                                                </p>

                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex items-center gap-1 px-2.5 py-1 bg-amber-500/10 rounded-full">
                                                            <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                                                            <span className="text-white font-medium text-sm">{dish.rating}</span>
                                                        </div>
                                                        <span className="text-gray-500 text-sm">({dish.reviews})</span>
                                                    </div>

                                                    <motion.span
                                                        whileHover={{ x: 5 }}
                                                        className="flex items-center gap-1 text-amber-400 text-sm font-medium"
                                                    >
                                                        View Details
                                                        <ArrowRight className="h-4 w-4" />
                                                    </motion.span>
                                                </div>
                                            </div>

                                            {/* Hover Glow */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-amber-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                                        </div>
                                    </Link>
                                </motion.div>
                            ))
                        ) : (
                            <div className="col-span-3 text-center py-20 bg-gray-900/30 rounded-[2.5rem] border border-white/5">
                                <UtensilsCrossed className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                                <p className="text-gray-500">No signature dishes available at the moment.</p>
                            </div>
                        )}
                    </div>

                    {/* View All Button */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="text-center mt-16"
                    >
                        <Link to="/menu">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="group inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white font-semibold text-lg rounded-full shadow-2xl shadow-orange-500/30 hover:shadow-orange-500/50 transition-shadow"
                            >
                                View Full Menu
                                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            </motion.button>
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* ===== TESTIMONIALS SECTION ===== */}
            <section className="py-32 relative overflow-hidden">
                <div className="absolute inset-0 bg-gray-950" />

                {/* Decorative Pattern */}
                <div className="absolute inset-0 opacity-[0.02]">
                    <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <pattern id="testimonialDots" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                                <circle cx="2" cy="2" r="1" fill="white" />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#testimonialDots)" />
                    </svg>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Section Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="text-center mb-20"
                    >
                        <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/10 border border-amber-500/30 text-amber-400 text-sm font-medium mb-6">
                            <Star className="h-4 w-4 fill-amber-400" />
                            What Our Guests Say
                        </span>
                        <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-medium text-white mb-6 tracking-tight">
                            Stories of{" "}
                            <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
                                Delight
                            </span>
                        </h2>
                        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                            Every meal tells a story. Here's what our valued guests have to share
                            about their Savoria experience.
                        </p>
                    </motion.div>

                    {/* Testimonials Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            {
                                name: "Amina Yusuf",
                                role: "Food Critic @LagosGourmet",
                                avatar: Diner1,
                                content: "An extraordinary culinary journey. Every dish is a masterpiece that resonates with the heritage of fine dining. Savoria is simply in a class of its own.",
                                rating: 5,
                            },
                            {
                                name: "Chidi Okoro",
                                role: "CEO, TechNexus Solutions",
                                avatar: Diner2,
                                content: "The perfect venue for our company's executive dinner. The truffle-infused delicacies and the impeccable service left every guest impressed. A must-visit in Lagos.",
                                rating: 5,
                            },
                            {
                                name: "Bisi Adeyemi",
                                role: "Lifestyle Blogger @BisiStyle",
                                avatar: Diner3,
                                content: "The seafood platter is truly world-class. The flavors are vibrant, the presentation is art, and the atmosphere is electric. My absolute favorite spot!",
                                rating: 5,
                            },
                        ].map((testimonial, index) => (
                            <motion.div
                                key={testimonial.name}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.15 }}
                                viewport={{ once: true }}
                                className="group"
                            >
                                <div className="relative h-full bg-gradient-to-br from-gray-900/80 to-gray-900/40 backdrop-blur-sm rounded-3xl p-8 border border-white/5 hover:border-amber-500/20 transition-all duration-500">
                                    {/* Quote Icon */}
                                    <div className="absolute -top-4 -left-2">
                                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 flex items-center justify-center border border-amber-500/20">
                                            <Quote className="h-6 w-6 text-amber-400" />
                                        </div>
                                    </div>

                                    {/* Rating */}
                                    <div className="flex gap-1 mb-6 mt-4">
                                        {[...Array(testimonial.rating)].map((_, i) => (
                                            <Star key={i} className="h-5 w-5 text-amber-400 fill-amber-400" />
                                        ))}
                                    </div>

                                    {/* Content */}
                                    <p className="text-gray-300 leading-relaxed mb-8">
                                        "{testimonial.content}"
                                    </p>

                                    {/* Author */}
                                    <div className="flex items-center gap-4 pt-6 border-t border-white/5">
                                        <div className="relative">
                                            <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full blur-sm opacity-0 group-hover:opacity-50 transition-opacity" />
                                            <img
                                                src={testimonial.avatar}
                                                alt={testimonial.name}
                                                className="relative w-14 h-14 rounded-full object-cover ring-2 ring-white/10 group-hover:ring-amber-500/30 transition-all"
                                            />
                                        </div>
                                        <div>
                                            <p className="text-white font-semibold">{testimonial.name}</p>
                                            <p className="text-gray-500 text-sm">{testimonial.role}</p>
                                        </div>
                                    </div>

                                    {/* Hover Glow */}
                                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-amber-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8"
                    >
                        {[
                            { value: "15,000+", label: "Happy Customers" },
                            { value: "4.9", label: "Average Rating", icon: Star },
                            { value: "98%", label: "Would Recommend" },
                            { value: "500+", label: "5-Star Reviews" },
                        ].map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="text-center"
                            >
                                <div className="flex items-center justify-center gap-2 mb-2">
                                    <span className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                                        {stat.value}
                                    </span>
                                    {stat.icon && <stat.icon className="h-7 w-7 text-amber-400 fill-amber-400" />}
                                </div>
                                <p className="text-gray-500">{stat.label}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ===== CTA SECTION ===== */}
            <section className="py-32 relative overflow-hidden">
                {/* Background */}
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1920&h=800&fit=crop"
                        alt="Restaurant atmosphere"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gray-950/90 backdrop-blur-sm" />
                </div>

                {/* Decorative Glow */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-amber-500/10 rounded-full blur-[200px]" />
                </div>

                <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/10 border border-amber-500/30 text-amber-400 text-sm font-medium mb-8">
                            <Sparkles className="h-4 w-4" />
                            Reserve Your Experience
                        </span>

                        <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-medium text-white mb-6 leading-tight tracking-tight">
                            Ready for an
                            <br />
                            <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
                                Unforgettable Dining Experience?
                            </span>
                        </h2>

                        <p className="text-gray-400 text-xl mb-12 max-w-2xl mx-auto">
                            Join us for an evening of exceptional cuisine, impeccable service,
                            and memories that last a lifetime.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link to="/booking">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="group inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white font-semibold text-lg rounded-full shadow-2xl shadow-orange-500/30"
                                >
                                    Reserve a Table
                                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                </motion.button>
                            </Link>

                            <a href="tel:+15551234567">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="inline-flex items-center gap-3 px-10 py-5 text-white font-semibold text-lg border-2 border-white/20 rounded-full hover:bg-white/10 transition-all"
                                >
                                    <Clock className="h-5 w-5" />
                                    Call Us
                                </motion.button>
                            </a>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}

import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import {
    Menu, X, ShoppingBag, User, LogOut, Settings,
    History, Calendar, ChevronDown, Sparkles, Search
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";

const navLinks = [
    { name: "Home", path: "/" },
    { name: "Menu", path: "/menu" },
    { name: "About", path: "/about" },
    { name: "Book Table", path: "/booking", isPrimary: true },
];

export default function Navbar() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const { cartCount } = useCart();

    // State
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    // Refs
    const searchInputRef = useRef<HTMLInputElement>(null);

    // Scroll Effects
    const { scrollY } = useScroll();
    const backgroundOpacity = useTransform(scrollY, [0, 50], [0, 1]);
    const borderOpacity = useTransform(scrollY, [0, 50], [0, 1]);

    useEffect(() => {
        setIsMobileMenuOpen(false);
        setIsUserMenuOpen(false);
    }, [location.pathname]);

    useEffect(() => {
        if (isSearchOpen && searchInputRef.current) {
            setTimeout(() => {
                searchInputRef.current?.focus();
            }, 100);
        }
    }, [isSearchOpen]);

    // Close menus on escape
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setIsSearchOpen(false);
                setIsUserMenuOpen(false);
                setIsMobileMenuOpen(false);
            }
        };
        window.addEventListener("keydown", handleEscape);
        return () => window.removeEventListener("keydown", handleEscape);
    }, []);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/menu?search=${encodeURIComponent(searchQuery)}`);
            setIsSearchOpen(false);
            setSearchQuery("");
        }
    };

    return (
        <>
            <motion.header
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as any }}
                className="fixed top-0 left-0 right-0 z-50"
            >
                {/* Glassmorphism Background */}
                <motion.div
                    style={{ opacity: backgroundOpacity }}
                    className="absolute inset-0 bg-gray-950/80 backdrop-blur-2xl"
                />
                <motion.div
                    style={{ opacity: borderOpacity }}
                    className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent"
                />

                <nav className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20 lg:h-24">
                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-3 group relative z-10">
                            <motion.div
                                whileHover={{ scale: 1.05, rotate: 5 }}
                                whileTap={{ scale: 0.95 }}
                                className="relative"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
                                <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 flex items-center justify-center shadow-2xl shadow-orange-500/30">
                                    <span className="text-white font-bold text-2xl font-serif">S</span>
                                </div>
                            </motion.div>
                            <div className="hidden sm:block">
                                <motion.span
                                    className="text-2xl font-bold bg-gradient-to-r from-white via-white to-gray-300 bg-clip-text text-transparent tracking-tight"
                                    whileHover={{ scale: 1.02 }}
                                >
                                    Savoria
                                </motion.span>
                                <p className="text-[10px] uppercase tracking-[0.3em] text-amber-500/70 font-medium">
                                    Fine Dining
                                </p>
                            </div>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden lg:flex items-center gap-1">
                            {navLinks.map((link, index) => {
                                const isActive = location.pathname === link.path;
                                return (
                                    <motion.div
                                        key={link.path}
                                        initial={{ opacity: 0, y: -20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: 0.1 + index * 0.05 }}
                                    >
                                        <Link
                                            to={link.path}
                                            className="relative px-5 py-2.5 group"
                                        >
                                            <span
                                                className={`relative z-10 text-sm font-medium transition-colors duration-300 ${isActive
                                                    ? "text-amber-400"
                                                    : "text-gray-300 group-hover:text-white"
                                                    }`}
                                            >
                                                {link.name}
                                            </span>
                                            {/* Active Indicator */}
                                            {isActive && (
                                                <motion.div
                                                    layoutId="activeNavIndicator"
                                                    className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 rounded-full"
                                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                                />
                                            )}
                                            {/* Hover Glow */}
                                            <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 bg-gradient-to-r from-amber-500/5 to-orange-500/5 transition-opacity duration-300" />
                                            {/* Active Dot */}
                                            {isActive && (
                                                <motion.div
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 shadow-lg shadow-amber-500/50"
                                                />
                                            )}
                                        </Link>
                                    </motion.div>
                                );
                            })}
                        </div>

                        {/* Right Actions */}
                        <div className="flex items-center gap-1 sm:gap-2">
                            {/* Search Button */}
                            <motion.button
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5, delay: 0.3 }}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setIsSearchOpen(true)}
                                className="relative p-3 rounded-full text-gray-400 hover:text-white transition-colors group"
                            >
                                <div className="absolute inset-0 rounded-full bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <Search className="h-5 w-5 relative z-10" />
                            </motion.button>

                            {/* Cart Button */}
                            <Link to="/cart">
                                <motion.button
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.5, delay: 0.35 }}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="relative p-3 rounded-full text-gray-400 hover:text-white transition-colors group"
                                >
                                    <div className="absolute inset-0 rounded-full bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <ShoppingBag className="h-5 w-5 relative z-10" />
                                    {cartCount > 0 && (
                                        <motion.span
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="absolute -top-0.5 -right-0.5 w-5 h-5 flex items-center justify-center text-[10px] font-bold text-white bg-gradient-to-r from-amber-500 to-red-500 rounded-full shadow-lg shadow-red-500/30 ring-2 ring-gray-950"
                                        >
                                            {cartCount > 9 ? "9+" : cartCount}
                                        </motion.span>
                                    )}
                                </motion.button>
                            </Link>

                            {/* User Menu / Auth Buttons */}
                            {user ? (
                                <div className="relative">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                        className="flex items-center gap-2 p-1.5 pl-1.5 pr-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
                                    >
                                        <div className="relative">
                                            <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full blur-sm opacity-50" />
                                            <div className="relative w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center ring-2 ring-white/20">
                                                {user.avatar ? (
                                                    <img
                                                        src={user.avatar}
                                                        alt={user.name}
                                                        className="w-full h-full rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <span className="text-white text-sm font-semibold">
                                                        {user.name[0].toUpperCase()}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <span className="hidden sm:block text-sm font-medium text-white">
                                            {user.name.split(" ")[0]}
                                        </span>
                                        <ChevronDown
                                            className={`h-4 w-4 text-gray-400 transition-transform duration-300 ${isUserMenuOpen ? "rotate-180" : ""
                                                }`}
                                        />
                                    </motion.button>

                                    <AnimatePresence>
                                        {isUserMenuOpen && (
                                            <>
                                                <motion.div
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    className="fixed inset-0 z-40"
                                                    onClick={() => setIsUserMenuOpen(false)}
                                                />
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                    transition={{ duration: 0.2 }}
                                                    className="absolute right-0 mt-3 w-64 py-2 bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-black/50 z-50 overflow-hidden"
                                                >
                                                    {/* User Info */}
                                                    <div className="px-4 py-4 border-b border-white/10 bg-gradient-to-r from-amber-500/10 to-orange-500/10">
                                                        <p className="text-white font-semibold">{user.name}</p>
                                                        <p className="text-amber-400/70 text-sm flex items-center gap-1">
                                                            <Sparkles className="h-3 w-3" />
                                                            Premium Member
                                                        </p>
                                                    </div>

                                                    {/* Menu Items */}
                                                    <div className="py-2">
                                                        {[
                                                            { icon: User, label: "My Profile", path: "/profile" },
                                                            { icon: History, label: "Order History", path: "/profile" },
                                                            { icon: Calendar, label: "My Reservations", path: "/profile" },
                                                            { icon: Settings, label: "Settings", path: "/profile" },
                                                        ].map((item) => (
                                                            <Link
                                                                key={item.path}
                                                                to={item.path}
                                                                className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 transition-all group"
                                                            >
                                                                <item.icon className="h-4 w-4 text-gray-500 group-hover:text-amber-400 transition-colors" />
                                                                {item.label}
                                                            </Link>
                                                        ))}
                                                    </div>

                                                    {/* Logout */}
                                                    <div className="border-t border-white/10 pt-2">
                                                        <button
                                                            onClick={() => {
                                                                logout();
                                                                setIsUserMenuOpen(false);
                                                            }}
                                                            className="flex items-center gap-3 w-full px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
                                                        >
                                                            <LogOut className="h-4 w-4" />
                                                            Sign Out
                                                        </button>
                                                    </div>
                                                </motion.div>
                                            </>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.5, delay: 0.4 }}
                                    className="hidden sm:flex items-center gap-3"
                                >
                                    <Link to="/login">
                                        <button
                                            className="px-5 py-2.5 text-sm font-medium text-gray-300 hover:text-white transition-colors"
                                        >
                                            Sign In
                                        </button>
                                    </Link>
                                    <Link to="/signup">
                                        <motion.button
                                            whileHover={{ scale: 1.02, boxShadow: "0 20px 40px -10px rgba(249, 115, 22, 0.4)" }}
                                            whileTap={{ scale: 0.98 }}
                                            className="relative px-6 py-2.5 text-sm font-semibold text-white rounded-full overflow-hidden group"
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500" />
                                            <div className="absolute inset-0 bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            <span className="relative flex items-center gap-2">
                                                <Sparkles className="h-4 w-4" />
                                                Get Started
                                            </span>
                                        </motion.button>
                                    </Link>
                                </motion.div>
                            )}

                            {/* Mobile Menu Toggle */}
                            <motion.button
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="lg:hidden relative p-3 rounded-full text-gray-400 hover:text-white transition-colors"
                            >
                                <AnimatePresence mode="wait">
                                    {isMobileMenuOpen ? (
                                        <motion.div
                                            key="close"
                                            initial={{ rotate: -90, opacity: 0 }}
                                            animate={{ rotate: 0, opacity: 1 }}
                                            exit={{ rotate: 90, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <X className="h-5 w-5" />
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="menu"
                                            initial={{ rotate: 90, opacity: 0 }}
                                            animate={{ rotate: 0, opacity: 1 }}
                                            exit={{ rotate: -90, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <Menu className="h-5 w-5" />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.button>
                        </div>
                    </div>
                </nav>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] as any }}
                            className="lg:hidden overflow-hidden"
                        >
                            <motion.div
                                initial={{ y: -20 }}
                                animate={{ y: 0 }}
                                className="relative px-4 py-6 bg-gray-950/95 backdrop-blur-xl border-t border-white/5"
                            >
                                {/* Gradient Glow */}
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />

                                <div className="space-y-1">
                                    {navLinks.map((link, index) => {
                                        const isActive = location.pathname === link.path;
                                        return (
                                            <motion.div
                                                key={link.path}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                            >
                                                <Link
                                                    to={link.path}
                                                    className={`block py-4 px-5 rounded-xl font-medium transition-all ${isActive
                                                        ? "bg-gradient-to-r from-amber-500/20 to-orange-500/10 text-amber-400 border border-amber-500/20"
                                                        : "text-gray-300 hover:bg-white/5 hover:text-white"
                                                        }`}
                                                >
                                                    {link.name}
                                                </Link>
                                            </motion.div>
                                        );
                                    })}
                                </div>

                                {!user && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                        className="flex gap-3 mt-6 pt-6 border-t border-white/10"
                                    >
                                        <Link to="/login" className="flex-1">
                                            <button
                                                className="w-full py-3.5 text-gray-300 border border-white/20 rounded-xl hover:bg-white/5 transition-all font-medium"
                                            >
                                                Sign In
                                            </button>
                                        </Link>
                                        <Link to="/signup" className="flex-1">
                                            <button
                                                className="w-full py-3.5 text-white bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl font-semibold shadow-lg shadow-orange-500/25"
                                            >
                                                Get Started
                                            </button>
                                        </Link>
                                    </motion.div>
                                )}
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.header>

            {/* Search Overlay */}
            <AnimatePresence>
                {isSearchOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 z-[60] bg-gray-950/98 backdrop-blur-xl flex items-start justify-center pt-24 sm:pt-32"
                        onClick={() => setIsSearchOpen(false)}
                    >
                        {/* Decorative Elements */}
                        <div className="absolute inset-0 overflow-hidden pointer-events-none">
                            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-[150px]" />
                            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-[150px]" />
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: -30, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -30, scale: 0.95 }}
                            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] as any }}
                            className="relative w-full max-w-2xl px-4"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <form onSubmit={handleSearchSubmit}>
                                <div className="relative group">
                                    {/* Glow Effect */}
                                    <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-red-500/20 rounded-3xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />

                                    <div className="relative bg-gray-900/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
                                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-500" />
                                        <input
                                            ref={searchInputRef}
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Search for dishes, ingredients, categories..."
                                            className="w-full bg-transparent pl-16 pr-6 py-6 text-xl text-white placeholder-gray-500 focus:outline-none"
                                        />
                                    </div>
                                </div>
                            </form>

                            <div className="flex items-center justify-center gap-6 mt-6 text-gray-600 text-sm">
                                <span className="flex items-center gap-2">
                                    <kbd className="px-2 py-1 bg-white/10 rounded text-xs">ESC</kbd>
                                    to close
                                </span>
                                <span className="flex items-center gap-2">
                                    <kbd className="px-2 py-1 bg-white/10 rounded text-xs">↵</kbd>
                                    to search
                                </span>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

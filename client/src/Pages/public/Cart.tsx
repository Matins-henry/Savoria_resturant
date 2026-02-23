import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, ArrowRight, ShoppingBag, ArrowLeft } from "lucide-react";
import Button from "../../Components/UI/Button";
import QuantitySelector from "../../Components/Features/QuantitySelector";
import { useCart } from "../../context/CartContext";

export default function Cart() {
    const navigate = useNavigate();
    const { items: cartItems, updateQuantity, removeItem, cartTotal } = useCart();

    const subtotal = cartTotal;
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + tax;

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-gray-950 pt-32 pb-20 px-4 flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center max-w-md"
                >
                    <div className="w-24 h-24 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/10">
                        <ShoppingBag className="h-10 w-10 text-gray-500" />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-4">Your Cart is Empty</h2>
                    <p className="text-gray-400 mb-8">
                        Looks like you haven't added any delicious meals yet.
                    </p>
                    <Link to="/menu">
                        <Button size="lg" rightIcon={<ArrowRight className="h-5 w-5" />}>
                            Browse Menu
                        </Button>
                    </Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-950 pt-32 pb-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-4 mb-10"
                >
                    <Link to="/menu" className="text-gray-400 hover:text-white transition-colors">
                        <ArrowLeft className="h-6 w-6" />
                    </Link>
                    <h1 className="text-3xl sm:text-4xl font-bold text-white">Your Cart</h1>
                    <span className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-sm font-medium">
                        {cartItems.length} items
                    </span>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Cart Items List */}
                    <div className="lg:col-span-2 space-y-6">
                        <AnimatePresence mode="popLayout">
                            {cartItems.map((item) => (
                                <motion.div
                                    key={item.id}
                                    layout
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-gray-900/50 backdrop-blur-sm border border-white/5 rounded-2xl"
                                >
                                    {/* Image */}
                                    <div className="w-full sm:w-32 h-32 shrink-0 rounded-xl overflow-hidden bg-gray-800">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    {/* Details */}
                                    <div className="flex-1 w-full text-center sm:text-left">
                                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                                            <div>
                                                <h3 className="text-xl font-semibold text-white mb-1">
                                                    {item.name}
                                                </h3>
                                                <p className="text-sm text-gray-500">{item.category}</p>
                                            </div>
                                            <p className="text-xl font-bold text-amber-400">
                                                ₦{(item.price * item.quantity).toLocaleString()}
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-between sm:justify-start gap-6">
                                            <QuantitySelector
                                                value={item.quantity}
                                                onChange={(newValue) => updateQuantity(item.id, newValue)}
                                                size="sm"
                                            />
                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className="text-gray-500 hover:text-red-400 transition-colors p-2 hover:bg-red-500/10 rounded-lg"
                                                aria-label="Remove item"
                                            >
                                                <Trash2 className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-gray-900/80 backdrop-blur-md border border-white/10 rounded-2xl p-8 sticky top-32"
                        >
                            <h2 className="text-2xl font-bold text-white mb-6">Order Summary</h2>

                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between text-gray-400">
                                    <span>Subtotal</span>
                                    <span className="text-white font-medium">₦{subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-gray-400">
                                    <span>Tax (8%)</span>
                                    <span className="text-white font-medium">₦{tax.toLocaleString()}</span>
                                </div>
                                <div className="h-px bg-white/10 my-4" />
                                <div className="flex justify-between text-lg font-bold">
                                    <span className="text-white">Total</span>
                                    <span className="text-amber-400">₦{total.toLocaleString()}</span>
                                </div>
                            </div>

                            <Button
                                fullWidth
                                size="lg"
                                onClick={() => navigate("/checkout")}
                                rightIcon={<ArrowRight className="h-5 w-5" />}
                            >
                                Proceed to Checkout
                            </Button>

                            <p className="text-xs text-center text-gray-500 mt-6">
                                Secure checkout powered by Stripe.
                                <br />
                                Prices include VAT where applicable.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}

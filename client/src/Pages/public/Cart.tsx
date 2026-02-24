import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, ArrowRight, ShoppingBag, ArrowLeft, CheckCircle, CreditCard, Truck } from "lucide-react";
import Button from "../../Components/UI/Button";
import Input from "../../Components/UI/Input";
import QuantitySelector from "../../Components/Features/QuantitySelector";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { orderService } from "../../services/api";

export default function Cart() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { showToast } = useToast();
    const { items: cartItems, updateQuantity, removeItem, cartTotal, clearCart } = useCart();

    const [isPlacingOrder, setIsPlacingOrder] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(false);
    const [shippingData, setShippingData] = useState({
        fullName: user?.name || "",
        email: user?.email || "",
        phone: user?.phone || "",
        street: user?.addresses?.find(a => a.isDefault)?.street || "",
        city: user?.addresses?.find(a => a.isDefault)?.city || "",
        zipCode: user?.addresses?.find(a => a.isDefault)?.zip || ""
    });

    // Pre-fill user data if they login/load
    useEffect(() => {
        if (user) {
            const defaultAddr = user.addresses?.find(a => a.isDefault);
            setShippingData(prev => ({
                ...prev,
                fullName: user.name,
                email: user.email,
                phone: user.phone || prev.phone,
                street: defaultAddr?.street || prev.street,
                city: defaultAddr?.city || prev.city,
                zipCode: defaultAddr?.zip || prev.zipCode
            }));
        }
    }, [user]);

    const subtotal = cartTotal;
    const shippingThreshold = 50000;
    const shippingCost = subtotal >= shippingThreshold ? 0 : 2000;
    const total = subtotal + shippingCost;

    const handlePlaceOrder = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user) {
            showToast("Please sign in to place an order", "error");
            navigate("/login", { state: { from: "/cart" } });
            return;
        }

        if (!shippingData.phone || !shippingData.street || !shippingData.city) {
            showToast("Please complete your delivery details", "error");
            return;
        }

        setIsPlacingOrder(true);
        try {
            const orderData = {
                items: cartItems.map(item => ({
                    menuItem: item.id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    image: item.image
                })),
                deliveryAddress: {
                    street: shippingData.street,
                    city: shippingData.city,
                    state: "Nigeria",
                    zip: shippingData.zipCode
                },
                contactInfo: {
                    name: shippingData.fullName,
                    email: shippingData.email,
                    phone: shippingData.phone
                },
                paymentMethod: "card",
                notes: ""
            };

            await orderService.create(orderData);

            setOrderSuccess(true);
            clearCart();
            showToast("Order placed successfully!", "success");
        } catch (error: any) {
            console.error("Order error:", error);
            showToast(error.response?.data?.error || "Failed to place order. Try again.", "error");
        } finally {
            setIsPlacingOrder(false);
        }
    };

    if (orderSuccess) {
        return (
            <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-gray-900 border border-white/10 rounded-2xl p-8 max-w-md text-center"
                >
                    <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="h-10 w-10 text-green-500" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Order Confirmed!</h1>
                    <p className="text-gray-400 mb-8">
                        Thank you for your order. We've started preparing your delicious meal.
                    </p>
                    <div className="flex flex-col gap-3">
                        <Button onClick={() => navigate("/profile")} fullWidth>
                            View My Orders
                        </Button>
                        <Button onClick={() => navigate("/")} variant="outline" fullWidth>
                            Return Home
                        </Button>
                    </div>
                </motion.div>
            </div>
        );
    }

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
                    <h1 className="text-3xl sm:text-4xl font-bold text-white">Review & Order</h1>
                    <span className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-sm font-medium">
                        {cartItems.length} items
                    </span>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Left Column: Cart Items & Delivery Form */}
                    <div className="lg:col-span-2 space-y-12">
                        {/* Cart Items */}
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <ShoppingBag className="h-5 w-5 text-amber-500" />
                                Cart Items
                            </h2>
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
                                        <div className="w-full sm:w-32 h-32 shrink-0 rounded-xl overflow-hidden bg-gray-800">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 w-full text-center sm:text-left">
                                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                                                <div>
                                                    <h3 className="text-xl font-semibold text-white mb-1">{item.name}</h3>
                                                    <p className="text-sm text-gray-500">{item.category}</p>
                                                </div>
                                                <p className="text-xl font-bold text-amber-400">₦{(item.price * item.quantity).toLocaleString()}</p>
                                            </div>
                                            <div className="flex items-center justify-between sm:justify-start gap-6">
                                                <QuantitySelector value={item.quantity} onChange={(newValue) => updateQuantity(item.id, newValue)} size="sm" />
                                                <button onClick={() => removeItem(item.id)} className="text-gray-500 hover:text-red-400 transition-colors p-2 hover:bg-red-500/10 rounded-lg">
                                                    <Trash2 className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>

                        {/* Delivery Form */}
                        <div className="bg-gray-900/50 backdrop-blur-sm border border-white/5 rounded-2xl p-6 sm:p-8">
                            <h2 className="text-xl font-bold text-white mb-8 flex items-center gap-2">
                                <Truck className="h-5 w-5 text-amber-500" />
                                Delivery Details
                            </h2>
                            <form className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Input
                                        label="Full Name"
                                        value={shippingData.fullName}
                                        onChange={(e) => setShippingData({ ...shippingData, fullName: e.target.value })}
                                        required
                                        fullWidth
                                    />
                                    <Input
                                        label="Phone Number"
                                        value={shippingData.phone}
                                        onChange={(e) => setShippingData({ ...shippingData, phone: e.target.value })}
                                        required
                                        fullWidth
                                    />
                                </div>
                                <Input
                                    label="Street Address"
                                    value={shippingData.street}
                                    onChange={(e) => setShippingData({ ...shippingData, street: e.target.value })}
                                    placeholder="e.g. 15, Victoria Island..."
                                    required
                                    fullWidth
                                />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Input
                                        label="City"
                                        value={shippingData.city}
                                        onChange={(e) => setShippingData({ ...shippingData, city: e.target.value })}
                                        required
                                        fullWidth
                                    />
                                    <Input
                                        label="Zip Code (Optional)"
                                        value={shippingData.zipCode}
                                        onChange={(e) => setShippingData({ ...shippingData, zipCode: e.target.value })}
                                        fullWidth
                                    />
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Right Column: Order Summary & Place Order */}
                    <div className="lg:col-span-1">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-gray-900/80 backdrop-blur-md border border-white/10 rounded-2xl p-8 sticky top-32"
                        >
                            <h2 className="text-2xl font-bold text-white mb-6">Total Summary</h2>

                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between text-gray-400">
                                    <span>Subtotal</span>
                                    <span className="text-white font-medium">₦{subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-gray-400">
                                    <span>Shipping</span>
                                    <span className="text-white font-medium">
                                        {shippingCost === 0 ? "FREE" : `₦${shippingCost.toLocaleString()}`}
                                    </span>
                                </div>
                                <div className="h-px bg-white/10 my-4" />
                                <div className="flex justify-between text-lg font-bold">
                                    <span className="text-white">Total</span>
                                    <span className="text-amber-400">₦{total.toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl mb-8 flex items-start gap-3">
                                <CreditCard className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                                <p className="text-xs text-amber-200/70">
                                    Payment will be collected upon delivery or via direct transfer once the order is confirmed by our team.
                                </p>
                            </div>

                            <Button
                                fullWidth
                                size="lg"
                                onClick={handlePlaceOrder}
                                isLoading={isPlacingOrder}
                                rightIcon={<ArrowRight className="h-5 w-5" />}
                            >
                                Place Order Now
                            </Button>

                            <p className="text-[10px] text-center text-gray-500 mt-6 uppercase tracking-wider">
                                Order will be synced directly to the kitchen
                            </p>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}

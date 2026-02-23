import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, CreditCard, Truck, CheckCircle } from "lucide-react";
import Button from "../../Components/UI/Button";
import Input from "../../Components/UI/Input";
import { useCart } from "../../context/CartContext";
import { orderService } from "../../services/api";
import { useToast } from "../../context/ToastContext";

export default function Checkout() {
    const navigate = useNavigate();
    const { items: cartItems, cartTotal, clearCart } = useCart();
    const { showToast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Success

    const [shippingData, setShippingData] = useState({
        fullName: "",
        email: "",
        streetBy: "",
        city: "",
        zipCode: "",
        phone: ""
    });

    const subtotal = cartTotal;
    const tax = subtotal * 0.08;
    const shippingThreshold = 50000;
    const shippingCost = subtotal >= shippingThreshold ? 0 : 2000;
    const total = subtotal + tax + shippingCost;

    const handleShippingSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStep(2);
    };

    const handlePlaceOrder = async () => {
        setIsLoading(true);
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
                    street: shippingData.streetBy,
                    city: shippingData.city,
                    state: "Nigeria", // Default or could be added to form
                    zip: shippingData.zipCode
                },
                contactInfo: {
                    name: shippingData.fullName,
                    email: shippingData.email,
                    phone: shippingData.phone
                },
                paymentMethod: "card",
                notes: "" // Optional notes field if added to form
            };

            await orderService.create(orderData);

            showToast("Order placed successfully!", "success");
            clearCart();
            setStep(3);
        } catch (error) {
            console.error("Place order error:", error);
            showToast("Failed to place order. Please try again.", "error");
        } finally {
            setIsLoading(false);
        }
    };

    if (cartItems.length === 0 && step !== 3) {
        return (
            <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
                <div className="text-center">
                    <h2 className="text-2xl text-white mb-4">Your cart is empty</h2>
                    <Link to="/menu">
                        <Button>Browse Menu</Button>
                    </Link>
                </div>
            </div>
        );
    }

    if (step === 3) {
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
                        Thank you for your order. We've sent a confirmation email to {shippingData.email}.
                    </p>
                    <div className="flex gap-4 justify-center">
                        <Button onClick={() => navigate("/")} variant="outline">
                            Return Home
                        </Button>
                        <Button onClick={() => navigate("/profile")}>
                            View Order
                        </Button>
                    </div>
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
                    className="grid grid-cols-1 lg:grid-cols-2 gap-12"
                >
                    {/* Left Column: Forms */}
                    <div>
                        <Link to="/cart" className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Cart
                        </Link>

                        <div className="bg-gray-900/50 backdrop-blur-sm border border-white/5 rounded-2xl p-6 sm:p-8">
                            <div className="flex items-center gap-4 mb-8">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step === 1 ? 'bg-amber-500 text-black' : 'bg-gray-800 text-gray-500'}`}>1</div>
                                <h2 className={`text-xl font-bold ${step === 1 ? 'text-white' : 'text-gray-500'}`}>Shipping Details</h2>
                            </div>

                            {step === 1 && (
                                <form onSubmit={handleShippingSubmit} className="space-y-6">
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
                                        label="Email Address"
                                        type="email"
                                        value={shippingData.email}
                                        onChange={(e) => setShippingData({ ...shippingData, email: e.target.value })}
                                        required
                                        fullWidth
                                    />
                                    <Input
                                        label="Street Address"
                                        value={shippingData.streetBy}
                                        onChange={(e) => setShippingData({ ...shippingData, streetBy: e.target.value })}
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
                                            label="Zip Code"
                                            value={shippingData.zipCode}
                                            onChange={(e) => setShippingData({ ...shippingData, zipCode: e.target.value })}
                                            required
                                            fullWidth
                                        />
                                    </div>
                                    <Button type="submit" fullWidth size="lg">
                                        Continue to Payment
                                    </Button>
                                </form>
                            )}

                            {step === 2 && (
                                <div className="p-4 bg-gray-800/50 rounded-lg mb-8">
                                    <p className="text-gray-300 text-sm">Shipping to:</p>
                                    <p className="text-white font-medium">{shippingData.streetBy}, {shippingData.city}</p>
                                    <button onClick={() => setStep(1)} className="text-amber-500 text-sm hover:underline mt-1">
                                        Edit
                                    </button>
                                </div>
                            )}

                            <div className="flex items-center gap-4 my-8">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step === 2 ? 'bg-amber-500 text-black' : 'bg-gray-800 text-gray-500'}`}>2</div>
                                <h2 className={`text-xl font-bold ${step === 2 ? 'text-white' : 'text-gray-500'}`}>Payment</h2>
                            </div>

                            {step === 2 && (
                                <div className="space-y-6">
                                    <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 flex items-center gap-4">
                                        <CreditCard className="h-6 w-6 text-amber-500" />
                                        <div>
                                            <p className="text-white font-medium">Credit Card (Mock)</p>
                                            <p className="text-xs text-gray-500">Secure simulated transaction</p>
                                        </div>
                                    </div>
                                    {/* Add more payment methods here later */}

                                    <Button
                                        fullWidth
                                        size="lg"
                                        onClick={handlePlaceOrder}
                                        isLoading={isLoading}
                                    >
                                        Place Order (₦{total.toLocaleString()})
                                    </Button>
                                    <button
                                        onClick={() => setStep(1)}
                                        className="w-full text-center text-gray-400 text-sm hover:text-white mt-4"
                                    >
                                        Back to Shipping
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Order Summary */}
                    <div className="lg:pl-8">
                        <div className="bg-gray-900 border border-white/10 rounded-2xl p-6 sticky top-32">
                            <h3 className="text-xl font-bold text-white mb-6">Order Summary</h3>
                            <div className="space-y-4 mb-6 max-h-96 overflow-y-auto custom-scrollbar pr-2">
                                {cartItems.map(item => (
                                    <div key={item.id} className="flex gap-4">
                                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-800 flex-shrink-0">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between mb-1">
                                                <h4 className="text-white font-medium">{item.name}</h4>
                                                <p className="text-gray-400 font-medium">₦{(item.price * item.quantity).toLocaleString()}</p>
                                            </div>
                                            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-3 border-t border-white/10 pt-6">
                                <div className="flex justify-between text-gray-400">
                                    <span>Subtotal</span>
                                    <span>₦{subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-gray-400">
                                    <span>Shipping</span>
                                    <span>₦{shippingCost.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-gray-400">
                                    <span>Tax (8%)</span>
                                    <span>₦{tax.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-xl font-bold text-white pt-4 border-t border-white/10">
                                    <span>Total</span>
                                    <span className="text-amber-500">₦{total.toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="mt-8 flex items-center justify-center gap-2 text-gray-500 text-xs">
                                <Truck className="h-4 w-4" />
                                <span>Free shipping on orders over ₦50,000</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

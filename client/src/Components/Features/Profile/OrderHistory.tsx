import { useState } from "react";
import { motion } from "framer-motion";
import { Package, Clock, CheckCircle2, RotateCcw, ChevronRight, XCircle, ShoppingBag } from "lucide-react";
import Button from "../../UI/Button";
import Modal from "../../UI/Modal";
import { useOrders, type Order } from "../../../context/OrderContext";
import { useCart } from "../../../context/CartContext";
import { useToast } from "../../../context/ToastContext";

export default function OrderHistory() {
    const { orders } = useOrders();
    const { addItem } = useCart();
    const { showToast } = useToast();
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);

    // Orders are already filtered for the user in Context
    // Sort by date (newest first) if not already sorted
    const myOrders = [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }) +
            " at " +
            new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const handleReorder = (order: Order) => {
        order.items.forEach(item => {
            addItem({
                id: item.menuItem,
                name: item.name,
                price: item.price,
                image: item.image,
                category: "Main" // Default category if not available
            });
        });
        showToast("Order items added to cart!", "success");
    };

    const openDetails = (order: Order) => {
        setSelectedOrder(order);
        setIsDetailsOpen(true);
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6">Order History</h2>
            <div className="space-y-4">
                {myOrders.length === 0 ? (
                    <div className="text-gray-500 text-center py-8 border border-dashed border-white/10 rounded-xl">
                        No recent orders found.
                    </div>
                ) : (
                    myOrders.map((order, index) => (
                        <motion.div
                            key={order._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-gray-900/50 border border-white/5 rounded-2xl p-6 hover:border-amber-500/20 transition-colors group"
                        >
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${order.status === "pending" || order.status === "preparing"
                                        ? "bg-amber-500/10 text-amber-500"
                                        : order.status === "cancelled"
                                            ? "bg-red-500/10 text-red-500"
                                            : "bg-green-500/10 text-green-500"
                                        }`}>
                                        {order.status === "cancelled" ? <XCircle className="h-6 w-6" /> : <Package className="h-6 w-6" />}
                                    </div>
                                    <div>
                                        <h3 className="text-white font-semibold">#{order._id.slice(-6).toUpperCase()}</h3>
                                        <p className="text-sm text-gray-500">Today at {formatDate(order.createdAt)}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 ${order.status === "pending" || order.status === "preparing"
                                        ? "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                                        : order.status === "cancelled"
                                            ? "bg-red-500/10 text-red-500 border border-red-500/20"
                                            : "bg-green-500/10 text-green-500 border border-green-500/20"
                                        }`}>
                                        {(order.status === "pending" || order.status === "preparing") ? <Clock className="h-3 w-3" /> : order.status === "cancelled" ? <XCircle className="h-3 w-3" /> : <CheckCircle2 className="h-3 w-3" />}
                                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                    </div>
                                    <p className="text-lg font-bold text-white">₦{order.total.toLocaleString()}</p>
                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-4 border-t border-white/5">
                                <p className="text-sm text-gray-400">
                                    <span className="text-gray-500">Items: </span>
                                    {order.items.map(item => `${item.quantity}x ${item.name}`).join(", ")}
                                </p>
                                <div className="flex gap-3">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        leftIcon={<RotateCcw className="h-4 w-4" />}
                                        onClick={() => handleReorder(order)}
                                    >
                                        Reorder
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        rightIcon={<ChevronRight className="h-4 w-4" />}
                                        onClick={() => openDetails(order)}
                                    >
                                        Details
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>

            {/* Order Details Modal */}
            <Modal
                isOpen={isDetailsOpen}
                onClose={() => setIsDetailsOpen(false)}
                title={`Order Details #${selectedOrder?._id.slice(-6).toUpperCase()}`}
                size="lg"
            >
                {selectedOrder && (
                    <div className="space-y-6">
                        {/* Status Header */}
                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${selectedOrder.status === "delivered" ? "bg-green-500/20 text-green-500" : "bg-amber-500/20 text-amber-500"
                                    }`}>
                                    <ShoppingBag className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-400">Status</p>
                                    <p className="text-white font-bold capitalize">{selectedOrder.status}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-gray-400">Date</p>
                                <p className="text-white font-bold">{formatDate(selectedOrder.createdAt)}</p>
                            </div>
                        </div>

                        {/* Items Section */}
                        <div>
                            <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                                <Package className="h-4 w-4 text-amber-500" />
                                Items ({selectedOrder.items.length})
                            </h4>
                            <div className="space-y-3">
                                {selectedOrder.items.map((item, i) => (
                                    <div key={i} className="flex items-center gap-4 bg-white/5 p-3 rounded-xl">
                                        <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                                        <div className="flex-1">
                                            <p className="text-white font-medium">{item.name}</p>
                                            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                        </div>
                                        <p className="text-white font-bold">₦{(item.price * item.quantity).toLocaleString()}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Totals Section */}
                        <div className="space-y-2 pt-4 border-t border-white/5">
                            <div className="flex justify-between text-gray-400">
                                <span>Subtotal</span>
                                <span>₦{selectedOrder.items.reduce((acc, item) => acc + item.price * item.quantity, 0).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-gray-400">
                                <span>Delivery Fee</span>
                                <span>₦0</span>
                            </div>
                            <div className="flex justify-between text-xl font-bold text-white pt-2">
                                <span>Total</span>
                                <span className="text-amber-500">₦{selectedOrder.total.toLocaleString()}</span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-4 pt-4">
                            <Button fullWidth onClick={() => { handleReorder(selectedOrder); setIsDetailsOpen(false); }}>
                                Reorder Full List
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, CheckCircle2, AlertCircle, ChefHat, MoreVertical, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../../lib/utils";
import { useOrders, type OrderStatus } from "../../context/OrderContext";
import Button from "../../Components/UI/Button";

const columns = [
    { id: "pending", label: "New Orders", icon: AlertCircle, color: "blue" },
    { id: "preparing", label: "Preparing", icon: ChefHat, color: "amber" },
    { id: "ready", label: "Ready to Serve", icon: CheckCircle2, color: "green" },
    { id: "delivered", label: "Completed", icon: Clock, color: "gray" },
];

export default function AdminOrders() {
    const { orders, updateOrderStatus } = useOrders();
    const [draggedOrder, setDraggedOrder] = useState<string | null>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const handleDragStart = (e: React.DragEvent, orderId: string) => {
        e.dataTransfer.setData("orderId", orderId);
        setDraggedOrder(orderId);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent, status: string) => {
        e.preventDefault();
        const orderId = e.dataTransfer.getData("orderId");

        if (orderId) {
            updateOrderStatus(orderId, status as OrderStatus);
        }
        setDraggedOrder(null);
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const { current } = scrollContainerRef;
            const scrollAmount = 350; // Width of a column + gap
            current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-1">Order Management</h1>
                    <p className="text-gray-400 text-sm">Drag and drop orders to update their status</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => scroll('left')}>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => scroll('right')}>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <div
                ref={scrollContainerRef}
                className="flex-1 overflow-x-auto custom-scrollbar pb-2"
            >
                <div className="flex gap-6 min-w-[1000px] h-full">
                    {columns.map((column) => (
                        <div
                            key={column.id}
                            className="flex-1 min-w-[300px] bg-gray-900/30 rounded-2xl border border-white/5 flex flex-col"
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, column.id)}
                        >
                            {/* Column Header */}
                            <div className={`p-4 border-b border-white/5 flex items-center gap-3`}>
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-${column.color}-500/10 text-${column.color}-500`}>
                                    <column.icon className="h-4 w-4" />
                                </div>
                                <h3 className="font-semibold text-white">{column.label}</h3>
                                <span className="ml-auto bg-gray-800 text-gray-400 text-xs font-bold px-2 py-0.5 rounded-full">
                                    {orders.filter(o => o.status === column.id).length}
                                </span>
                            </div>

                            {/* Orders List - Vertical Custom Scrollbar */}
                            <div className="p-4 space-y-3 flex-1 overflow-y-auto custom-scrollbar">
                                <AnimatePresence>
                                    {orders.filter(o => o.status === column.id).map((order) => (
                                        <motion.div
                                            layout
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            key={order._id}
                                            draggable
                                            onDragStart={(e) => handleDragStart(e as any, order._id)}
                                            className={cn(
                                                "bg-gray-800/50 backdrop-blur-sm border border-white/5 p-4 rounded-xl cursor-grab active:cursor-grabbing hover:border-amber-500/30 transition-all shadow-lg",
                                                draggedOrder === order._id && "opacity-50"
                                            )}
                                        >
                                            <div className="flex justify-between items-start mb-3">
                                                <span className="text-amber-500 text-[10px] font-bold font-mono tracking-wider">#{order._id.slice(-6).toUpperCase()}</span>
                                                <span className="text-gray-500 text-[10px] flex items-center gap-1">
                                                    <Clock className="h-3 w-3" /> {formatTime(order.createdAt)}
                                                </span>
                                            </div>

                                            <h4 className="text-white font-medium mb-1 truncate">{order.contactInfo?.name || "Anonymous"}</h4>
                                            <p className="text-gray-400 text-xs mb-3 line-clamp-2">
                                                {order.items.map(item => `${item.quantity}x ${item.name}`).join(", ")}
                                            </p>

                                            <div className="flex items-center justify-between pt-3 border-t border-white/5">
                                                <span className="text-white font-bold">₦{order.total.toLocaleString()}</span>
                                                <button className="text-gray-500 hover:text-white">
                                                    <MoreVertical className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>

                                {orders.filter(o => o.status === column.id).length === 0 && (
                                    <div className="h-32 flex flex-col items-center justify-center text-gray-600 border-2 border-dashed border-white/5 rounded-xl">
                                        <p className="text-sm">No orders</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

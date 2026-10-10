import { createContext, useContext, useState, useEffect, useMemo, type ReactNode } from "react";
import { orderService, adminService } from "../services/api";
import { useAuth } from "./AuthContext";

export type OrderStatus = "pending" | "preparing" | "ready" | "delivered" | "cancelled";

export interface OrderItem {
    menuItem: string; // ID
    name: string;
    price: number;
    quantity: number;
    image: string;
}

export interface Order {
    _id: string; // Backend ID
    id?: string; // Frontend alias if needed
    items: OrderItem[];
    total: number;
    status: OrderStatus;
    user?: string;
    createdAt: string;
    contactInfo?: {
        name: string;
        email: string;
        phone: string;
    };
}

interface OrderContextType {
    orders: Order[];
    addOrder: (orderData: any) => Promise<void>;
    updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
    stats: {
        revenue: number;
        activeCount: number;
        customerCount: number;
        totalOrdersCount: number;
        revenueByDay: any[];
        topDishes: any[];
        categoryStats: any[];
    };
    isLoading: boolean;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [backendStats, setBackendStats] = useState<any>(null);
    const [hasInitialFetched, setHasInitialFetched] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Fetch data when user changes and poll every 5 seconds
    useEffect(() => {
        if (!user) {
            setOrders([]);
            setBackendStats(null);
            setHasInitialFetched(false);
            return;
        }

        const fetchData = async () => {
            // Only show loader if we've never successfully fetched before
            if (!hasInitialFetched) setIsLoading(true);

            try {
                // Fetch orders
                const ordersData = await orderService.getMyOrders();
                setOrders(ordersData);

                // If admin, also fetch accurate total stats
                if (user.role === 'admin') {
                    const statsData = await adminService.getStats();
                    setBackendStats(statsData);
                }

                // If we get here, mark as initial fetch complete
                setHasInitialFetched(true);
            } catch (error) {
                console.error("Failed to fetch order context data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();

        // Polling interval
        const interval = setInterval(fetchData, 8000); // Slower polling for stability
        return () => clearInterval(interval);
    }, [user, hasInitialFetched]);

    const addOrder = async (orderData: any) => {
        setIsLoading(true);
        try {
            const newOrder = await orderService.create(orderData);
            setOrders((prev) => [newOrder, ...prev]);
        } catch (error) {
            console.error("Failed to create order:", error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
        try {
            const updatedOrder = await orderService.updateStatus(orderId, status);
            setOrders((prev) => prev.map(o => o._id === orderId ? updatedOrder : o));

            // Re-fetch stats to reflect changes immediately
            if (user?.role === 'admin') {
                const statsData = await adminService.getStats();
                setBackendStats(statsData);
            }
        } catch (error) {
            console.error("Failed to update order status:", error);
            throw error;
        }
    };

    const stats = useMemo(() => ({
        revenue: backendStats ? backendStats.totalRevenue : orders.reduce((acc, order) => acc + (order.total || 0), 0),
        activeCount: backendStats ? backendStats.activeOrders : orders.filter(o => !["delivered", "cancelled"].includes(o.status)).length,
        customerCount: backendStats ? backendStats.totalUsers : new Set(orders.map(o => o.user)).size,
        totalOrdersCount: backendStats ? backendStats.totalOrders : orders.length,
        revenueByDay: backendStats?.revenueByDay || [],
        topDishes: backendStats?.topDishes || [],
        categoryStats: backendStats?.categoryStats || [],
    }), [backendStats, orders]);

    return (
        <OrderContext.Provider value={{ orders, addOrder, updateOrderStatus, stats, isLoading }}>
            {children}
        </OrderContext.Provider>
    );
}

export const useOrders = () => {
    const context = useContext(OrderContext);
    if (context === undefined) {
        throw new Error("useOrders must be used within an OrderProvider");
    }
    return context;
};

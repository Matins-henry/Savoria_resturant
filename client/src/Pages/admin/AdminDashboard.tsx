import { motion } from "framer-motion";
import { Banknote, ShoppingBag, Users, Clock, MoveRight, TrendingDown, TrendingUp } from "lucide-react";
import Button from "../../Components/UI/Button";
import { useOrders } from "../../context/OrderContext";
import { useNavigate } from "react-router-dom";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    Cell,
    PieChart,
    Pie
} from 'recharts';

export default function AdminDashboard() {
    const { orders, stats, isLoading } = useOrders();
    const navigate = useNavigate();

    const recentOrders = orders.slice(0, 5);

    const dashboardStats = [
        {
            label: "Total Revenue",
            value: `₦${stats.revenue.toLocaleString()}`,
            change: "+12.5%",
            trend: "up",
            icon: Banknote,
            color: "amber"
        },
        {
            label: "Active Orders",
            value: stats.activeCount.toString(),
            change: "+4",
            trend: "up",
            icon: ShoppingBag,
            color: "blue"
        },
        {
            label: "Total Customers",
            value: stats.customerCount.toString(),
            change: "+8.2%",
            trend: "up",
            icon: Users,
            color: "green"
        },
        {
            label: "Total Orders",
            value: stats.totalOrdersCount.toString(),
            change: "+5.1%",
            trend: "up",
            icon: Clock,
            color: "purple"
        },
    ];

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const COLORS = ['#f59e0b', '#3b82f6', '#10b981', '#8b5cf6', '#ec4899'];

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-white">Dashboard Overview</h1>
                <div className="flex gap-3">
                    <Button variant="primary" size="sm" onClick={() => navigate("/admin/orders")} leftIcon={<Clock className="h-4 w-4" />}>
                        Manage Orders
                    </Button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {dashboardStats.map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-gray-900/50 border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-colors"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-${stat.color}-500/10 text-${stat.color}-500`}>
                                <stat.icon className="h-5 w-5" />
                            </div>
                            <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${stat.trend === "up" ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                                }`}>
                                {stat.trend === "up" ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                                {stat.change}
                            </div>
                        </div>
                        <h3 className="text-gray-400 text-sm font-medium mb-1">{stat.label}</h3>
                        <p className="text-2xl font-bold text-white">{isLoading ? "..." : stat.value}</p>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Revenue Graph */}
                <div className="lg:col-span-2 bg-gray-900/50 border border-white/5 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-lg font-bold text-white">Revenue Performance</h2>
                            <p className="text-sm text-gray-400">Daily revenue tracking for the last 30 days</p>
                        </div>
                        <div className="flex gap-2">
                            <div className="flex items-center gap-2 text-xs text-gray-400">
                                <div className="w-3 h-3 rounded-full bg-amber-500" />
                                <span>Revenue</span>
                            </div>
                        </div>
                    </div>
                    <div className="h-[300px] w-full">
                        {stats.revenueByDay.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={stats.revenueByDay}>
                                    <defs>
                                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                    <XAxis
                                        dataKey="_id"
                                        stroke="#94a3b8"
                                        fontSize={10}
                                        tickFormatter={(str) => {
                                            const parts = str.split('-');
                                            return `${parts[2]}/${parts[1]}`;
                                        }}
                                    />
                                    <YAxis stroke="#94a3b8" fontSize={10} tickFormatter={(value) => `₦${(value / 1000).toFixed(0)}k`} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #ffffff10', borderRadius: '12px' }}
                                        labelStyle={{ color: '#94a3b8' }}
                                        itemStyle={{ color: '#f59e0b' }}
                                    />
                                    <Area type="monotone" dataKey="revenue" stroke="#f59e0b" strokeWidth={2} fillOpacity={1} fill="url(#colorRev)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-gray-500 italic">
                                Insufficient data for dynamic chart
                            </div>
                        )}
                    </div>
                </div>

                {/* Popular Dishes */}
                <div className="bg-gray-900/50 border border-white/5 rounded-2xl p-6">
                    <h2 className="text-lg font-bold text-white mb-6">Popular Dishes</h2>
                    <div className="h-[300px] w-full">
                        {stats.topDishes.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={stats.topDishes} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" horizontal={false} />
                                    <XAxis type="number" hide />
                                    <YAxis
                                        dataKey="_id"
                                        type="category"
                                        stroke="#94a3b8"
                                        fontSize={10}
                                        width={100}
                                    />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #ffffff10', borderRadius: '12px' }}
                                    />
                                    <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                                        {stats.topDishes.map((_, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-gray-500 italic">
                                No sales data yet
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Category Pie Chart */}
                <div className="bg-gray-900/50 border border-white/5 rounded-2xl p-6">
                    <h2 className="text-lg font-bold text-white mb-6">Sales by Category</h2>
                    <div className="h-[300px] w-full">
                        {stats.categoryStats.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={stats.categoryStats}
                                        dataKey="count"
                                        nameKey="_id"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={80}
                                        label
                                    >
                                        {stats.categoryStats.map((_, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #ffffff10', borderRadius: '12px' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-gray-500 italic">
                                Loading categories...
                            </div>
                        )}
                    </div>
                </div>

                {/* Recent Orders List */}
                <div className="lg:col-span-2 bg-gray-900/50 border border-white/5 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-white">Recent Transactions</h2>
                        <Button variant="ghost" size="sm" onClick={() => navigate("/admin/orders")} rightIcon={<MoveRight className="h-4 w-4" />}>
                            All Transactions
                        </Button>
                    </div>
                    <div className="space-y-4">
                        {recentOrders.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">No orders yet</div>
                        ) : (
                            recentOrders.map((order) => (
                                <div key={order._id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 hover:border-white/10 transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-gray-800 flex items-center justify-center text-amber-500">
                                            <ShoppingBag className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <p className="text-white font-medium">{order.contactInfo?.name || "Premium Guest"}</p>
                                            <p className="text-xs text-gray-500">#{order._id.slice(-6).toUpperCase()} • {formatTime(order.createdAt)}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-8">
                                        <div className="hidden sm:block text-right">
                                            <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Status</p>
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${order.status === "ready" ? "bg-green-500/10 text-green-500" :
                                                order.status === "preparing" ? "bg-amber-500/10 text-amber-500" :
                                                    "bg-blue-500/10 text-blue-500"
                                                }`}>
                                                {order.status}
                                            </span>
                                        </div>
                                        <div className="text-right min-w-[100px]">
                                            <p className="text-white font-bold text-lg">₦{order.total.toLocaleString()}</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

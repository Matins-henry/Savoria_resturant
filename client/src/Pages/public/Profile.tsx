import { useState } from "react";
import { motion } from "framer-motion";
import { User, Package, MapPin, Settings as SettingsIcon, LogOut, Camera } from "lucide-react";
import OrderHistory from "../../Components/Features/Profile/OrderHistory";
import AddressBook from "../../Components/Features/Profile/AddressBook";
import Settings from "../../Components/Features/Profile/Settings";
import { useAuth } from "../../context/AuthContext";
import { useOrders } from "../../context/OrderContext";
import { useNavigate } from "react-router-dom";

export default function Profile({ initialTab = "overview" }: { initialTab?: string }) {
    const [activeTab, setActiveTab] = useState(initialTab);
    const { user, logout, updateProfile } = useAuth();
    const { orders } = useOrders();
    const navigate = useNavigate();
    const [uploading, setUploading] = useState(false);

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    const handleAvatarClick = () => {
        document.getElementById('avatar-upload')?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Convert to Base64
        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64String = reader.result as string;
            setUploading(true);
            try {
                await updateProfile({ avatar: base64String });
            } catch (error) {
                console.error("Failed to upload avatar:", error);
            } finally {
                setUploading(false);
            }
        };
        reader.readAsDataURL(file);
    };

    const tabs = [
        { id: "overview", label: "Overview", icon: User },
        { id: "orders", label: "Order History", icon: Package },
        { id: "addresses", label: "Addresses", icon: MapPin },
        { id: "settings", label: "Settings", icon: SettingsIcon },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case "overview":
                return (
                    <div className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/20 rounded-2xl p-6">
                                <h3 className="text-gray-400 text-sm font-medium mb-2">Total Orders</h3>
                                <p className="text-3xl font-bold text-white">{orders.length}</p>
                            </div>
                            <div className="bg-gray-900/50 border border-white/5 rounded-2xl p-6">
                                <h3 className="text-gray-400 text-sm font-medium mb-2">Loyalty Points</h3>
                                <p className="text-3xl font-bold text-amber-500">{user?.loyaltyPoints || 0}</p>
                            </div>
                            <div className="bg-gray-900/50 border border-white/5 rounded-2xl p-6">
                                <h3 className="text-gray-400 text-sm font-medium mb-2">Member Since</h3>
                                <p className="text-3xl font-bold text-white">
                                    {user?.createdAt ? new Date(user.createdAt).getFullYear() : new Date().getFullYear()}
                                </p>
                            </div>
                        </div>

                        {/* Recent Activity Preview */}
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-white">Recent Activity</h2>
                                <button
                                    onClick={() => setActiveTab("orders")}
                                    className="text-amber-500 hover:text-amber-400 text-sm font-medium transition-colors"
                                >
                                    View All
                                </button>
                            </div>
                            {orders.length > 0 ? (
                                <div className="bg-gray-900/50 border border-white/5 rounded-2xl p-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                                            <Package className="h-6 w-6" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-white font-medium">Order #{orders[orders.length - 1]._id?.slice(-6).toUpperCase() || "NEW"}</h4>
                                            <p className="text-sm text-gray-500">{orders[orders.length - 1].status} • {orders[orders.length - 1].items.length} items</p>
                                        </div>
                                        <span className="text-white font-bold">${orders[orders.length - 1].total.toFixed(2)}</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-gray-500 text-sm">No recent orders</div>
                            )}
                        </div>
                    </div>
                );
            case "orders":
                return <OrderHistory />;
            case "addresses":
                return <AddressBook />;
            case "settings":
                return <Settings />;
            default:
                return null;
        }
    };

    if (!user) {
        return <div className="text-white pt-32 text-center">Please log in to view profile.</div>;
    }

    return (
        <div className="min-h-screen bg-gray-950 pt-32 pb-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-gray-900/50 backdrop-blur-xl border border-white/5 rounded-2xl p-6 sticky top-32">
                            {/* Profile Header */}
                            <div className="text-center mb-8">
                                <div className="relative w-24 h-24 mx-auto mb-4 group cursor-pointer" onClick={handleAvatarClick}>
                                    <div className={`w-full h-full rounded-full bg-gradient-to-br from-amber-500 to-orange-600 p-1 ${uploading ? 'animate-pulse' : ''}`}>
                                        <div className="w-full h-full rounded-full bg-gray-900 overflow-hidden">
                                            <img
                                                src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}`}
                                                alt="Profile"
                                                className="w-full h-full object-cover group-hover:opacity-75 transition-opacity"
                                            />
                                        </div>
                                    </div>
                                    <button className="absolute bottom-0 right-0 p-2 bg-gray-800 rounded-full border border-gray-700 text-white hover:bg-gray-700 transition-colors">
                                        <Camera className="h-4 w-4" />
                                    </button>
                                    <input
                                        type="file"
                                        id="avatar-upload"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                    />
                                </div>
                                <h2 className="text-xl font-bold text-white">{user.name}</h2>
                                <p className="text-gray-500 text-sm capitalize">{user.role}</p>
                            </div>

                            {/* Navigation */}
                            <nav className="space-y-2">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === tab.id
                                            ? "bg-amber-500 text-white shadow-lg shadow-amber-500/20"
                                            : "text-gray-400 hover:bg-white/5 hover:text-white"
                                            }`}
                                    >
                                        <tab.icon className="h-5 w-5" />
                                        <span className="font-medium">{tab.label}</span>
                                    </button>
                                ))}
                            </nav>

                            <div className="mt-8 pt-8 border-t border-white/5">
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
                                >
                                    <LogOut className="h-5 w-5" />
                                    <span className="font-medium">Sign Out</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3 }}
                            className="bg-gray-900/50 backdrop-blur-xl border border-white/5 rounded-2xl p-6 md:p-8 min-h-[600px]"
                        >
                            {renderContent()}
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}

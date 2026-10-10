import { useState, useEffect } from "react";
import { Search, Shield, User as UserIcon, Calendar, TrendingUp, ShoppingBag } from "lucide-react";
import { adminService } from "../../services/api";
import { useToast } from "../../context/ToastContext";

export default function AdminCustomers() {
    const [users, setUsers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");
    const { showToast } = useToast();

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const data = await adminService.getUsers();
            setUsers(data);
        } catch (error: any) {
            console.error("Fetch users error:", error);
            const errorMessage = error.response?.data?.error || error.message || "Failed to fetch customers";
            showToast(errorMessage, "error");
        } finally {
            setIsLoading(false);
        }
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRole = roleFilter === "all" || user.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const handleToggleBlock = async (user: any) => {
        if (!confirm(`Are you sure you want to ${user.isBlocked ? 'unblock' : 'block'} ${user.name}?`)) return;

        try {
            const updatedUser = await adminService.toggleBlockUser(user._id, !user.isBlocked);
            setUsers(prev => prev.map(u => u._id === user._id ? { ...u, isBlocked: updatedUser.isBlocked } : u));
            showToast(`User ${updatedUser.isBlocked ? 'blocked' : 'unblocked'} successfully`, "success");
        } catch (error) {
            console.error("Block user error:", error);
            showToast("Failed to update user status", "error");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-white">Customers Management</h1>
                <div className="text-sm text-gray-400">
                    Total Users: <span className="text-white font-bold">{users.length}</span>
                </div>
            </div>

            <div className="bg-gray-900/50 border border-white/5 rounded-2xl overflow-hidden">
                {/* Toolbar */}
                <div className="p-4 border-b border-white/5 flex gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-gray-800 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50"
                        />
                    </div>
                    <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="bg-gray-800 border border-white/10 rounded-lg px-4 py-2 text-sm text-gray-300 focus:outline-none focus:border-amber-500/50"
                    >
                        <option value="all">All Roles</option>
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>

                {/* Table */}
                <div className="overflow-x-auto custom-scrollbar">
                    {isLoading ? (
                        <div className="p-12 text-center text-gray-500">Loading customers...</div>
                    ) : (
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-white/5 text-gray-400 text-xs uppercase tracking-wider">
                                    <th className="px-6 py-4 font-medium">Customer</th>
                                    <th className="px-6 py-4 font-medium">Role</th>
                                    <th className="px-6 py-4 font-medium">Joined</th>
                                    <th className="px-6 py-4 font-medium">Loyalty Points</th>
                                    <th className="px-6 py-4 font-medium text-center">Orders</th>
                                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredUsers.map((user) => (
                                    <tr key={user._id} className="text-sm hover:bg-white/5 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center overflow-hidden border border-white/10 ${user.isBlocked ? 'opacity-50 grayscale' : 'bg-gray-800'}`}>
                                                    {user.avatar ? (
                                                        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <UserIcon className="h-5 w-5 text-gray-500" />
                                                    )}
                                                </div>
                                                <div>
                                                    <span className={`font-medium block ${user.isBlocked ? 'text-gray-500 line-through' : 'text-white'}`}>{user.name}</span>
                                                    <span className="text-xs text-gray-500">{user.email}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {user.isBlocked ? (
                                                <div className="flex items-center gap-2 px-2 py-1 rounded-full text-xs font-medium w-fit bg-red-500/10 text-red-400 border border-red-500/20">
                                                    <Shield className="h-3 w-3" />
                                                    <span>Blocked</span>
                                                </div>
                                            ) : (
                                                <div className={`flex items-center gap-2 px-2 py-1 rounded-full text-xs font-medium w-fit ${user.role === 'admin'
                                                    ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                                                    : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                                    }`}>
                                                    {user.role === 'admin' ? <Shield className="h-3 w-3" /> : <UserIcon className="h-3 w-3" />}
                                                    <span className="capitalize">{user.role}</span>
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-gray-400">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-4 w-4 text-gray-600" />
                                                {formatDate(user.createdAt)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-amber-500 font-medium">
                                                <TrendingUp className="h-4 w-4" />
                                                {user.loyaltyPoints}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="inline-flex items-center gap-2 bg-gray-800 px-3 py-1 rounded-lg text-gray-300">
                                                <ShoppingBag className="h-3 w-3" />
                                                {user.ordersCount}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => handleToggleBlock(user)}
                                                className={`p-2 rounded-lg transition-colors ${user.isBlocked
                                                    ? 'text-green-400 hover:bg-green-500/10'
                                                    : 'text-red-400 hover:bg-red-500/10'
                                                    }`}
                                                title={user.isBlocked ? "Unblock User" : "Block User"}
                                            >
                                                <Shield className="h-4 w-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}

                    {!isLoading && filteredUsers.length === 0 && (
                        <div className="p-12 text-center text-gray-500">
                            No users found matching your search.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

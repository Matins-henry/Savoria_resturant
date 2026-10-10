import { useState, useEffect } from "react";
import { Plus, Search, Edit2, Trash2, Image as ImageIcon } from "lucide-react";
import Button from "../../Components/UI/Button";
import { menuService } from "../../services/api";
import { useToast } from "../../context/ToastContext";
import { useNavigate } from "react-router-dom";

export default function AdminMenu() {
    const [items, setItems] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All Categories");
    const { showToast } = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        fetchMenuItems();
    }, []);

    const fetchMenuItems = async () => {
        setIsLoading(true);
        try {
            const data = await menuService.getAll();
            setItems(data);
        } catch (error) {
            showToast("Failed to fetch menu items", "error");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;

        try {
            await menuService.delete(id);
            setItems(prev => prev.filter(item => item._id !== id));
            showToast("Item deleted successfully", "success");
        } catch (error) {
            showToast("Failed to delete item", "error");
        }
    };

    const handleToggleAvailability = async (id: string) => {
        try {
            const updatedItem = await menuService.toggleAvailability(id);
            setItems(prev => prev.map(item => item._id === id ? updatedItem : item));
            showToast(`Status updated for ${updatedItem.name}`, "success");
        } catch (error) {
            showToast("Failed to update availability", "error");
        }
    };

    const filteredItems = items.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === "All Categories" || item.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const categories = ["All Categories", ...new Set(items.map(i => i.category))];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-white">Menu Management</h1>
                <Button variant="primary" onClick={() => navigate("/admin/menu/add")} leftIcon={<Plus className="h-4 w-4" />}>
                    Add New Item
                </Button>
            </div>

            <div className="bg-gray-900/50 border border-white/5 rounded-2xl overflow-hidden">
                {/* Toolbar */}
                <div className="p-4 border-b border-white/5 flex gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search items..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-gray-800 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50"
                        />
                    </div>
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="bg-gray-800 border border-white/10 rounded-lg px-4 py-2 text-sm text-gray-300 focus:outline-none focus:border-amber-500/50"
                    >
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    {isLoading ? (
                        <div className="p-12 text-center text-gray-500">Loading menu...</div>
                    ) : (
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-white/5 text-gray-400 text-xs uppercase tracking-wider">
                                    <th className="px-6 py-4 font-medium">Item</th>
                                    <th className="px-6 py-4 font-medium">Category</th>
                                    <th className="px-6 py-4 font-medium">Price</th>
                                    <th className="px-6 py-4 font-medium">Status</th>
                                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredItems.map((item) => (
                                    <tr key={item._id} className="text-sm hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-gray-800 overflow-hidden flex items-center justify-center text-gray-500">
                                                    {item.image ? (
                                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <ImageIcon className="h-5 w-5" />
                                                    )}
                                                </div>
                                                <div>
                                                    <span className="font-medium text-white block">{item.name}</span>
                                                    {item.isFeatured && (
                                                        <span className="text-[10px] text-amber-500 font-bold uppercase tracking-tight">Featured</span>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-300">
                                            <span className="bg-gray-800 px-2 py-1 rounded text-xs">{item.category}</span>
                                        </td>
                                        <td className="px-6 py-4 text-white font-medium">₦{item.price.toLocaleString()}</td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => handleToggleAvailability(item._id)}
                                                className={`px-2 py-1 rounded-full text-xs font-medium transition-colors ${item.isAvailable
                                                    ? "bg-green-500/10 text-green-500 hover:bg-green-500/20"
                                                    : "bg-red-500/10 text-red-500 hover:bg-red-500/20"
                                                    }`}
                                            >
                                                {item.isAvailable ? "Available" : "Out of Stock"}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => navigate(`/admin/menu/edit/${item._id}`)}
                                                    className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                                                >
                                                    <Edit2 className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(item._id, item.name)}
                                                    className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}

                    {!isLoading && filteredItems.length === 0 && (
                        <div className="p-12 text-center text-gray-500">
                            No menu items found.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

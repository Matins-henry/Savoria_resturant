import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Edit2, Trash2, Home, Briefcase, MapPin } from "lucide-react";
import Button from "../../UI/Button";
import Modal from "../../UI/Modal";
import Input from "../../UI/Input";
import { useAuth } from "../../../context/AuthContext";
import { useToast } from "../../../context/ToastContext";

export default function AddressBook() {
    const { user, addAddress, updateAddress, deleteAddress } = useAuth();
    const { showToast } = useToast();

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Form State
    const initialFormState = {
        label: "Home",
        street: "",
        city: "",
        state: "",
        zip: "",
        isDefault: false
    };
    const [formData, setFormData] = useState(initialFormState);

    const handleOpenAdd = () => {
        setEditingId(null);
        setFormData(initialFormState);
        setIsModalOpen(true);
    };

    const handleOpenEdit = (address: any) => {
        setEditingId(address._id);
        setFormData({
            label: address.label,
            street: address.street,
            city: address.city,
            state: address.state || "",
            zip: address.zip,
            isDefault: address.isDefault
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this address?")) {
            try {
                await deleteAddress(id);
                showToast("Address deleted successfully", "success");
            } catch (error) {
                showToast("Failed to delete address", "error");
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (editingId) {
                await updateAddress(editingId, formData);
                showToast("Address updated successfully", "success");
            } else {
                await addAddress(formData);
                showToast("Address added successfully", "success");
            }
            setIsModalOpen(false);
        } catch (error) {
            showToast("Failed to save address", "error");
        } finally {
            setIsLoading(false);
        }
    };

    const getIcon = (label: string) => {
        const l = label.toLowerCase();
        if (l.includes("home")) return <Home className="h-5 w-5" />;
        if (l.includes("work") || l.includes("office")) return <Briefcase className="h-5 w-5" />;
        return <MapPin className="h-5 w-5" />;
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Saved Addresses</h2>
                <Button size="sm" onClick={handleOpenAdd} leftIcon={<Plus className="h-4 w-4" />}>
                    Add New
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(user?.addresses?.length === 0) ? (
                    <div className="col-span-1 md:col-span-2 text-gray-500 text-center py-8 border border-dashed border-white/10 rounded-xl">
                        No addresses saved yet.
                    </div>
                ) : (
                    user?.addresses?.map((addr: any, index: number) => (
                        <motion.div
                            key={addr._id || index}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-gray-900/50 border border-white/5 rounded-2xl p-6 relative group hover:border-amber-500/30 transition-colors"
                        >
                            {addr.isDefault && (
                                <span className="absolute top-4 right-4 text-[10px] font-bold uppercase tracking-wider text-amber-500 bg-amber-500/10 px-2 py-1 rounded-full border border-amber-500/20">
                                    Default
                                </span>
                            )}

                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center text-gray-400 group-hover:text-white transition-colors">
                                    {getIcon(addr.label)}
                                </div>
                                <div>
                                    <h3 className="text-white font-semibold">{addr.label}</h3>
                                    <p className="text-xs text-gray-500">{user.name}</p>
                                </div>
                            </div>

                            <div className="space-y-1 mb-6">
                                <p className="text-gray-300 text-sm">{addr.street}</p>
                                <p className="text-gray-300 text-sm">{addr.city}, {addr.state} {addr.zip}</p>
                            </div>

                            <div className="flex gap-3 pt-4 border-t border-white/5">
                                <button
                                    onClick={() => handleOpenEdit(addr)}
                                    className="flex-1 flex items-center justify-center gap-2 text-sm text-gray-400 hover:text-white py-2 rounded-lg hover:bg-white/5 transition-colors"
                                >
                                    <Edit2 className="h-4 w-4" />
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(addr._id)}
                                    className="flex-1 flex items-center justify-center gap-2 text-sm text-gray-400 hover:text-red-400 py-2 rounded-lg hover:bg-red-500/10 transition-colors"
                                >
                                    <Trash2 className="h-4 w-4" />
                                    Remove
                                </button>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>

            {/* Add/Edit Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingId ? "Edit Address" : "Add New Address"}
                size="md"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Label (e.g. Home, Work)"
                        value={formData.label}
                        onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                        placeholder="Home"
                        required
                    />
                    <Input
                        label="Street Address"
                        value={formData.street}
                        onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                        placeholder="123 Main St"
                        required
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="City"
                            value={formData.city}
                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                            placeholder="New York"
                            required
                        />
                        <Input
                            label="State"
                            value={formData.state}
                            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                            placeholder="NY"
                        />
                    </div>
                    <Input
                        label="ZIP Code"
                        value={formData.zip}
                        onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                        placeholder="10001"
                        required
                    />

                    <div className="flex items-center gap-2 pt-2">
                        <input
                            type="checkbox"
                            id="isDefault"
                            checked={formData.isDefault}
                            onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                            className="rounded border-gray-700 bg-gray-800 text-amber-500 focus:ring-amber-500"
                        />
                        <label htmlFor="isDefault" className="text-sm text-gray-300">Set as default address</label>
                    </div>

                    <div className="pt-4">
                        <Button type="submit" fullWidth isLoading={isLoading}>
                            {editingId ? "Update Address" : "Save Address"}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}

import { useState, useEffect } from "react";
import { Save, Store, Clock, Truck, Globe } from "lucide-react";
import Button from "../../Components/UI/Button";
import Input from "../../Components/UI/Input";
import { settingsService } from "../../services/api";
import { useToast } from "../../context/ToastContext";

export default function AdminSettings() {
    const { showToast } = useToast();
    const [activeTab, setActiveTab] = useState("general");
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const [settings, setSettings] = useState({
        restaurantName: "",
        description: "",
        contact: {
            phone: "",
            email: "",
            address: ""
        },
        hours: {
            monday: "",
            tuesday: "",
            wednesday: "",
            thursday: "",
            friday: "",
            saturday: "",
            sunday: ""
        },
        delivery: {
            freeDeliveryThreshold: 0,
            standardFee: 0,
            taxRate: 0,
            currency: "$"
        },
        socials: {
            facebook: "",
            instagram: "",
            twitter: ""
        }
    });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const data = await settingsService.getSettings();
            // Merge with defaults to ensure all fields exist
            setSettings(prev => ({ ...prev, ...data }));
        } catch (error) {
            console.error("Fetch settings error:", error);
            showToast("Failed to load settings", "error");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await settingsService.updateSettings(settings);
            showToast("Settings saved successfully", "success");
        } catch (error) {
            console.error("Save settings error:", error);
            showToast("Failed to save settings", "error");
        } finally {
            setIsSaving(false);
        }
    };

    const updateField = (section: string, field: string, value: any) => {
        if (section === 'root') {
            setSettings(prev => ({ ...prev, [field]: value }));
        } else {
            setSettings(prev => ({
                ...prev,
                [section]: {
                    ...prev[section as keyof typeof prev] as any,
                    [field]: value
                }
            }));
        }
    };

    if (isLoading) {
        return <div className="p-12 text-center text-gray-500">Loading settings...</div>;
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Restaurant Settings</h1>
                    <p className="text-gray-400 text-sm mt-1">Manage global configuration</p>
                </div>
                <Button
                    onClick={handleSave}
                    isLoading={isSaving}
                    className="bg-green-600 hover:bg-green-700"
                >
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                </Button>
            </div>

            {/* Tabs */}
            <div className="flex bg-gray-900 p-1 rounded-xl border border-white/10 overflow-x-auto">
                <button
                    onClick={() => setActiveTab("general")}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === "general" ? "bg-gray-800 text-white shadow-lg" : "text-gray-400 hover:text-white"
                        }`}
                >
                    <Store className="h-4 w-4" />
                    General
                </button>
                <button
                    onClick={() => setActiveTab("hours")}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === "hours" ? "bg-gray-800 text-white shadow-lg" : "text-gray-400 hover:text-white"
                        }`}
                >
                    <Clock className="h-4 w-4" />
                    Hours
                </button>
                <button
                    onClick={() => setActiveTab("operations")}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === "operations" ? "bg-gray-800 text-white shadow-lg" : "text-gray-400 hover:text-white"
                        }`}
                >
                    <Truck className="h-4 w-4" />
                    Operations
                </button>
                <button
                    onClick={() => setActiveTab("socials")}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === "socials" ? "bg-gray-800 text-white shadow-lg" : "text-gray-400 hover:text-white"
                        }`}
                >
                    <Globe className="h-4 w-4" />
                    Socials
                </button>
            </div>

            {/* Content */}
            <div className="bg-gray-900 border border-white/5 rounded-2xl p-6 shadow-xl">
                {activeTab === "general" && (
                    <div className="space-y-6">
                        <Input
                            label="Restaurant Name"
                            value={settings.restaurantName}
                            onChange={(e) => updateField('root', 'restaurantName', e.target.value)}
                            placeholder="Savoria"
                            className="bg-gray-800 border-gray-700 text-white"
                        />
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                            <textarea
                                value={settings.description}
                                onChange={(e) => updateField('root', 'description', e.target.value)}
                                rows={3}
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-colors"
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input
                                label="Phone Number"
                                value={settings.contact.phone}
                                onChange={(e) => updateField('contact', 'phone', e.target.value)}
                                placeholder="+1 (555) 123-4567"
                                className="bg-gray-800 border-gray-700 text-white"
                            />
                            <Input
                                label="Contact Email"
                                value={settings.contact.email}
                                onChange={(e) => updateField('contact', 'email', e.target.value)}
                                placeholder="contact@savoria.com"
                                className="bg-gray-800 border-gray-700 text-white"
                            />
                        </div>
                        <Input
                            label="Physical Address"
                            value={settings.contact.address}
                            onChange={(e) => updateField('contact', 'address', e.target.value)}
                            placeholder="123 Culinary Ave, Food City"
                            className="bg-gray-800 border-gray-700 text-white"
                        />
                    </div>
                )}

                {activeTab === "hours" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {Object.entries(settings.hours).map(([day, time]) => (
                            <Input
                                key={day}
                                label={day.charAt(0).toUpperCase() + day.slice(1)}
                                value={time}
                                onChange={(e) => updateField('hours', day, e.target.value)}
                                placeholder="10:00 AM - 10:00 PM"
                                className="bg-gray-800 border-gray-700 text-white"
                            />
                        ))}
                    </div>
                )}

                {activeTab === "operations" && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input
                                label="Standard Delivery Fee"
                                type="number"
                                value={settings.delivery.standardFee}
                                onChange={(e) => updateField('delivery', 'standardFee', Number(e.target.value))}
                                leftIcon={<span className="text-gray-400">$</span>}
                                className="bg-gray-800 border-gray-700 text-white"
                            />
                            <Input
                                label="Free Delivery Threshold"
                                type="number"
                                value={settings.delivery.freeDeliveryThreshold}
                                onChange={(e) => updateField('delivery', 'freeDeliveryThreshold', Number(e.target.value))}
                                leftIcon={<span className="text-gray-400">$</span>}
                                className="bg-gray-800 border-gray-700 text-white"
                            />
                            <Input
                                label="Tax Rate (decimal)"
                                type="number"
                                step="0.01"
                                value={settings.delivery.taxRate}
                                onChange={(e) => updateField('delivery', 'taxRate', Number(e.target.value))}
                                placeholder="0.10"
                                className="bg-gray-800 border-gray-700 text-white"
                            />
                            <Input
                                label="Currency Symbol"
                                value={settings.delivery.currency}
                                onChange={(e) => updateField('delivery', 'currency', e.target.value)}
                                placeholder="$"
                                className="bg-gray-800 border-gray-700 text-white"
                            />
                        </div>
                    </div>
                )}

                {activeTab === "socials" && (
                    <div className="space-y-6">
                        <Input
                            label="Facebook URL"
                            value={settings.socials.facebook}
                            onChange={(e) => updateField('socials', 'facebook', e.target.value)}
                            placeholder="https://facebook.com/savoria"
                            className="bg-gray-800 border-gray-700 text-white"
                        />
                        <Input
                            label="Instagram URL"
                            value={settings.socials.instagram}
                            onChange={(e) => updateField('socials', 'instagram', e.target.value)}
                            placeholder="https://instagram.com/savoria"
                            className="bg-gray-800 border-gray-700 text-white"
                        />
                        <Input
                            label="Twitter/X URL"
                            value={settings.socials.twitter}
                            onChange={(e) => updateField('socials', 'twitter', e.target.value)}
                            placeholder="https://twitter.com/savoria"
                            className="bg-gray-800 border-gray-700 text-white"
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

import { useState, useEffect } from "react";
import { User, Mail, Phone, Lock, Bell, Shield } from "lucide-react";
import Input from "../../UI/Input";
import Button from "../../UI/Button";
import { useAuth } from "../../../context/AuthContext";
import { useToast } from "../../../context/ToastContext";
import { authService } from "../../../services/api";

export default function Settings() {
    const { user, updateProfile } = useAuth();
    const { showToast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    // Profile State
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: ""
    });

    // Password State
    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || "",
                email: user.email || "",
                phone: user.phone || ""
            });
        }
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        setIsLoading(true);
        try {
            // Update Profile Info
            await updateProfile({
                name: formData.name,
                phone: formData.phone
            });

            // Update Password if fields are filled
            if (passwordData.currentPassword || passwordData.newPassword || passwordData.confirmPassword) {
                if (!passwordData.currentPassword || !passwordData.newPassword) {
                    throw new Error("Please fill in current and new password");
                }
                if (passwordData.newPassword !== passwordData.confirmPassword) {
                    throw new Error("New passwords do not match");
                }
                if (passwordData.newPassword.length < 6) {
                    throw new Error("Password must be at least 6 characters");
                }

                await authService.updatePassword({
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword
                });

                // Clear password fields on success
                setPasswordData({
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: ""
                });
            }

            showToast("Settings updated successfully", "success");
        } catch (error: any) {
            showToast(error.response?.data?.error || error.message || "Failed to update settings", "error");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            {/* Profile Details */}
            <section className="space-y-6">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                    <User className="h-5 w-5 text-amber-500" />
                    Personal Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                        label="Full Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        leftIcon={<User className="h-4 w-4" />}
                    />
                    <Input
                        label="Email Address"
                        name="email"
                        value={formData.email}
                        disabled
                        helperText="Email cannot be changed"
                        className="opacity-50 cursor-not-allowed"
                        leftIcon={<Mail className="h-4 w-4" />}
                    />
                    <Input
                        label="Phone Number"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+1 (555) 123-4567"
                        type="tel"
                        leftIcon={<Phone className="h-4 w-4" />}
                    />
                </div>
            </section>

            <div className="h-px bg-white/5" />

            {/* Security */}
            <section className="space-y-6">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                    <Shield className="h-5 w-5 text-amber-500" />
                    Security
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                        label="Current Password"
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        type="password"
                        placeholder="••••••••"
                        leftIcon={<Lock className="h-4 w-4" />}
                    />
                    <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            label="New Password"
                            name="newPassword"
                            value={passwordData.newPassword}
                            onChange={handlePasswordChange}
                            type="password"
                            placeholder="••••••••"
                            leftIcon={<Lock className="h-4 w-4" />}
                        />
                        <Input
                            label="Confirm New Password"
                            name="confirmPassword"
                            value={passwordData.confirmPassword}
                            onChange={handlePasswordChange}
                            type="password"
                            placeholder="••••••••"
                            leftIcon={<Lock className="h-4 w-4" />}
                        />
                    </div>
                </div>
            </section>

            <div className="h-px bg-white/5" />

            {/* Notifications */}
            <section className="space-y-6">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                    <Bell className="h-5 w-5 text-amber-500" />
                    Notifications
                </h2>
                <div className="space-y-4">
                    {[
                        "Order updates and delivery status",
                        "New menu items and special offers",
                        "Table reservation reminders",
                        "Newsletter and culinary tips"
                    ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-gray-900/30 rounded-xl border border-white/5">
                            <span className="text-gray-300">{item}</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" defaultChecked={i < 2} className="sr-only peer" />
                                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                            </label>
                        </div>
                    ))}
                </div>
            </section>

            <div className="flex justify-end pt-4">
                <Button size="lg" onClick={handleSave} isLoading={isLoading}>
                    Save Changes
                </Button>
            </div>
        </div>
    );
}

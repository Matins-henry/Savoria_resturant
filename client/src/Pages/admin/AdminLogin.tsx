import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Mail, ChefHat, AlertCircle, Sparkles, ShieldCheck } from "lucide-react";
import Input from "../../Components/UI/Input";
import Button from "../../Components/UI/Button";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminLogin() {
    const navigate = useNavigate();
    const { login, logout } = useAuth();
    const { showToast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            await login(formData);
            const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

            if (storedUser.role !== 'admin') {
                logout();
                setError("Access Denied: Administrative privileges required.");
                return;
            }

            showToast("Welcome to Savoria Management", "success");
            navigate("/admin");

        } catch (err: any) {
            console.error("Admin login error:", err);
            setError(err.response?.data?.error || "Invalid credentials");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6 relative overflow-hidden">
            {/* Ambient Background Elements */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3]
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-amber-500/10 rounded-full blur-[120px]"
                />
                <motion.div
                    animate={{
                        scale: [1.2, 1, 1.2],
                        opacity: [0.2, 0.4, 0.2]
                    }}
                    transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] bg-orange-600/10 rounded-full blur-[120px]"
                />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="w-full max-w-lg relative z-10"
            >
                {/* Branding Block */}
                <div className="text-center mb-10">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
                        className="w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-700 rounded-[1.5rem] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-amber-500/20 glow-gold"
                    >
                        <ChefHat className="h-10 w-10 text-white" />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-amber-500 text-xs font-bold tracking-[0.2em] mb-4 uppercase">
                            <ShieldCheck className="h-3 w-3" />
                            Secure Gateway
                        </span>
                        <h1 className="text-4xl md:text-5xl font-medium text-white mb-4 font-serif tracking-tight">
                            Admin Portal
                        </h1>
                        <p className="text-gray-400 font-light tracking-wide">
                            Management access for Savoria Culinary Experience
                        </p>
                    </motion.div>
                </div>

                {/* Login Container */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 }}
                    className="glass rounded-[2.5rem] p-10 md:p-14 shadow-2xl glow-gold border border-white/10"
                >
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="space-y-6">
                            <Input
                                label="Administrative Email"
                                type="email"
                                placeholder="admin@savoria.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                leftIcon={<Mail className="h-4 w-4" />}
                                required
                                className="h-14 focus:border-amber-500/50"
                            />

                            <Input
                                label="Security Password"
                                type="password"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                leftIcon={<Lock className="h-4 w-4" />}
                                required
                                className="h-14 focus:border-amber-500/50"
                            />
                        </div>

                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0, y: -10 }}
                                    animate={{ opacity: 1, height: "auto", y: 0 }}
                                    exit={{ opacity: 0, height: 0, y: -10 }}
                                    className="flex items-center gap-3 text-red-400 text-sm bg-red-500/10 p-4 rounded-2xl border border-red-500/20"
                                >
                                    <AlertCircle className="h-5 w-5 shrink-0" />
                                    <span className="font-medium">{error}</span>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <Button
                            type="submit"
                            fullWidth
                            isLoading={isLoading}
                            size="lg"
                            className="h-16 text-lg font-bold tracking-widest uppercase bg-gradient-to-r from-amber-500 via-orange-600 to-red-600 border-0 shadow-xl shadow-amber-500/20 rounded-2xl"
                        >
                            <span className="flex items-center gap-3">
                                Sign In
                                <Sparkles className="h-5 w-5" />
                            </span>
                        </Button>
                    </form>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="text-center mt-12 space-y-4"
                >
                    <p className="text-gray-500 text-sm font-light tracking-[0.1em] uppercase">
                        Authorized Access Only
                    </p>
                    <div className="flex justify-center gap-6 text-gray-600 text-[10px] tracking-widest uppercase font-bold">
                        <span>Encryption: Active</span>
                        <span className="w-1 h-1 bg-gray-700 rounded-full self-center" />
                        <span>Security Protocol: v2.4</span>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
}

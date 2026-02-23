import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import AuthLayout from "../../Components/Layout/AuthLayout";
import Input from "../../Components/UI/Input";
import Button from "../../Components/UI/Button";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";

export default function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const { showToast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await login(formData);
            showToast("Welcome back!", "success");
            navigate("/");
        } catch (error: any) {
            showToast(error.response?.data?.error || "Login failed", "error");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout
            title="Welcome Back"
            subtitle="Sign in to access your account and continue your culinary journey."
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                    label="Email Address"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    leftIcon={<Mail className="h-4 w-4" />}
                    required
                />

                <div className="space-y-1">
                    <Input
                        label="Password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        leftIcon={<Lock className="h-4 w-4" />}
                        rightIcon={
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="text-gray-500 hover:text-white transition-colors focus:outline-none"
                            >
                                {showPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </button>
                        }
                        required
                    />
                    <div className="flex justify-end">
                        <Link
                            to="/forgot-password"
                            className="text-sm text-amber-500 hover:text-amber-400 transition-colors"
                        >
                            Forgot password?
                        </Link>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="remember"
                        className="w-4 h-4 rounded border-gray-700 bg-gray-800 text-amber-500 focus:ring-amber-500/50 focus:ring-offset-0"
                    />
                    <label htmlFor="remember" className="text-sm text-gray-400 select-none cursor-pointer">
                        Remember me for 30 days
                    </label>
                </div>

                <Button type="submit" size="lg" fullWidth isLoading={isLoading}>
                    Sign In
                </Button>

                <p className="text-center text-gray-400 text-sm">
                    Don't have an account?{" "}
                    <Link
                        to="/signup"
                        className="text-white font-medium hover:text-amber-400 transition-colors"
                    >
                        Sign up
                    </Link>
                </p>
            </form>
        </AuthLayout>
    );
}

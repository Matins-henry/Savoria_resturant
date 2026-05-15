import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Lock, Eye, EyeOff } from "lucide-react";
import AuthLayout from "../../Components/Layout/AuthLayout";
import Input from "../../Components/UI/Input";
import Button from "../../Components/UI/Button";
import { authService } from "../../services/api";
import { useToast } from "../../context/ToastContext";

export default function ResetPassword() {
    const { token } = useParams();
    const navigate = useNavigate();
    const { showToast } = useToast();

    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        password: "",
        confirmPassword: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            showToast("Passwords do not match", "error");
            return;
        }

        if (formData.password.length < 6) {
            showToast("Password must be at least 6 characters", "error");
            return;
        }

        setIsLoading(true);

        try {
            await authService.resetPassword(token!, formData.password);
            showToast("Password reset successfully. Please login.", "success");
            navigate("/login");
        } catch (error: any) {
            showToast(error.response?.data?.error || "Failed to reset password", "error");
        } finally {
            setIsLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-950 text-white">
                <p>Invalid or missing reset token.</p>
            </div>
        );
    }

    return (
        <AuthLayout
            title="Set New Password"
            subtitle="Your new password must be different from previously used passwords."
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                    label="New Password"
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

                <Input
                    label="Confirm Password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    leftIcon={<Lock className="h-4 w-4" />}
                    required
                />

                <Button type="submit" size="lg" fullWidth isLoading={isLoading}>
                    Reset Password
                </Button>
            </form>
        </AuthLayout>
    );
}

import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";
import AuthLayout from "../../Components/Layout/AuthLayout";
import Input from "../../Components/UI/Input";
import Button from "../../Components/UI/Button";
import { authService } from "../../services/api";
import { useToast } from "../../context/ToastContext";

export default function ForgotPassword() {
    const { showToast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [isSent, setIsSent] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await authService.forgotPassword(email);
            setIsSent(true);
            showToast("Reset link sent to your email", "success");
        } catch (error: any) {
            showToast(error.response?.data?.error || "Failed to send reset link", "error");
        } finally {
            setIsLoading(false);
        }
    };

    if (isSent) {
        return (
            <AuthLayout
                title="Check your email"
                subtitle={`We've sent a password reset link to ${email}`}
            >
                <div className="flex flex-col items-center justify-center space-y-6 text-center">
                    <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center text-green-500">
                        <CheckCircle className="h-8 w-8" />
                    </div>

                    <p className="text-gray-400 text-sm">
                        Didn't receive the email? Check your spam folder or try again.
                    </p>

                    <Button
                        variant="secondary"
                        fullWidth
                        onClick={() => setIsSent(false)}
                    >
                        Try with another email
                    </Button>

                    <Link
                        to="/login"
                        className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to sign in
                    </Link>
                </div>
            </AuthLayout>
        );
    }

    return (
        <AuthLayout
            title="Reset Password"
            subtitle="Enter your email address and we'll send you instructions to reset your password."
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                    label="Email Address"
                    type="email"
                    placeholder="john@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    leftIcon={<Mail className="h-4 w-4" />}
                    required
                />

                <Button type="submit" size="lg" fullWidth isLoading={isLoading}>
                    Send Reset Link
                </Button>

                <div className="flex justify-center">
                    <Link
                        to="/login"
                        className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to sign in
                    </Link>
                </div>
            </form>
        </AuthLayout>
    );
}

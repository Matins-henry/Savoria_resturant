import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function AdminRoute({ children }: { children: ReactNode }) {
    const { user, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return <div className="min-h-screen bg-gray-950 flex items-center justify-center text-white">Loading...</div>;
    }

    if (!user) {
        // Not logged in -> Redirect to Admin Login
        return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }

    if (user.role !== 'admin') {
        // Logged in but not admin -> Redirect to home (or show 403)
        return <Navigate to="/" replace />;
    }

    return children;
}

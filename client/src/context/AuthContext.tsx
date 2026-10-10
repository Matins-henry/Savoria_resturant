import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { authService } from "../services/api";

interface User {
    id: string;
    _id?: string; // Backend uses _id
    name: string;
    email: string;
    avatar?: string;
    phone?: string;
    role: "user" | "admin";
    createdAt?: string;
    loyaltyPoints?: number;
    addresses?: {
        _id?: string;
        label: string;
        street: string;
        city: string;
        state: string;
        zip: string;
        isDefault: boolean;
    }[];
}

interface AuthContextType {
    user: User | null;
    login: (credentials: any) => Promise<void>;
    register: (userData: any) => Promise<void>;
    logout: () => void;
    isLoading: boolean;
    updateProfile: (data: any) => Promise<void>;
    addAddress: (address: any) => Promise<void>;
    updateAddress: (id: string, address: any) => Promise<void>;
    deleteAddress: (id: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Check for existing session on load
    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                setIsLoading(false);
                return;
            }

            try {
                const userData = await authService.getProfile();
                setUser({ ...userData, id: userData._id });
            } catch (error) {
                console.error("Session expired or invalid:", error);
                localStorage.removeItem("token");
                localStorage.removeItem("user");
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, []);

    const login = async (credentials: any) => {
        setIsLoading(true);
        try {
            const response = await authService.login(credentials);
            const { token, ...userData } = response;

            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(userData));

            setUser({ ...userData, id: userData._id });
        } catch (error) {
            console.error("Login failed:", error);
            throw error; // Propagate to component
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (data: any) => {
        setIsLoading(true);
        try {
            const response = await authService.register(data);
            const { token, ...userData } = response;

            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(userData));

            setUser({ ...userData, id: userData._id });
        } catch (error) {
            console.error("Registration failed:", error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
    };

    const updateProfile = async (data: any) => {
        setIsLoading(true);
        try {
            const response = await authService.updateProfile(data);

            // Update local user state with response from backend
            const updatedUser = { ...user, ...response, id: response._id };
            setUser(updatedUser);

            // Update storage
            const currentStoredUser = JSON.parse(localStorage.getItem("user") || "{}");
            localStorage.setItem("user", JSON.stringify({ ...currentStoredUser, ...response }));

        } catch (error) {
            console.error("Profile update failed:", error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }

    const addAddress = async (address: any) => {
        setIsLoading(true);
        try {
            const response = await authService.addAddress(address);
            if (user) {
                const updatedUser = { ...user, addresses: response.addresses };
                setUser(updatedUser);
                localStorage.setItem("user", JSON.stringify(updatedUser));
            }
        } catch (error) {
            console.error("Add address failed:", error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const updateAddress = async (id: string, address: any) => {
        setIsLoading(true);
        try {
            const response = await authService.updateAddress(id, address);
            if (user) {
                const updatedUser = { ...user, addresses: response.addresses };
                setUser(updatedUser);
                localStorage.setItem("user", JSON.stringify(updatedUser));
            }
        } catch (error) {
            console.error("Update address failed:", error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const deleteAddress = async (id: string) => {
        setIsLoading(true);
        try {
            const response = await authService.deleteAddress(id);
            if (user) {
                const updatedUser = { ...user, addresses: response.addresses };
                setUser(updatedUser);
                localStorage.setItem("user", JSON.stringify(updatedUser));
            }
        } catch (error) {
            console.error("Delete address failed:", error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, isLoading, updateProfile, addAddress, updateAddress, deleteAddress }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

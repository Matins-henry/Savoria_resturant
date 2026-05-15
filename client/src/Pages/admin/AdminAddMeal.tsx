import MealForm from "../../Components/Features/Admin/MealForm";
import { menuService } from "../../services/api";
import { useToast } from "../../context/ToastContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function AdminAddMeal() {
    const { showToast } = useToast();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (data: any) => {
        setIsLoading(true);
        try {
            await menuService.create(data);
            showToast("Menu item created successfully", "success");
            navigate("/admin/menu");
        } catch (error: any) {
            showToast(error.response?.data?.error || "Failed to create menu item", "error");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <MealForm
                title="Add New Menu Item"
                onSubmit={handleSubmit}
                isLoading={isLoading}
            />
        </div>
    );
}

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MealForm from "../../Components/Features/Admin/MealForm";
import { menuService } from "../../services/api";
import { useToast } from "../../context/ToastContext";

export default function AdminEditMeal() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { showToast } = useToast();

    const [item, setItem] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (id) {
            fetchItem();
        }
    }, [id]);

    const fetchItem = async () => {
        try {
            const data = await menuService.getById(id!);
            setItem(data);
        } catch (error) {
            showToast("Failed to fetch item details", "error");
            navigate("/admin/menu");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (data: any) => {
        setIsSaving(true);
        try {
            await menuService.update(id!, data);
            showToast("Menu item updated successfully", "success");
            navigate("/admin/menu");
        } catch (error: any) {
            showToast(error.response?.data?.error || "Failed to update menu item", "error");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-12 text-gray-400">
                Loading item details...
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <MealForm
                title="Edit Menu Item"
                initialData={item}
                onSubmit={handleSubmit}
                isLoading={isSaving}
            />
        </div>
    );
}

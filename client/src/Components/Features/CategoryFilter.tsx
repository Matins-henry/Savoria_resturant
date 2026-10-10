import { motion } from "framer-motion";
import { Check } from "lucide-react";

export interface Category {
    id: string;
    name: string;
    icon?: React.ReactNode;
    count?: number;
}

interface CategoryFilterProps {
    categories: Category[];
    selectedCategory: string;
    onSelectCategory: (categoryId: string) => void;
    className?: string;
}

export default function CategoryFilter({
    categories,
    selectedCategory,
    onSelectCategory,
    className = "",
}: CategoryFilterProps) {
    return (
        <div className={`flex flex-wrap gap-3 ${className}`}>
            {categories.map((category, index) => {
                const isSelected = selectedCategory === category.id;
                return (
                    <motion.button
                        key={category.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        onClick={() => onSelectCategory(category.id)}
                        className={`
              relative flex items-center gap-2 px-5 py-2.5 rounded-full font-medium text-sm transition-all duration-300 overflow-hidden
              ${isSelected
                                ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-orange-500/30"
                                : "bg-gray-800/50 text-gray-400 border border-gray-700 hover:border-amber-500/30 hover:text-white"
                            }
            `}
                    >
                        {isSelected && (
                            <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center justify-center w-4 h-4 rounded-full bg-white/20">
                                <Check className="h-3 w-3" />
                            </motion.span>
                        )}
                        {category.icon && !isSelected && <span className="text-gray-500">{category.icon}</span>}
                        <span>{category.name}</span>
                        {category.count !== undefined && (
                            <span className={`px-2 py-0.5 text-xs rounded-full ${isSelected ? "bg-white/20 text-white" : "bg-gray-700 text-gray-400"}`}>
                                {category.count}
                            </span>
                        )}
                    </motion.button>
                );
            })}
        </div>
    );
}

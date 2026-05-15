import { motion } from "framer-motion";
import { Minus, Plus } from "lucide-react";

interface QuantitySelectorProps {
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
    size?: "sm" | "md" | "lg";
    className?: string;
}

export default function QuantitySelector({
    value,
    onChange,
    min = 1,
    max = 99,
    size = "md",
    className = "",
}: QuantitySelectorProps) {
    const handleDecrement = () => value > min && onChange(value - 1);
    const handleIncrement = () => value < max && onChange(value + 1);

    const sizes = {
        sm: { button: "w-8 h-8", icon: "h-3 w-3", input: "w-10 text-sm", gap: "gap-1" },
        md: { button: "w-10 h-10", icon: "h-4 w-4", input: "w-12 text-base", gap: "gap-2" },
        lg: { button: "w-12 h-12", icon: "h-5 w-5", input: "w-14 text-lg", gap: "gap-3" },
    };

    const s = sizes[size];

    return (
        <div className={`flex items-center ${s.gap} ${className}`}>
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDecrement}
                disabled={value <= min}
                className={`${s.button} rounded-full flex items-center justify-center bg-gray-800 border border-gray-700 text-gray-300 hover:border-amber-500/50 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all`}
            >
                <Minus className={s.icon} />
            </motion.button>
            <input
                type="number"
                value={value}
                onChange={(e) => {
                    const v = parseInt(e.target.value, 10);
                    if (!isNaN(v) && v >= min && v <= max) onChange(v);
                }}
                min={min}
                max={max}
                className={`${s.input} text-center bg-transparent text-white font-semibold focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
            />
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleIncrement}
                disabled={value >= max}
                className={`${s.button} rounded-full flex items-center justify-center bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all`}
            >
                <Plus className={s.icon} />
            </motion.button>
        </div>
    );
}

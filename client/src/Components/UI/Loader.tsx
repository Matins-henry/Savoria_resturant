import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

// ============================================================================
// TYPES
// ============================================================================

type LoaderVariant = "spinner" | "dots" | "pulse";
type LoaderSize = "sm" | "md" | "lg" | "xl";

interface LoaderProps {
    /** Loader animation variant */
    variant?: LoaderVariant;
    /** Loader size */
    size?: LoaderSize;
    /** Custom color (defaults to amber) */
    color?: "amber" | "white" | "gray";
    /** Optional label text */
    label?: string;
    /** Center in container */
    centered?: boolean;
    /** Full screen overlay */
    fullScreen?: boolean;
    /** Additional class name */
    className?: string;
}

// ============================================================================
// STYLES
// ============================================================================

const sizeMap: Record<LoaderSize, { spinner: number; dot: number; text: string }> = {
    sm: { spinner: 16, dot: 6, text: "text-xs" },
    md: { spinner: 24, dot: 8, text: "text-sm" },
    lg: { spinner: 32, dot: 10, text: "text-base" },
    xl: { spinner: 48, dot: 14, text: "text-lg" },
};

const colorMap: Record<string, { primary: string; secondary: string }> = {
    amber: { primary: "text-amber-500", secondary: "text-amber-500/30" },
    white: { primary: "text-white", secondary: "text-white/30" },
    gray: { primary: "text-gray-400", secondary: "text-gray-700" },
};

// ============================================================================
// SPINNER VARIANT
// ============================================================================

function Spinner({
    size,
    color,
}: {
    size: LoaderSize;
    color: "amber" | "white" | "gray";
}) {
    const dimensions = sizeMap[size].spinner;
    const colors = colorMap[color];

    return (
        <svg
            width={dimensions}
            height={dimensions}
            viewBox="0 0 24 24"
            fill="none"
            className={cn("animate-spin", colors.primary)}
        >
            {/* Background circle */}
            <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="3"
                className={colors.secondary}
            />
            {/* Spinning arc */}
            <path
                d="M12 2a10 10 0 0 1 10 10"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
            />
        </svg>
    );
}

// ============================================================================
// DOTS VARIANT
// ============================================================================

function Dots({
    size,
    color,
}: {
    size: LoaderSize;
    color: "amber" | "white" | "gray";
}) {
    const dotSize = sizeMap[size].dot;
    const colors = colorMap[color];

    const dotVariants = {
        initial: { y: 0 },
        animate: { y: [-4, 4, -4] },
    };

    return (
        <div className="flex items-center gap-1">
            {[0, 1, 2].map((i) => (
                <motion.div
                    key={i}
                    variants={dotVariants}
                    initial="initial"
                    animate="animate"
                    transition={{
                        duration: 0.6,
                        repeat: Infinity,
                        delay: i * 0.15,
                        ease: "easeInOut",
                    }}
                    style={{ width: dotSize, height: dotSize }}
                    className={cn("rounded-full bg-current", colors.primary)}
                />
            ))}
        </div>
    );
}

// ============================================================================
// PULSE VARIANT
// ============================================================================

function Pulse({
    size,
    color,
}: {
    size: LoaderSize;
    color: "amber" | "white" | "gray";
}) {
    const dimensions = sizeMap[size].spinner;
    const colors = colorMap[color];

    return (
        <div className="relative" style={{ width: dimensions, height: dimensions }}>
            <motion.div
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className={cn("absolute inset-0 rounded-full bg-current", colors.primary)}
            />
            <motion.div
                animate={{ scale: [1, 1.3, 1], opacity: [0.7, 0.2, 0.7] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                className={cn("absolute inset-0 rounded-full bg-current", colors.primary)}
            />
            <div
                className={cn("absolute inset-1/4 rounded-full bg-current", colors.primary)}
            />
        </div>
    );
}

// ============================================================================
// SKELETON COMPONENT (Bonus export)
// ============================================================================

interface SkeletonProps {
    className?: string;
    width?: string | number;
    height?: string | number;
    rounded?: "sm" | "md" | "lg" | "full";
}

export function Skeleton({
    className,
    width,
    height,
    rounded = "md",
}: SkeletonProps) {
    const roundedStyles = {
        sm: "rounded",
        md: "rounded-lg",
        lg: "rounded-xl",
        full: "rounded-full",
    };

    return (
        <div
            style={{ width, height }}
            className={cn(
                "relative overflow-hidden bg-gray-800",
                roundedStyles[rounded],
                className
            )}
        >
            <motion.div
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
            />
        </div>
    );
}

// ============================================================================
// MAIN LOADER COMPONENT
// ============================================================================

function Loader({
    variant = "spinner",
    size = "md",
    color = "amber",
    label,
    centered = false,
    fullScreen = false,
    className,
}: LoaderProps) {
    const LoaderComponent = {
        spinner: Spinner,
        dots: Dots,
        pulse: Pulse,
    }[variant];

    const content = (
        <div
            className={cn(
                "flex flex-col items-center justify-center gap-3",
                centered && "w-full h-full",
                className
            )}
        >
            <LoaderComponent size={size} color={color} />
            {label && (
                <p className={cn("text-gray-400", sizeMap[size].text)}>{label}</p>
            )}
        </div>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/90 backdrop-blur-sm">
                {content}
            </div>
        );
    }

    return content;
}

export default Loader;
export type { LoaderProps, LoaderVariant, LoaderSize, SkeletonProps };

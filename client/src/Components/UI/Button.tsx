import { forwardRef, type ButtonHTMLAttributes, type ReactNode, useRef, useState } from "react";
import { motion, type HTMLMotionProps, useSpring, useMotionValue } from "framer-motion";
import { Loader2 } from "lucide-react";
import { cn } from "../../lib/utils";

// ============================================================================
// TYPES
// ============================================================================

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg" | "icon";

interface ButtonProps
    extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className"> {
    /** Button style variant */
    variant?: ButtonVariant;
    /** Button size */
    size?: ButtonSize;
    /** Show loading spinner and disable button */
    isLoading?: boolean;
    /** Icon to display before children */
    leftIcon?: ReactNode;
    /** Icon to display after children */
    rightIcon?: ReactNode;
    /** Full width button */
    fullWidth?: boolean;
    /** Additional class names */
    className?: string;
    /** Button content */
    children?: ReactNode;
}

// ============================================================================
// STYLES
// ============================================================================

const baseStyles = `
  relative inline-flex items-center justify-center gap-2
  font-semibold rounded-full
  transition-all duration-200 ease-out
  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-950
  disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none
`;

const variantStyles: Record<ButtonVariant, string> = {
    primary: `
    bg-gradient-to-r from-amber-500 via-orange-500 to-red-500
    text-white
    shadow-lg shadow-orange-500/30
    hover:shadow-orange-500/50 hover:brightness-110
    focus:ring-amber-500
    ring-1 ring-white/10
  `,
    secondary: `
    bg-gray-800 text-white
    border border-gray-700
    hover:bg-gray-700 hover:border-gray-600
    focus:ring-gray-500
  `,
    outline: `
    bg-transparent text-white
    border-2 border-white/20
    hover:bg-white/10 hover:border-white/30
    focus:ring-white/50
  `,
    ghost: `
    bg-transparent text-gray-300
    hover:bg-white/10 hover:text-white
    focus:ring-white/30
  `,
    danger: `
    bg-red-600 text-white
    shadow-lg shadow-red-500/25
    hover:bg-red-500 hover:shadow-red-500/40
    focus:ring-red-500
  `,
};

const sizeStyles: Record<ButtonSize, string> = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
    icon: "p-3",
};

// ============================================================================
// COMPONENT
// ============================================================================

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            variant = "primary",
            size = "md",
            isLoading = false,
            leftIcon,
            rightIcon,
            fullWidth = false,
            className,
            children,
            disabled,
            ...props
        },
        _ref
    ) => {
        const buttonRef = useRef<HTMLButtonElement>(null);
        const [isHovered, setIsHovered] = useState(false);
        const isDisabled = disabled || isLoading;

        // Magnetic Effect Logic
        const mouseX = useMotionValue(0);
        const mouseY = useMotionValue(0);

        const springConfig = { damping: 20, stiffness: 150 };
        const x = useSpring(mouseX, springConfig);
        const y = useSpring(mouseY, springConfig);

        const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
            if (!buttonRef.current || isDisabled) return;
            const { clientX, clientY } = e;
            const { left, top, width, height } = buttonRef.current.getBoundingClientRect();

            const center = { x: left + width / 2, y: top + height / 2 };
            const distance = { x: clientX - center.x, y: clientY - center.y };

            // Limit the magnetic pull distance
            mouseX.set(distance.x * 0.3);
            mouseY.set(distance.y * 0.3);
        };

        const handleMouseLeave = () => {
            mouseX.set(0);
            mouseY.set(0);
            setIsHovered(false);
        };

        return (
            <motion.button
                ref={buttonRef}
                style={{ x, y }}
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={handleMouseLeave}
                whileTap={!isDisabled ? { scale: 0.96 } : undefined}
                className={cn(
                    baseStyles,
                    variantStyles[variant],
                    sizeStyles[size],
                    fullWidth && "w-full",
                    "overflow-hidden group/btn",
                    className
                )}
                disabled={isDisabled}
                {...(props as HTMLMotionProps<"button">)}
            >
                {/* Liquid Fill Effect */}
                <motion.div
                    className="absolute inset-0 bg-white/10"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{
                        scale: isHovered ? 4 : 0,
                        opacity: isHovered ? 1 : 0
                    }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    style={{ borderRadius: "100%" }}
                />

                {/* Content Container (relative to stay above liquid fill) */}
                <span className="relative z-10 flex items-center gap-2">
                    {/* Loading spinner */}
                    {isLoading && (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    )}

                    {/* Left icon (hidden when loading) */}
                    {!isLoading && leftIcon && (
                        <span className="inline-flex shrink-0">{leftIcon}</span>
                    )}

                    {/* Children */}
                    {children && (
                        <span className={cn(isLoading && "opacity-0")}>{children}</span>
                    )}

                    {/* Right icon */}
                    {!isLoading && rightIcon && (
                        <span className="inline-flex shrink-0">{rightIcon}</span>
                    )}
                </span>
            </motion.button>
        );
    }
);

Button.displayName = "Button";

export default Button;
export type { ButtonProps, ButtonVariant, ButtonSize };

import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { cn } from "../../lib/utils";

// ============================================================================
// TYPES
// ============================================================================

type InputSize = "sm" | "md" | "lg";

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
    /** Input label */
    label?: string;
    /** Helper text displayed below input */
    helperText?: string;
    /** Error message (also sets error state) */
    error?: string;
    /** Icon displayed on the left */
    leftIcon?: ReactNode;
    /** Icon displayed on the right */
    rightIcon?: ReactNode;
    /** Input size variant */
    size?: InputSize;
    /** Full width input */
    fullWidth?: boolean;
    /** Additional class name for container */
    containerClassName?: string;
}

// ============================================================================
// STYLES
// ============================================================================

const containerStyles = "flex flex-col gap-2";

const labelStyles = `
  text-sm font-medium text-gray-300
  transition-colors duration-200
`;

const inputWrapperStyles = `
  relative flex items-center
  bg-white/5 backdrop-blur-md
  border border-white/10 rounded-2xl
  transition-all duration-300
  focus-within:border-amber-500/50 focus-within:ring-2 focus-within:ring-amber-500/10
  hover:bg-white/[0.08] hover:border-white/20
`;

const inputWrapperErrorStyles = `
  border-red-500/50 
  focus-within:border-red-500 focus-within:ring-red-500/20
  hover:border-red-500/70
`;

const inputBaseStyles = `
  flex-1 bg-transparent
  text-white placeholder-gray-500
  focus:outline-none
  disabled:opacity-50 disabled:cursor-not-allowed
`;

const sizeStyles: Record<InputSize, { input: string; icon: string }> = {
    sm: { input: "px-3 py-2 text-sm", icon: "h-4 w-4" },
    md: { input: "px-4 py-3 text-base", icon: "h-5 w-5" },
    lg: { input: "px-5 py-4 text-lg", icon: "h-6 w-6" },
};

const helperTextStyles = "text-xs text-gray-500";
const errorTextStyles = "text-xs text-red-400 flex items-center gap-1";

// ============================================================================
// COMPONENT
// ============================================================================

const Input = forwardRef<HTMLInputElement, InputProps>(
    (
        {
            label,
            helperText,
            error,
            leftIcon,
            rightIcon,
            size = "md",
            fullWidth = false,
            containerClassName,
            className,
            id,
            disabled,
            ...props
        },
        ref
    ) => {
        const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
        const hasError = Boolean(error);

        return (
            <div className={cn(containerStyles, fullWidth && "w-full", containerClassName)}>
                {/* Label */}
                {label && (
                    <label
                        htmlFor={inputId}
                        className={cn(labelStyles, hasError && "text-red-400")}
                    >
                        {label}
                    </label>
                )}

                {/* Input Wrapper */}
                <div
                    className={cn(
                        inputWrapperStyles,
                        hasError && inputWrapperErrorStyles,
                        disabled && "opacity-50"
                    )}
                >
                    {/* Left Icon */}
                    {leftIcon && (
                        <span
                            className={cn(
                                "pl-5 text-gray-400 flex items-center justify-center",
                                hasError && "text-red-400",
                                sizeStyles[size].icon
                            )}
                        >
                            {leftIcon}
                        </span>
                    )}

                    {/* Input */}
                    <input
                        ref={ref}
                        id={inputId}
                        disabled={disabled}
                        className={cn(
                            inputBaseStyles,
                            sizeStyles[size].input,
                            leftIcon && "pl-3",
                            rightIcon && "pr-3",
                            className
                        )}
                        aria-invalid={hasError}
                        aria-describedby={
                            error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
                        }
                        {...props}
                    />

                    {/* Right Icon */}
                    {rightIcon && (
                        <span
                            className={cn(
                                "pr-4 text-gray-500",
                                hasError && "text-red-400",
                                sizeStyles[size].icon
                            )}
                        >
                            {rightIcon}
                        </span>
                    )}
                </div>

                {/* Helper/Error Text */}
                <AnimatePresence mode="wait">
                    {error ? (
                        <motion.p
                            key="error"
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            transition={{ duration: 0.15 }}
                            id={`${inputId}-error`}
                            className={errorTextStyles}
                            role="alert"
                        >
                            <AlertCircle className="h-3 w-3" />
                            {error}
                        </motion.p>
                    ) : helperText ? (
                        <motion.p
                            key="helper"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            id={`${inputId}-helper`}
                            className={helperTextStyles}
                        >
                            {helperText}
                        </motion.p>
                    ) : null}
                </AnimatePresence>
            </div>
        );
    }
);

Input.displayName = "Input";

export default Input;
export type { InputProps, InputSize };

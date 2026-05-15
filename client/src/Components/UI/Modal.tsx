import { useEffect, useCallback, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { createPortal } from "react-dom";
import { cn } from "../../lib/utils";

// ============================================================================
// TYPES
// ============================================================================

type ModalSize = "sm" | "md" | "lg" | "xl" | "full";

interface ModalProps {
    /** Controls modal visibility */
    isOpen: boolean;
    /** Called when modal should close */
    onClose: () => void;
    /** Modal title (optional) */
    title?: string;
    /** Modal description (optional) */
    description?: string;
    /** Modal content */
    children: ReactNode;
    /** Modal size */
    size?: ModalSize;
    /** Show close button */
    showCloseButton?: boolean;
    /** Close on overlay click */
    closeOnOverlayClick?: boolean;
    /** Close on Escape key */
    closeOnEscape?: boolean;
    /** Additional class for modal content */
    className?: string;
    /** Footer content (buttons, etc.) */
    footer?: ReactNode;
}

// ============================================================================
// STYLES
// ============================================================================

const overlayStyles = `
  fixed inset-0 z-50
  bg-gray-950/80 backdrop-blur-sm
  flex items-center justify-center
  p-4
`;

const modalBaseStyles = `
  relative w-full
  glass rounded-[2rem]
  shadow-2xl shadow-black/80
  overflow-hidden glow-gold
`;

const sizeStyles: Record<ModalSize, string> = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-2xl",
    full: "max-w-[90vw] max-h-[90vh]",
};

const headerStyles = `
  flex items-center justify-between
  px-6 py-5
  border-b border-white/5
`;

const bodyStyles = "px-6 py-6";

const footerStyles = `
  flex items-center justify-end gap-3
  px-6 py-4
  border-t border-white/5
  bg-gray-950/50
`;

const closeButtonStyles = `
  p-2 rounded-lg
  text-gray-400 hover:text-white
  hover:bg-white/10
  transition-colors duration-200
  focus:outline-none focus:ring-2 focus:ring-amber-500/50
`;

// ============================================================================
// ANIMATIONS
// ============================================================================

const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
};

const modalVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: { type: "spring", duration: 0.4, bounce: 0.15 } as any,
    },
    exit: {
        opacity: 0,
        scale: 0.95,
        y: 20,
        transition: { duration: 0.2 },
    },
};

// ============================================================================
// COMPONENT
// ============================================================================

function Modal({
    isOpen,
    onClose,
    title,
    description,
    children,
    size = "md",
    showCloseButton = true,
    closeOnOverlayClick = true,
    closeOnEscape = true,
    className,
    footer,
}: ModalProps) {
    // Handle Escape key
    const handleEscape = useCallback(
        (e: KeyboardEvent) => {
            if (e.key === "Escape" && closeOnEscape) {
                onClose();
            }
        },
        [closeOnEscape, onClose]
    );

    // Lock body scroll when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
            document.addEventListener("keydown", handleEscape);
        } else {
            document.body.style.overflow = "";
        }

        return () => {
            document.body.style.overflow = "";
            document.removeEventListener("keydown", handleEscape);
        };
    }, [isOpen, handleEscape]);

    // Handle overlay click
    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget && closeOnOverlayClick) {
            onClose();
        }
    };

    const modalContent = (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    variants={overlayVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className={overlayStyles}
                    onClick={handleOverlayClick}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby={title ? "modal-title" : undefined}
                    aria-describedby={description ? "modal-description" : undefined}
                >
                    <motion.div
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className={cn(modalBaseStyles, sizeStyles[size], className)}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Decorative gradient corner */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-500/10 to-transparent rounded-bl-full pointer-events-none" />

                        {/* Header */}
                        {(title || showCloseButton) && (
                            <div className={headerStyles}>
                                <div>
                                    {title && (
                                        <h2
                                            id="modal-title"
                                            className="text-xl font-semibold text-white"
                                        >
                                            {title}
                                        </h2>
                                    )}
                                    {description && (
                                        <p
                                            id="modal-description"
                                            className="text-sm text-gray-400 mt-1"
                                        >
                                            {description}
                                        </p>
                                    )}
                                </div>
                                {showCloseButton && (
                                    <button
                                        onClick={onClose}
                                        className={closeButtonStyles}
                                        aria-label="Close modal"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                )}
                            </div>
                        )}

                        {/* Body */}
                        <div className={cn(bodyStyles, size === "full" && "overflow-y-auto max-h-[60vh]")}>
                            {children}
                        </div>

                        {/* Footer */}
                        {footer && <div className={footerStyles}>{footer}</div>}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );

    // Render to portal
    if (typeof document !== "undefined") {
        return createPortal(modalContent, document.body);
    }

    return null;
}

export default Modal;
export type { ModalProps, ModalSize };

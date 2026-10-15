import React from 'react';
import { motion } from 'framer-motion';

interface LogoProps {
    size?: 'sm' | 'md' | 'lg' | 'xl';
    showText?: boolean;
    className?: string;
    textClassName?: string;
}

export const CulinaryIcon: React.FC<{ sizeClassName?: string }> = ({ sizeClassName = "w-12 h-12" }) => {
    return (
        <div className={`relative ${sizeClassName} rounded-2xl bg-gradient-to-br from-amber-400 via-orange-500 to-red-600 flex items-center justify-center shadow-xl shadow-orange-500/30 overflow-hidden p-1.5`}>
            {/* Inner border highlight */}
            <div className="absolute inset-0 rounded-2xl border border-white/25 pointer-events-none" />

            {/* Culinary Vector Artwork */}
            <svg
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full text-white"
            >
                {/* Subtle Steam lines */}
                <path
                    d="M44 14C41 18 43 21 41 25"
                    stroke="#FEF08A"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    opacity="0.85"
                />
                <path
                    d="M50 11C47 16 53 19 50 24"
                    stroke="#FFFFFF"
                    strokeWidth="3"
                    strokeLinecap="round"
                />
                <path
                    d="M56 14C59 18 57 21 59 25"
                    stroke="#FEF08A"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    opacity="0.85"
                />

                {/* Cloche Knob */}
                <ellipse cx="50" cy="27" rx="3.5" ry="2.5" fill="#FEF08A" />

                {/* Dining Cloche Dome */}
                <path
                    d="M24 53C24 35 76 35 76 53Z"
                    fill="white"
                />

                {/* Inner Cloche Curve Highlight */}
                <path
                    d="M32 50C35 41 65 41 68 50"
                    stroke="#F59E0B"
                    strokeWidth="2"
                    strokeLinecap="round"
                    opacity="0.4"
                />

                {/* Cloche Serving Platter / Rim */}
                <rect x="20" y="53" width="60" height="4" rx="2" fill="#FEF08A" />
                <rect x="18" y="56" width="64" height="2.5" rx="1.25" fill="white" />

                {/* Crossed Cutlery (Fork and Knife) */}
                {/* Fork */}
                <g transform="translate(50, 72) rotate(-35) translate(-50, -72)">
                    <line x1="50" y1="62" x2="50" y2="85" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                    <path d="M46 62C46 67 54 67 54 62" stroke="white" strokeWidth="2" fill="none" />
                    <line x1="47.5" y1="57" x2="47.5" y2="62" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
                    <line x1="50" y1="56" x2="50" y2="62" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
                    <line x1="52.5" y1="57" x2="52.5" y2="62" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
                </g>

                {/* Knife */}
                <g transform="translate(50, 72) rotate(35) translate(-50, -72)">
                    <line x1="50" y1="62" x2="50" y2="85" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                    <path
                        d="M50 62L50 56C50 54 53 56 53 60L51.5 62Z"
                        fill="white"
                    />
                </g>

                {/* Center Gourmet Star */}
                <circle cx="50" cy="72" r="3" fill="#DC2626" stroke="#FEF08A" strokeWidth="1" />
            </svg>
        </div>
    );
};

export default function Logo({
    size = 'md',
    showText = true,
    className = "",
    textClassName = ""
}: LogoProps) {
    const sizeMap = {
        sm: { icon: "w-8 h-8 rounded-xl", text: "text-lg", sub: "text-[8px] tracking-[0.2em]" },
        md: { icon: "w-11 h-11 sm:w-12 sm:h-12 rounded-2xl", text: "text-2xl", sub: "text-[10px] tracking-[0.3em]" },
        lg: { icon: "w-14 h-14 rounded-2xl", text: "text-3xl", sub: "text-[11px] tracking-[0.3em]" },
        xl: { icon: "w-20 h-20 rounded-3xl", text: "text-4xl", sub: "text-xs tracking-[0.35em]" }
    };

    const currentSize = sizeMap[size];

    return (
        <div className={`flex items-center gap-3 group ${className}`}>
            <motion.div
                whileHover={{ scale: 1.05, rotate: 3 }}
                whileTap={{ scale: 0.95 }}
                className="relative"
            >
                {/* Glow backdrop */}
                <div className="absolute inset-0 bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 rounded-2xl blur-lg opacity-40 group-hover:opacity-75 transition-opacity" />

                <CulinaryIcon sizeClassName={currentSize.icon} />
            </motion.div>

            {showText && (
                <div className={textClassName}>
                    <motion.span
                        className={`${currentSize.text} font-bold bg-gradient-to-r from-white via-white to-gray-200 bg-clip-text text-transparent tracking-tight font-serif block leading-none`}
                        whileHover={{ scale: 1.01 }}
                    >
                        Savoria
                    </motion.span>
                    <p className={`${currentSize.sub} uppercase text-amber-500/80 font-medium mt-1`}>
                        Fine Dining & Kitchen
                    </p>
                </div>
            )}
        </div>
    );
}

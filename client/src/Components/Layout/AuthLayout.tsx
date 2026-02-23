import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Sparkles } from "lucide-react";

interface AuthLayoutProps {
    children: React.ReactNode;
    title: string;
    subtitle: string;
    image?: string;
}

export default function AuthLayout({
    children,
    title,
    subtitle,
    image = "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=1920&q=80",
}: AuthLayoutProps) {
    return (
        <div className="min-h-screen bg-gray-950 flex">
            {/* Left Side - Form */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center px-4 sm:px-12 lg:px-24 relative z-10">
                {/* Background Elements for Mobile */}
                <div className="lg:hidden absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=1920&q=80')] bg-cover bg-center opacity-10" />
                    <div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-gray-950/90 to-gray-950" />
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md mx-auto relative"
                >
                    {/* Logo & Back Link */}
                    <div className="mb-12 flex items-center justify-between">
                        <Link
                            to="/"
                            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
                        >
                            <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                            Back to Home
                        </Link>
                        <Link to="/" className="flex items-center gap-2 lg:hidden">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                                <span className="text-white font-bold font-serif">S</span>
                            </div>
                        </Link>
                    </div>

                    {/* Header */}
                    <div className="mb-10">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">
                                {title}
                            </h1>
                            <p className="text-gray-400 text-lg">{subtitle}</p>
                        </motion.div>
                    </div>

                    {/* Form Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-gray-900/50 backdrop-blur-xl border border-white/5 rounded-2xl p-8 shadow-2xl"
                    >
                        {children}
                    </motion.div>

                    {/* Footer */}
                    <div className="mt-8 text-center">
                        <p className="text-gray-500 text-sm">
                            &copy; {new Date().getFullYear()} Savoria. All rights reserved.
                        </p>
                    </div>
                </motion.div>
            </div>

            {/* Right Side - Image */}
            <div className="hidden lg:block w-1/2 relative overflow-hidden">
                <motion.div
                    initial={{ scale: 1.1, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1.5 }}
                    className="absolute inset-0"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-transparent to-transparent z-10" />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent z-10" />
                    <img
                        src={image}
                        alt="Fine Dining"
                        className="w-full h-full object-cover"
                    />
                </motion.div>

                {/* Floating Quote/Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                    className="absolute bottom-12 right-12 z-20 max-w-md text-right"
                >
                    <div className="bg-gray-950/30 backdrop-blur-md border border-white/10 p-6 rounded-2xl inline-block">
                        <div className="flex items-center justify-end gap-2 mb-2 text-amber-400">
                            <Sparkles className="h-5 w-5" />
                            <span className="font-medium uppercase tracking-wider text-sm">
                                Experience Excellence
                            </span>
                        </div>
                        <p className="text-white text-xl font-serif italic leading-relaxed">
                            "Culinary art is not just about food, it's about creating memories that last a lifetime."
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

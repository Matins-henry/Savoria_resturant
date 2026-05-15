import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
    MapPin,
    Phone,
    Mail,
    Clock,
    Facebook,
    Twitter,
    Instagram,
    Youtube,
    ArrowRight,
    Sparkles,
} from "lucide-react";

export default function Footer() {

    const footerLinks = {
        explore: [
            { name: "Our Menu", path: "/menu" },
            { name: "Reservations", path: "/booking" },
            { name: "About Us", path: "/about" },
            { name: "Gift Cards", path: "/gift-cards" },
            { name: "Private Events", path: "/events" },
        ],
        legal: [
            { name: "Privacy Policy", path: "/privacy" },
            { name: "Terms of Service", path: "/terms" },
            { name: "Accessibility", path: "/accessibility" },
        ],
    };

    const socialLinks = [
        { icon: Facebook, href: "#", label: "Facebook" },
        { icon: Instagram, href: "#", label: "Instagram" },
        { icon: Twitter, href: "#", label: "Twitter" },
        { icon: Youtube, href: "#", label: "Youtube" },
    ];

    return (
        <footer className="relative bg-gray-950 overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[150px]" />
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-orange-500/5 rounded-full blur-[150px]" />
            </div>

            {/* ===== NEWSLETTER SECTION ===== */}
            <div className="relative border-b border-white/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className="relative">
                        {/* Background Card */}
                        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-red-500/10 rounded-3xl blur-xl" />

                        <div className="relative bg-gradient-to-br from-gray-900/90 to-gray-900/70 backdrop-blur-xl border border-white/10 rounded-3xl p-10 lg:p-14">
                            <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
                                <div className="text-center lg:text-left max-w-xl">
                                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-medium mb-4">
                                        <Sparkles className="h-4 w-4" />
                                        Exclusive Updates
                                    </span>
                                    <h3 className="text-3xl lg:text-4xl font-bold text-white mb-3">
                                        Subscribe to Our Newsletter
                                    </h3>
                                    <p className="text-gray-400 text-lg">
                                        Get exclusive offers, new menu alerts, chef's specials, and culinary tips delivered straight to your inbox.
                                    </p>
                                </div>

                                <form className="w-full lg:w-auto flex flex-col sm:flex-row gap-3">
                                    <div className="relative flex-1 min-w-[280px]">
                                        <input
                                            type="email"
                                            placeholder="Enter your email"
                                            className="w-full bg-gray-900/80 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 transition-colors"
                                        />
                                    </div>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        type="submit"
                                        className="px-8 py-4 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white font-semibold rounded-2xl shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 transition-shadow flex items-center justify-center gap-2"
                                    >
                                        Subscribe
                                        <ArrowRight className="h-5 w-5" />
                                    </motion.button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ===== MAIN FOOTER ===== */}
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
                    {/* Brand */}
                    <div className="lg:col-span-1">
                        <Link to="/" className="flex items-center gap-3 mb-6 group">
                            <motion.div
                                whileHover={{ scale: 1.05, rotate: 5 }}
                                className="relative"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
                                <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 flex items-center justify-center shadow-xl shadow-orange-500/30">
                                    <span className="text-white font-bold text-2xl font-serif">S</span>
                                </div>
                            </motion.div>
                            <div>
                                <span className="text-2xl font-bold text-white">Savoria</span>
                                <p className="text-[10px] uppercase tracking-[0.25em] text-amber-500/70 font-medium">
                                    Fine Dining
                                </p>
                            </div>
                        </Link>

                        <p className="text-gray-400 mb-8 leading-relaxed">
                            Where culinary excellence meets exceptional hospitality. Experience fine dining at its finest since 2009.
                        </p>

                        {/* Social Links */}
                        <div className="flex gap-3">
                            {socialLinks.map((social) => (
                                <motion.a
                                    key={social.label}
                                    href={social.href}
                                    aria-label={social.label}
                                    whileHover={{ scale: 1.1, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="w-11 h-11 rounded-xl bg-gray-900/80 border border-white/5 flex items-center justify-center text-gray-400 hover:bg-gradient-to-r hover:from-amber-500 hover:to-orange-500 hover:text-white hover:border-transparent transition-all"
                                >
                                    <social.icon className="h-5 w-5" />
                                </motion.a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-white font-semibold text-lg mb-6 flex items-center gap-2">
                            <span className="w-8 h-px bg-gradient-to-r from-amber-500 to-transparent" />
                            Explore
                        </h4>
                        <ul className="space-y-4">
                            {footerLinks.explore.map((link) => (
                                <li key={link.path}>
                                    <Link
                                        to={link.path}
                                        className="text-gray-400 hover:text-amber-400 transition-colors inline-flex items-center gap-2 group"
                                    >
                                        <span className="w-0 group-hover:w-2 h-px bg-amber-500 transition-all" />
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h4 className="text-white font-semibold text-lg mb-6 flex items-center gap-2">
                            <span className="w-8 h-px bg-gradient-to-r from-amber-500 to-transparent" />
                            Legal
                        </h4>
                        <ul className="space-y-4">
                            {footerLinks.legal.map((link) => (
                                <li key={link.path}>
                                    <Link
                                        to={link.path}
                                        className="text-gray-400 hover:text-amber-400 transition-colors inline-flex items-center gap-2 group"
                                    >
                                        <span className="w-0 group-hover:w-2 h-px bg-amber-500 transition-all" />
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-white font-semibold text-lg mb-6 flex items-center gap-2">
                            <span className="w-8 h-px bg-gradient-to-r from-amber-500 to-transparent" />
                            Contact Us
                        </h4>
                        <ul className="space-y-5">
                            <li className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0">
                                    <MapPin className="h-5 w-5 text-amber-500" />
                                </div>
                                <div>
                                    <p className="text-white font-medium mb-0.5">Address</p>
                                    <p className="text-gray-400 text-sm">
                                        123 Gourmet Street, Foodie City, FC 12345
                                    </p>
                                </div>
                            </li>
                            <li className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0">
                                    <Phone className="h-5 w-5 text-amber-500" />
                                </div>
                                <div>
                                    <p className="text-white font-medium mb-0.5">Phone</p>
                                    <a href="tel:+234 710 6678" className="text-gray-400 text-sm hover:text-amber-400 transition-colors">
                                      +234 710 6678
                                    </a>
                                </div>
                            </li>
                            <li className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0">
                                    <Mail className="h-5 w-5 text-amber-500" />
                                </div>
                                <div>
                                    <p className="text-white font-medium mb-0.5">Email</p>
                                    <a href="mailto:hello@savoria.com" className="text-gray-400 text-sm hover:text-amber-400 transition-colors">
                                        hello@savoria.com
                                    </a>
                                </div>
                            </li>
                            <li className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0">
                                    <Clock className="h-5 w-5 text-amber-500" />
                                </div>
                                <div>
                                    <p className="text-white font-medium mb-0.5">Hours</p>
                                    <p className="text-gray-400 text-sm">Mon-Fri: 11am - 10pm</p>
                                    <p className="text-gray-400 text-sm">Sat-Sun: 10am - 11pm</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* ===== COPYRIGHT ===== */}
            <div className="relative border-t border-white/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="border-t border-white/5 pt-8 mt-12 flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-gray-500 text-sm">
                            © 2024 Savoria. All rights reserved.
                        </p>
                        <div className="flex items-center gap-6">
                            <Link to="/admin" className="text-gray-500 hover:text-amber-500 text-sm transition-colors">
                                Admin Login
                            </Link>
                            <div className="flex gap-4">
                                <Link to="#" className="text-gray-400 hover:text-white transition-colors">Privacy</Link>
                                <Link to="#" className="text-gray-400 hover:text-white transition-colors">Terms</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

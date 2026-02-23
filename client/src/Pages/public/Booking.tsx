import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, Users, MessageSquare, CheckCircle2, ChevronDown, Sparkles, MapPin } from "lucide-react";
import Button from "../../Components/UI/Button";

import Modal from "../../Components/UI/Modal";
import { bookingService } from "../../services/api";
import { useToast } from "../../context/ToastContext";

export default function Booking() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const { showToast } = useToast();
    const [formData, setFormData] = useState({
        date: "",
        time: "",
        guests: 2,
        name: "",
        email: "",
        phone: "",
        requests: "",
    });

    const timeSlots = [
        "17:00", "17:30", "18:00", "18:30", "19:00", "19:30",
        "20:00", "20:30", "21:00", "21:30"
    ];

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await bookingService.create(formData);
            setShowSuccessModal(true);
        } catch (error: any) {
            showToast(error.response?.data?.error || "Failed to create reservation", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-950 selection:bg-amber-500/30">
            {/* Immersive Hero Section */}
            <div className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
                <motion.div
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 1.5 }}
                    className="absolute inset-0"
                >
                    <img
                        src="https://images.unsplash.com/photo-1550966871-3ed3c47e2ce2?w=1920&q=80"
                        alt="Restaurant Interior"
                        className="w-full h-full object-cover"
                    />
                    {/* Layered Overlays for Depth */}
                    <div className="absolute inset-0 bg-gray-950/60 backdrop-blur-[1px]" />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/20 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-b from-gray-950/40 via-transparent to-transparent" />
                </motion.div>

                {/* Animated Orbs */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <motion.div
                        animate={{
                            y: [0, -20, 0],
                            opacity: [0.2, 0.4, 0.2],
                        }}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute top-1/4 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px]"
                    />
                </div>

                <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-light border border-white/10 text-amber-400 text-sm font-medium mb-6 backdrop-blur-md"
                    >
                        <Sparkles className="h-4 w-4" />
                        Exclusive Dining Experience
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-5xl md:text-7xl font-medium text-white mb-6 font-serif tracking-tight"
                    >
                        Reserve Your <br />
                        <span className="text-gradient-gold italic">Masterpiece Table</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto font-light tracking-wide"
                    >
                        Join us for an evening where culinary art meets effortless elegance.
                        Your journey into the extraordinary starts here.
                    </motion.p>
                </div>
            </div>

            {/* Booking Form Section */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-20 pb-32">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="glass rounded-[2rem] p-8 md:p-14 shadow-2xl glow-gold"
                >
                    <form onSubmit={handleSubmit} className="space-y-12">
                        {/* Phase 1: Occasion & Time */}
                        <div>
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                                    <Calendar className="h-5 w-5 text-amber-400" />
                                </div>
                                <h2 className="text-2xl font-serif text-white">Select Date & Time</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div className="space-y-3">
                                    <label className="text-xs uppercase tracking-widest font-semibold text-gray-500">
                                        Preferred Date
                                    </label>
                                    <div className="relative group">
                                        <input
                                            type="date"
                                            name="date"
                                            required
                                            min={new Date().toISOString().split('T')[0]}
                                            value={formData.date}
                                            onChange={handleInputChange}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all [color-scheme:dark] hover:bg-white/[0.08]"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-xs uppercase tracking-widest font-semibold text-gray-500">
                                        Arrival Time
                                    </label>
                                    <div className="relative group">
                                        <select
                                            name="time"
                                            required
                                            value={formData.time}
                                            onChange={handleInputChange}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all appearance-none cursor-pointer hover:bg-white/[0.08]"
                                        >
                                            <option value="" disabled className="bg-gray-900">Select time</option>
                                            {timeSlots.map(time => (
                                                <option key={time} value={time} className="bg-gray-900">{time}</option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none group-focus-within:rotate-180 transition-transform" />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-xs uppercase tracking-widest font-semibold text-gray-500">
                                        Party Size
                                    </label>
                                    <div className="relative group">
                                        <select
                                            name="guests"
                                            value={formData.guests}
                                            onChange={handleInputChange}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all appearance-none cursor-pointer hover:bg-white/[0.08]"
                                        >
                                            {[1, 2, 3, 4, 5, 6, 7, 8, "9+"].map(num => (
                                                <option key={num} value={num} className="bg-gray-900">{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none group-focus-within:rotate-180 transition-transform" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                        {/* Phase 2: Personal Information */}
                        <div>
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                                    <Users className="h-5 w-5 text-amber-400" />
                                </div>
                                <h2 className="text-2xl font-serif text-white">Guest Information</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-xs uppercase tracking-widest font-semibold text-gray-500 ml-1">Full Name</label>
                                    <input
                                        name="name"
                                        placeholder="Enter your name"
                                        required
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all hover:bg-white/[0.08]"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-xs uppercase tracking-widest font-semibold text-gray-500 ml-1">Email Address</label>
                                    <input
                                        name="email"
                                        type="email"
                                        placeholder="name@example.com"
                                        required
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all hover:bg-white/[0.08]"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-xs uppercase tracking-widest font-semibold text-gray-500 ml-1">Phone Number</label>
                                    <input
                                        name="phone"
                                        type="tel"
                                        placeholder="+1 (555) 000-0000"
                                        required
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all hover:bg-white/[0.08]"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-xs uppercase tracking-widest font-semibold text-gray-500 ml-1">Special Occasion</label>
                                    <div className="relative group">
                                        <MessageSquare className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                                        <input
                                            name="requests"
                                            placeholder="Anniversary, Birthday, etc."
                                            value={formData.requests}
                                            onChange={handleInputChange}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-5 py-4 text-white focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all hover:bg-white/[0.08]"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4">
                            <Button
                                type="submit"
                                size="lg"
                                fullWidth
                                isLoading={isSubmitting}
                                className="h-16 text-lg tracking-widest uppercase font-bold bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 shadow-xl shadow-amber-500/20 border-0"
                            >
                                Confirm My Reservation
                            </Button>
                            <p className="text-center mt-6 text-gray-500 text-sm flex items-center justify-center gap-2">
                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                                Instant confirmation via email
                            </p>
                        </div>
                    </form>
                </motion.div>

                {/* Additional Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
                    {[
                        { icon: MapPin, title: "Location", desc: "123 Elegance Blvd, NY 1001" },
                        { icon: Clock, title: "Hours", desc: "Mon-Sun: 5PM - 11PM" },
                        { icon: Users, title: "Dress Code", desc: "Elegant / Smart Casual" }
                    ].map((item, i) => (
                        <motion.div
                            key={item.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * i }}
                            viewport={{ once: true }}
                            className="p-8 rounded-[1.5rem] glass border border-white/5 text-center transition-transform hover:-translate-y-2 duration-300"
                        >
                            <div className="w-12 h-12 rounded-full bg-amber-500/5 border border-amber-500/10 flex items-center justify-center mx-auto mb-4">
                                <item.icon className="h-6 w-6 text-amber-500" />
                            </div>
                            <h3 className="text-white font-serif text-xl mb-2">{item.title}</h3>
                            <p className="text-gray-500 text-sm">{item.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Success Modal */}
            <Modal
                isOpen={showSuccessModal}
                onClose={() => setShowSuccessModal(false)}
                size="sm"
                showCloseButton={false}
                className="text-center"
            >
                <div className="flex flex-col items-center py-8">
                    <motion.div
                        initial={{ scale: 0, rotate: -45 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", duration: 0.8, bounce: 0.5 }}
                        className="w-24 h-24 bg-gradient-to-br from-amber-500/20 to-orange-500/10 rounded-full flex items-center justify-center mb-8 border border-amber-500/20"
                    >
                        <CheckCircle2 className="h-12 w-12 text-amber-500" />
                    </motion.div>
                    <h2 className="text-3xl font-serif text-white mb-3">Reservation Placed</h2>
                    <p className="text-gray-400 mb-8 leading-relaxed">
                        We are honored to host you on <br />
                        <span className="text-white font-medium">
                            {formData.date} at {formData.time}
                        </span>
                        <br />
                        An elegant evening awaits.
                    </p>
                    <Button
                        fullWidth
                        size="lg"
                        onClick={() => setShowSuccessModal(false)}
                    >
                        Return Home
                    </Button>
                </div>
            </Modal>
        </div>
    );
}

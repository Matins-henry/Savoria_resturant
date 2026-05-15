import { motion } from "framer-motion";
import { Award, Users, Leaf, Heart, Star, ChefHat, Sparkles, Instagram, Linkedin } from "lucide-react";
import Team1 from "../../assets/Team1.png";
import Team2 from "../../assets/Team2.png";
import Team3 from "../../assets/Team3.png";

export default function About() {
    const stats = [
        { label: "Years of Excellence", value: "15+", icon: Award },
        { label: "Happy Guests", value: "50k+", icon: Users },
        { label: "Awards Won", value: "24", icon: Star },
        { label: "Expert Chefs", value: "12", icon: ChefHat },
    ];

    const team = [
        {
            name: "Elena Rossi",
            role: "Executive Chef",
            image: Team1,
            bio: "With over 20 years of experience in Michelin-starred kitchens across Europe, Elena specializes in modern Mediterranean fusion.",
            featured: true,
            socials: { instagram: "#", twitter: "#", linkedin: "#" }
        },
        {
            name: "Marcus Chen",
            role: "Head Sommelier",
            image: Team3,
            bio: "Curating our award-winning wine list with a passion for sustainable viticulture and rare vintage exploration.",
            featured: false,
            socials: { instagram: "#", twitter: "#", linkedin: "#" }
        },
        {
            name: "Sarah James",
            role: "Pastry Chef",
            image: Team2,
            bio: "Creating sweet masterpieces that blend traditional pastry techniques with avant-garde flavor profiles.",
            featured: false,
            socials: { instagram: "#", twitter: "#", linkedin: "#" }
        },
    ];

    const values = [
        {
            title: "Sustainability",
            description: "We source our ingredients from local, organic farms to minimize our carbon footprint.",
            icon: Leaf,
        },
        {
            title: "Passion",
            description: "Every dish is crafted with love and attention to detail by our dedicated team.",
            icon: Heart,
        },
        {
            title: "Excellence",
            description: "We strive for perfection in every aspect of your dining experience.",
            icon: Star,
        },
    ];

    return (
        <div className="min-h-screen bg-gray-950">
            {/* Hero Section */}
            <div className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1920&q=80"
                        alt="Restaurant Interior"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gray-950/70 backdrop-blur-[2px]" />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent" />
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="relative z-10 text-center px-4 max-w-4xl mx-auto"
                >
                    <span className="text-amber-500 font-medium tracking-widest uppercase mb-4 block">Our Story</span>
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 font-serif leading-tight">
                        Crafting Culinary Memories Since 2008
                    </h1>
                    <p className="text-xl text-gray-300 leading-relaxed">
                        A journey of flavor, passion, and tradition in the heart of the city.
                    </p>
                </motion.div>
            </div>

            {/* Philosophy Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 font-serif">
                            Where Tradition Meets Innovation
                        </h2>
                        <div className="space-y-6 text-gray-400 text-lg leading-relaxed">
                            <p>
                                At Savoria, we believe that food is more than just sustenance—it's an art form that brings people together. Our philosophy is rooted in the respect for ingredients, honoring their natural flavors while exploring new culinary territories.
                            </p>
                            <p>
                                Founded by Chef Elena Rossi, our kitchen is a playground where classic techniques are reimagined with a modern twist. We work closely with local farmers and artisans to ensure that every plate tells a story of the season and the land.
                            </p>
                        </div>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative"
                    >
                        <div className="absolute inset-0 bg-gradient-to-tr from-amber-500 to-orange-600 rounded-2xl transform rotate-3 opacity-20" />
                        <img
                            src="https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80"
                            alt="Chef Plating"
                            className="relative rounded-2xl shadow-2xl w-full"
                        />
                    </motion.div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-20 bg-gray-900/50 border-y border-white/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="text-center"
                            >
                                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500">
                                    <stat.icon className="h-6 w-6" />
                                </div>
                                <h3 className="text-4xl font-bold text-white mb-2">{stat.value}</h3>
                                <p className="text-gray-400">{stat.label}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-serif">Meet The Team</h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        The talented individuals behind every memorable dining experience.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {team.map((member, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.15 }}
                            className="group"
                        >
                            <div className="relative bg-gradient-to-br from-gray-900/80 to-gray-900/40 backdrop-blur-md rounded-[2.5rem] overflow-hidden border border-white/5 hover:border-amber-500/30 transition-all duration-500">
                                {/* Image container */}
                                <div className="relative aspect-[4/5] overflow-hidden">
                                    <img
                                        src={member.image}
                                        alt={member.name}
                                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-110"
                                    />
                                    {/* Gradient overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/20 to-transparent opacity-80" />

                                    {/* Featured badge */}
                                    {member.featured && (
                                        <div className="absolute top-6 left-6 px-4 py-1.5 bg-amber-500/90 backdrop-blur-md text-black text-[10px] font-bold uppercase tracking-widest rounded-full shadow-xl shadow-amber-500/20 flex items-center gap-1.5">
                                            <Sparkles className="h-3 w-3" />
                                            Owner
                                        </div>
                                    )}

                                    {/* Socials Hover */}
                                    <div className="absolute bottom-6 right-6 flex flex-col gap-3 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                                        <button className="p-3 bg-white/10 backdrop-blur-md rounded-full border border-white/10 hover:bg-amber-500 hover:text-black transition-all">
                                            <Instagram className="h-4 w-4" />
                                        </button>
                                        <button className="p-3 bg-white/10 backdrop-blur-md rounded-full border border-white/10 hover:bg-amber-500 hover:text-black transition-all">
                                            <Linkedin className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-8 relative">
                                    <div className="absolute top-0 left-8 w-12 h-0.5 bg-amber-500 transform -translate-y-px" />

                                    <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-amber-500 transition-colors font-serif">
                                        {member.name}
                                    </h3>
                                    <p className="text-amber-500/80 text-xs font-semibold uppercase tracking-widest mb-4">
                                        {member.role}
                                    </p>
                                    <p className="text-gray-400 text-sm leading-relaxed mb-6 italic opacity-80 group-hover:opacity-100 transition-opacity">
                                        "{member.bio}"
                                    </p>

                                    <div className="h-px w-full bg-gradient-to-r from-white/10 to-transparent" />
                                </div>

                                {/* Inner Shadow/Glow */}
                                <div className="absolute inset-0 border border-white/5 rounded-[2.5rem] pointer-events-none group-hover:border-amber-500/20 transition-colors" />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Values Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-20">
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 md:p-16 border border-white/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                    <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-12">
                        {values.map((value, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.2 }}
                                className="text-center md:text-left"
                            >
                                <div className="w-14 h-14 rounded-2xl bg-gray-800 border border-white/10 flex items-center justify-center text-amber-500 mb-6 mx-auto md:mx-0">
                                    <value.icon className="h-7 w-7" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">{value.title}</h3>
                                <p className="text-gray-400 leading-relaxed">{value.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}

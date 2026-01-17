import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Award, Globe, Loader } from 'lucide-react';

interface Achievement {
    id: string;
    icon: string;
    title: string;
    event: string;
    detail: string;
    description: string;
    date: string;
    color: string;
    iconBg: string;
    order?: number;
}

const Achievements: React.FC = () => {
    const [achievements, setAchievements] = useState<Achievement[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

    useEffect(() => {
        const fetchAchievements = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${API_URL}/achievements`);
                if (!response.ok) {
                    throw new Error('Failed to fetch achievements');
                }
                const data = await response.json();
                // Sort by order if available, otherwise by creation date
                const sortedData = data.sort((a: Achievement, b: Achievement) => {
                    if (a.order !== undefined && b.order !== undefined) {
                        return a.order - b.order;
                    }
                    return 0;
                });
                setAchievements(sortedData);
                setError(null);
            } catch (err) {
                console.error('Error fetching achievements:', err);
                setError('Failed to load achievements');
            } finally {
                setLoading(false);
            }
        };

        fetchAchievements();
    }, [API_URL]);

    // Icon mapping helper
    const getIconComponent = (iconName: string) => {
        const iconMap: { [key: string]: any } = {
            '🏆': Trophy,
            '🥈': Award,
            '🌍': Globe,
            '🎓': Award,
        };
        return iconMap[iconName] || Trophy;
    };

    if (loading) {
        return (
            <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-10 relative overflow-hidden">
                <div className="container mx-auto max-w-7xl">
                    <div className="flex justify-center items-center min-h-[400px]">
                        <Loader className="w-8 h-8 text-cyan-400 animate-spin" />
                    </div>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-10 relative overflow-hidden">
                <div className="container mx-auto max-w-7xl">
                    <div className="text-center text-red-400 min-h-[400px] flex items-center justify-center">
                        <p>{error}</p>
                    </div>
                </div>
            </section>
        );
    }

    if (achievements.length === 0) {
        return null; // Don't show section if no achievements
    }

    return (
        <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-10 relative overflow-hidden">
            <div className="container mx-auto max-w-7xl">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12 sm:mb-16"
                >
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
                        <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                            Achievements & Recognition
                        </span>
                    </h2>
                    <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto">
                        Recent wins and recognition in hackathons, competitions, and fellowship programs
                    </p>
                </motion.div>

                {/* Achievement Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-6">
                    {achievements.map((achievement, index) => {
                        const IconComponent = getIconComponent(achievement.icon);
                        return (
                            <motion.div
                                key={achievement.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.2, duration: 0.6 }}
                                className="group relative"
                            >
                                {/* Glowing background */}
                                <div className={`absolute -inset-0.5 bg-gradient-to-r ${achievement.color} opacity-20 blur-lg group-hover:opacity-40 transition-opacity duration-300 rounded-xl`}></div>

                                {/* Card */}
                                <div className="relative h-full backdrop-blur-sm bg-black/60 border border-cyan-500/30 rounded-xl p-6 hover:border-cyan-500/60 transition-all duration-300 group-hover:transform group-hover:scale-[1.02]">
                                    {/* Icon and Date */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div className={`p-3 rounded-lg ${achievement.iconBg} flex-shrink-0`}>
                                            <IconComponent className="w-6 h-6 text-black" />
                                        </div>
                                        <span className="text-xs text-gray-500 font-mono">{achievement.date}</span>
                                    </div>

                                    {/* Title */}
                                    <h3 className={`text-xl sm:text-2xl font-bold bg-gradient-to-r ${achievement.color} bg-clip-text text-transparent mb-2`}>
                                        {achievement.title}
                                    </h3>

                                    {/* Event name */}
                                    <div className="text-cyan-300 font-semibold mb-2 text-sm sm:text-base">
                                        {achievement.event}
                                    </div>

                                    {/* Detail */}
                                    <div className="text-xs text-gray-400 mb-3 font-medium">
                                        {achievement.detail}
                                    </div>

                                    {/* Description */}
                                    <p className="text-sm text-gray-300 leading-relaxed">
                                        {achievement.description}
                                    </p>

                                    {/* Decorative line */}
                                    <div className={`mt-4 h-1 w-16 bg-gradient-to-r ${achievement.color} rounded-full`}></div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default Achievements;

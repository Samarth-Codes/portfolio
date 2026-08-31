import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Briefcase, Calendar, MapPin, ArrowRight, Sparkles } from 'lucide-react';
import { ExperienceData, FALLBACK_EXPERIENCE } from '../types/experience';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const CurrentExperienceCard: React.FC = () => {
  const [experience, setExperience] = useState<ExperienceData>(FALLBACK_EXPERIENCE);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    const fetchExperience = async () => {
      try {
        const response = await fetch(`${API_URL}/current-experience`);
        if (response.ok) {
          const data = await response.json();
          if (isMounted && data && data.company) {
            setExperience({
              ...FALLBACK_EXPERIENCE,
              ...data
            });
          }
        }
      } catch (err) {
        // Silently use fallback data if backend is offline
        console.warn('Using fallback experience data:', err);
      }
    };

    fetchExperience();
    return () => {
      isMounted = false;
    };
  }, []);

  const dateDisplay = experience.currentlyWorking
    ? `${experience.startDate || 'Current'} → Present`
    : `${experience.startDate} → ${experience.endDate || 'Present'}`;

  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-10 relative overflow-hidden">
      <div className="container mx-auto max-w-7xl">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono mb-3">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>PROFESSIONAL TIMELINE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
            <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500 bg-clip-text text-transparent">
              Current Experience
            </span>
          </h2>
        </motion.div>

        {/* Experience Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto group relative cursor-pointer"
          onClick={() => navigate('/experience')}
        >
          {/* Glowing Aura Effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/30 via-blue-500/20 to-purple-500/30 rounded-2xl blur-xl opacity-30 group-hover:opacity-70 transition duration-500"></div>

          {/* Main Card Content */}
          <div className="relative rounded-2xl bg-black/80 backdrop-blur-md border border-cyan-500/30 group-hover:border-cyan-400/80 p-6 sm:p-8 md:p-10 transition-all duration-300 shadow-2xl group-hover:shadow-[0_0_30px_rgba(6,182,212,0.25)]">
            
            {/* Top Bar: Live Status & Duration */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/40 text-cyan-400">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    {experience.currentlyWorking && (
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                      </span>
                    )}
                    <span className="text-xs font-mono tracking-wider font-semibold text-emerald-400 uppercase">
                      {experience.currentlyWorking ? 'Active Internship' : 'Experience'}
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {experience.role}
                  </h3>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs font-mono text-gray-400">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white/5 border border-white/10">
                  <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                  {dateDisplay}
                </span>
                {experience.location && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white/5 border border-white/10">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                    {experience.location}
                  </span>
                )}
              </div>
            </div>

            {/* Company Name */}
            <div className="mb-4">
              <h4 className="text-lg sm:text-xl font-semibold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                {experience.company}
              </h4>
            </div>

            {/* Short Description */}
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-6">
              {experience.shortDescription}
            </p>

            {/* Technologies */}
            {experience.technologies && experience.technologies.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {experience.technologies.map((tech, i) => (
                  <span
                    key={i}
                    className="text-xs font-mono px-2.5 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            )}

            {/* CTA Button */}
            <div className="flex items-center justify-between pt-4 border-t border-white/5">
              <span className="text-xs text-gray-400 hidden sm:inline">
                Click to explore technical breakdown & engineering highlights
              </span>
              <button
                type="button"
                className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-400 group-hover:text-cyan-300 group-hover:translate-x-1 transition-all ml-auto"
              >
                <span>View My Work</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CurrentExperienceCard;

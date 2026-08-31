import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Briefcase,
  Calendar,
  MapPin,
  ArrowLeft,
  Terminal,
  Code2,
  Server,
  Workflow,
  Sparkles,
  Layers,
  CheckCircle2,
  Loader
} from 'lucide-react';
import { ExperienceData, FALLBACK_EXPERIENCE } from '../types/experience';
import ScrollReveal from '../components/ScrollReveal';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const Experience: React.FC = () => {
  const [experience, setExperience] = useState<ExperienceData>(FALLBACK_EXPERIENCE);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    const fetchExperience = async () => {
      try {
        setLoading(true);
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
        console.warn('Using fallback experience data:', err);
      } finally {
        if (isMounted) setLoading(false);
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

  // Helper to categorize or parse highlight items into title & description
  const parseHighlight = (highlight: string, index: number) => {
    if (highlight.includes(':')) {
      const [title, ...descParts] = highlight.split(':');
      return {
        title: title.trim(),
        description: descParts.join(':').trim(),
        icon: getHighlightIcon(title)
      };
    }
    return {
      title: `Engineering Milestone 0${index + 1}`,
      description: highlight.trim(),
      icon: Layers
    };
  };

  const getHighlightIcon = (title: string) => {
    const lower = title.toLowerCase();
    if (lower.includes('software') || lower.includes('frontend') || lower.includes('ui')) return Code2;
    if (lower.includes('backend') || lower.includes('api') || lower.includes('server')) return Server;
    if (lower.includes('automation') || lower.includes('pipeline') || lower.includes('data')) return Workflow;
    if (lower.includes('impact') || lower.includes('performance') || lower.includes('leadership')) return Sparkles;
    return Terminal;
  };

  return (
    <main className="flex-grow pt-24 pb-16 px-4 sm:px-6 lg:px-10 relative overflow-hidden">
      <div className="container mx-auto max-w-5xl">
        
        {/* Back Navigation */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 text-sm font-mono text-cyan-400 hover:text-cyan-300 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>RETURN TO MATRIX</span>
          </button>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <Loader className="w-8 h-8 text-cyan-400 animate-spin" />
          </div>
        ) : (
          <div className="space-y-12">
            
            {/* Header Hero Card */}
            <ScrollReveal direction="up" delay={0.1}>
              <div className="relative rounded-2xl bg-black/80 backdrop-blur-xl border border-cyan-500/30 p-6 sm:p-10 shadow-2xl overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

                {/* Top Status & Date Pill */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
                    {experience.currentlyWorking && (
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                      </span>
                    )}
                    <span className="font-semibold uppercase">
                      {experience.currentlyWorking ? 'Active Internship' : 'Professional Experience'}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-gray-400">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-white/5 border border-white/10">
                      <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                      {dateDisplay}
                    </span>
                    {experience.location && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-white/5 border border-white/10">
                        <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                        {experience.location}
                      </span>
                    )}
                  </div>
                </div>

                {/* Title & Organization */}
                <div className="mb-6">
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2">
                    {experience.role}
                  </h1>
                  <h2 className="text-xl sm:text-2xl font-semibold bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500 bg-clip-text text-transparent">
                    {experience.company}
                  </h2>
                </div>

                {/* Overview Text */}
                <div className="text-gray-300 text-base sm:text-lg leading-relaxed max-w-4xl border-t border-white/10 pt-6">
                  <p>{experience.detailedDescription || experience.shortDescription}</p>
                </div>
              </div>
            </ScrollReveal>

            {/* What I Have Worked On / Engineering Focus */}
            <ScrollReveal direction="up" delay={0.2}>
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-white">
                      What I Have Worked On
                    </h2>
                    <p className="text-xs sm:text-sm font-mono text-gray-400">
                      Engineering areas, technical architecture & strategic execution
                    </p>
                  </div>
                </div>

                {/* Highlight Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {experience.highlights.map((item, index) => {
                    const { title, description, icon: IconComponent } = parseHighlight(item, index);
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                        className="group relative rounded-xl bg-black/60 backdrop-blur-sm border border-cyan-500/20 hover:border-cyan-400/60 p-6 transition-all duration-300 hover:transform hover:-translate-y-1 shadow-lg"
                      >
                        <div className="flex items-start gap-4">
                          <div className="p-3 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 group-hover:bg-cyan-500/20 group-hover:border-cyan-400/40 transition-colors flex-shrink-0">
                            <IconComponent className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-cyan-300 mb-2 group-hover:text-cyan-200 transition-colors">
                              {title}
                            </h3>
                            <p className="text-sm text-gray-300 leading-relaxed">
                              {description}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </ScrollReveal>

            {/* Technologies & Tools Stack */}
            {experience.technologies && experience.technologies.length > 0 && (
              <ScrollReveal direction="up" delay={0.3}>
                <div className="rounded-2xl bg-black/60 backdrop-blur-sm border border-cyan-500/30 p-6 sm:p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400">
                      <Terminal className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold text-white">
                        Technologies & Tools Used
                      </h2>
                      <p className="text-xs sm:text-sm font-mono text-gray-400">
                        Modern stack and frameworks utilized during the experience
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {experience.technologies.map((tech, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg font-mono text-sm bg-cyan-950/50 border border-cyan-500/40 text-cyan-300 hover:border-cyan-400 hover:bg-cyan-900/40 transition-all shadow-sm"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            )}

            {/* Bottom Actions */}
            <ScrollReveal direction="up" delay={0.4}>
              <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-white/10">
                <Link
                  to="/projects"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 hover:border-cyan-400 transition-all font-semibold text-sm"
                >
                  <span>Explore Featured Projects</span>
                </Link>

                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-bold hover:opacity-90 transition-opacity text-sm"
                >
                  <span>Get in Touch</span>
                </Link>
              </div>
            </ScrollReveal>

          </div>
        )}
      </div>
    </main>
  );
};

export default Experience;

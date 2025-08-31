import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code, Palette, Database, Cloud, Brain, Zap } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';
import StaggeredContainer from '../components/StaggeredContainer';

interface Skill {
  id: number;
  name: string;
  level: number;
  category: string;
  icon: string;
  description?: string;
}

interface SkillCategory {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const skills: Skill[] = [
    // Frontend
    { id: 1, name: "React", level: 90, category: "Frontend", icon: "⚛️" },
    { id: 2, name: "JavaScript", level: 95, category: "Frontend", icon: "📘" },
    { id: 3, name: "HTML", level: 95, category: "Frontend", icon: "🌐" },
    { id: 4, name: "CSS", level: 90, category: "Frontend", icon: "🎨" },
    { id: 5, name: "Bootstrap", level: 85, category: "Frontend", icon: "🎯" },
    { id: 6, name: "Tailwind", level: 70, category: "Frontend", icon: "💨" },

    // Backend
    { id: 7, name: "Node.js", level: 85, category: "Backend", icon: "🟢" },
    { id: 8, name: "Express", level: 50, category: "Backend", icon: "🚀" },
    { id: 9, name: "Python", level: 70, category: "Backend", icon: "🐍" },
    { id: 10, name: "Java", level: 85, category: "Backend", icon: "☕" },
    { id: 11, name: "C", level: 50, category: "Backend", icon: "🔧" },

    // AI/ML
    { id: 12, name: "PyTorch", level: 60, category: "AI/ML", icon: "🔥" },
    { id: 13, name: "Scikit-learn", level: 70, category: "AI/ML", icon: "🧠" },
    { id: 14, name: "OpenAI API", level: 85, category: "AI/ML", icon: "🤖" },
    { id: 15, name: "Gemini API", level: 80, category: "AI/ML", icon: "💎" },

    // DevOps & Cloud
    { id: 16, name: "Docker", level: 60, category: "DevOps", icon: "🐳" },
    { id: 17, name: "Git", level: 90, category: "DevOps", icon: "📝" },
    { id: 18, name: "GitHub", level: 90, category: "DevOps", icon: "🐙" },
    { id: 19, name: "Google Cloud", level: 50, category: "DevOps", icon: "☁️" },
    { id: 20, name: "Vercel", level: 85, category: "DevOps", icon: "⚡" },
    { id: 21, name: "Render", level: 80, category: "DevOps", icon: "🎨" },
    { id: 22, name: "Firebase", level: 85, category: "DevOps", icon: "🔥" },

    // Blockchain
    { id: 23, name: "Solidity", level: 60, category: "Blockchain", icon: "🔗" },
    { id: 24, name: "Web3.js", level: 60, category: "Blockchain", icon: "🌐" },
    { id: 25, name: "Ethereum", level: 60, category: "Blockchain", icon: "⚡" }
];

const categories: SkillCategory[] = [
    { id: 'all', name: 'ALL', icon: Zap, color: '#00ffff' },
    { id: 'Frontend', name: 'FRONTEND', icon: Code, color: '#ff00ff' },
    { id: 'Backend', name: 'BACKEND', icon: Database, color: '#00ff00' },
    { id: 'AI/ML', name: 'AI/ML', icon: Brain, color: '#ff8800' },
    { id: 'DevOps', name: 'DEVOPS', icon: Cloud, color: '#8800ff' },
    { id: 'Blockchain', name: 'BLOCKCHAIN', icon: Palette, color: '#ffff00' }
];

const Skills: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [animatedSkills, setAnimatedSkills] = useState<number[]>([]);

  const filteredSkills = useMemo(() => {
    return activeCategory === 'all'
      ? skills
      : skills.filter(skill => skill.category === activeCategory);
  }, [activeCategory]);

  // Handle animations when category changes
  useEffect(() => {
    setAnimatedSkills([]);
    
    const timer = setTimeout(() => {
      const currentFilteredSkills = activeCategory === 'all'
        ? skills
        : skills.filter(skill => skill.category === activeCategory);
      setAnimatedSkills(currentFilteredSkills.map(skill => skill.id));
    }, 100);
    
    return () => clearTimeout(timer);
  }, [activeCategory]);

  return (
    <main className="flex-grow pt-20">
      <section className="py-24 px-4 md:px-10 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="container mx-auto max-w-7xl">
          <ScrollReveal direction="down" delay={0.1}>
            <h1 className="heading-h1 text-center text-primary-color mb-8">
              CORE MATRIX
            </h1>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.2}>
            <p className="text-lead text-secondary-color text-center mb-16 max-w-3xl mx-auto text-readable">
              A comprehensive arsenal of cutting-edge technologies and frameworks that power the future of digital innovation.
            </p>
          </ScrollReveal>

          {/* Category Filter */}
          <ScrollReveal direction="up" delay={0.3}>
            <StaggeredContainer 
              staggerDelay={0.08} 
              className="flex flex-wrap justify-center gap-2 xs:gap-3 sm:gap-4 mb-12 sm:mb-16 px-2"
            >
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`category-btn group relative flex items-center gap-1 xs:gap-2 px-3 xs:px-4 sm:px-6 py-2 xs:py-2.5 sm:py-3 text-xs xs:text-sm sm:text-button rounded-lg border-2 overflow-hidden clickable transition-all duration-300 ${activeCategory === category.id
                    ? 'bg-primary text-black border-primary'
                    : 'bg-transparent text-secondary-color border-border-color hover:border-primary hover:text-primary'
                    }`}
                  style={{
                    color: activeCategory === category.id ? '#000' : category.color
                  }}
                >
                  <category.icon className="w-3 h-3 xs:w-4 xs:h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:scale-110" />
                  <span className="hidden xs:inline">{category.name}</span>
                  <span className="xs:hidden">{category.name.slice(0, 3)}</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                </button>
              ))}
            </StaggeredContainer>
          </ScrollReveal>

          {/* Skills Grid */}
          <ScrollReveal direction="up" delay={0.4}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8"
              >
              {filteredSkills.map((skill, index) => (
                <motion.div
                  key={`${activeCategory}-${skill.id}`}
                  initial={{ opacity: 0, y: 50, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.9 }}
                  transition={{
                    delay: index * 0.1,
                    duration: 0.6,
                    ease: [0.25, 0.46, 0.45, 0.94]
                  }}
                  className="group"
                >
                  <div className="relative rounded-lg overflow-hidden border border-border-color bg-black/50 backdrop-blur-sm p-6 h-full transition-all duration-300 hover:border-primary/50">
                    {/* Subtle hover effect */}
                    <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-gradient-to-br from-primary/3 via-transparent to-primary/3" />

                    <div className="relative z-10">
                      <div className="flex items-center gap-4 mb-4">
                        <motion.span
                          className="text-3xl transition-transform duration-300 group-hover:scale-110"
                          whileHover={{ rotate: [0, -10, 10, 0] }}
                          transition={{ duration: 0.5 }}
                        >
                          {skill.icon}
                        </motion.span>
                        <div>
                          <h3 className="heading-h4 text-primary-color group-hover:text-primary transition-colors duration-300">
                            {skill.name}
                          </h3>
                          <p className="text-caption text-secondary-color group-hover:text-primary/70 transition-colors duration-300">
                            {skill.category}
                          </p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="flex justify-between text-body-sm text-secondary-color mb-2 group-hover:text-primary/80 transition-colors duration-300">
                          <span>Proficiency</span>
                          <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 + index * 0.1 }}
                          >
                            {skill.level}%
                          </motion.span>
                        </div>
                        <div className="relative w-full bg-black/30 rounded-full h-3 border border-border-color overflow-hidden group-hover:border-primary/70 transition-colors duration-300">
                          <motion.div
                            className="h-full bg-gradient-to-r from-primary via-primary to-primary/80 relative overflow-hidden"
                            initial={{ width: 0 }}
                            animate={{
                              width: animatedSkills.includes(skill.id) ? `${skill.level}%` : 0
                            }}
                            transition={{
                              duration: 1.5,
                              delay: 0.6 + index * 0.1,
                              ease: 'easeOut'
                            }}
                          >
                            {/* Subtle shine effect */}
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                              initial={{ x: '-100%' }}
                              animate={{ x: '100%' }}
                              transition={{
                                duration: 1,
                                delay: 1.2 + index * 0.1,
                                ease: "easeInOut"
                              }}
                            />
                          </motion.div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-caption text-secondary-color group-hover:text-primary/70 transition-colors duration-300">
                          {skill.level >= 90 ? 'Expert' :
                            skill.level >= 80 ? 'Advanced' :
                              skill.level >= 70 ? 'Intermediate' : 'Beginner'}
                        </span>
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <motion.div
                              key={i}
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{
                                delay: 1.2 + index * 0.1 + i * 0.05,
                                duration: 0.3,
                                ease: "backOut"
                              }}
                              className={`w-2 h-2 rounded-full transition-all duration-300 ${i < Math.floor(skill.level / 20)
                                ? 'bg-primary'
                                : 'bg-border-color/30 group-hover:bg-border-color/50'
                                }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </ScrollReveal>
        </div>
      </section>
    </main>
  );
};

export default Skills;

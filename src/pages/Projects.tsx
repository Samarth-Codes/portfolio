import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Github } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';
import StaggeredContainer from '../components/StaggeredContainer';

interface Project {
  id: number;
  title: string;
  description: string;
  category: string;
  technologies: string[];
  image: string;
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
}

interface ProjectCategory {
  id: string;
  name: string;
  color: string;
}

const Projects: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('all');

  const projects: Project[] = [
    {
      id: 1,
      title: "Traffic Hive",
      description: "A comprehensive traffic management system that uses AI to analyze traffic patterns, optimize routes, and provide real-time traffic updates for smart cities.",
      category: "AI/ML",
      technologies: ["Python", "Scikit-learn", "React", "Node.js"],
      image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=600&fit=crop",
      liveUrl: "https://traffic-hive.onrender.com/",
      githubUrl: "#",
      featured: false
    },
    {
      id: 2,
      title: "Police Bot",
      description: "An intelligent chatbot system designed for law enforcement agencies to handle routine inquiries, provide information, and assist with public safety communications.",
      category: "AI/ML",
      technologies: ["Python", "OpenAI API", "React", "Node.js"],
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop",
      liveUrl: "https://police-bot.vercel.app/",
      githubUrl: "https://github.com/Vansh-Choudhary/Police-Bot",
      featured: false
    },
    {
      id: 3,
      title: "Craibot",
      description: "An intelligent crypto trading bot that executes cryptocurrency transactions with a single command, providing automated trading capabilities and real-time market analysis.",
      category: "Blockchain",
      technologies: ["Python", "Gemini API", "React", "Express"],
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop",
      liveUrl: "craibot.vanshwebserver.tech",
      githubUrl: "#",
      featured: false
    },
    {
      id: 4,
      title: "Keystroke-Mouse",
      description: "A biometric authentication system that analyzes keystroke dynamics and mouse movement patterns to provide secure, passwordless authentication.",
      category: "AI/ML",
      technologies: ["Python", "PyTorch", "JavaScript", "Express"],
      image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=600&fit=crop",
      liveUrl: "https://keystroke-mouse-7h4m.vercel.app/",
      githubUrl: "https://github.com/Samarth-Codes/keystroke-mouse",
      featured: false
    },
    {
      id: 5,
      title: "Sorting Visualizer",
      description: "An interactive web application that demonstrates various sorting algorithms with real-time visualizations, helping users understand how different algorithms work.",
      category: "Web",
      technologies: ["JavaScript", "HTML", "CSS", "React"],
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
      liveUrl: "https://sorting-visualizer-iota-one.vercel.app/",
      githubUrl: "https://github.com/Samarth-Codes/Sorting-Visualizer",
      featured: false
    }
  ];

  const categories: ProjectCategory[] = [
    { id: 'all', name: 'ALL', color: '#00ffff' },
    { id: 'AI/ML', name: 'AI/ML', color: '#ff8800' },
    { id: 'Web', name: 'WEB', color: '#ff00ff' },
    { id: 'Blockchain', name: 'BLOCKCHAIN', color: '#ffff00' }
  ];

  const filteredProjects = activeFilter === 'all' 
    ? projects 
    : projects.filter(project => project.category === activeFilter);

  const getCategoryColor = (categoryId: string): string => {
    const category = categories.find(cat => cat.id === categoryId);
    return category?.color || '#00ffff';
  };

  return (
    <main className="flex-grow pt-20">
      <section className="py-24 px-4 md:px-10 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="container mx-auto max-w-7xl">
          <ScrollReveal direction="down" delay={0.1}>
            <h1 className="heading-h1 text-center text-primary-color mb-8">
              PROJECT ARCHIVES
            </h1>
          </ScrollReveal>
          
          <ScrollReveal direction="up" delay={0.2}>
            <p className="text-lead text-secondary-color text-center mb-16 max-w-3xl mx-auto text-readable">
              A curated collection of digital innovations that push the boundaries of what's possible in the digital realm.
            </p>
          </ScrollReveal>

          {/* Filter Buttons */}
          <ScrollReveal direction="up" delay={0.3}>
            <StaggeredContainer 
              staggerDelay={0.1} 
              className="flex flex-wrap justify-center gap-2 xs:gap-3 sm:gap-4 mb-12 sm:mb-16 px-2"
            >
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveFilter(category.id)}
                  className={`category-btn group relative px-3 xs:px-4 sm:px-6 py-2 xs:py-2.5 sm:py-3 text-xs xs:text-sm sm:text-button border-2 overflow-hidden clickable transition-all duration-300 ${
                    activeFilter === category.id
                      ? 'bg-primary text-black border-primary'
                      : 'bg-transparent border-border-color hover:border-primary'
                  }`}
                  style={{
                    color: activeFilter === category.id ? '#000' : category.color
                  }}
                >
                  {category.name}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                </button>
              ))}
            </StaggeredContainer>
          </ScrollReveal>

          {/* Projects Grid */}
          <ScrollReveal direction="up" delay={0.4}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeFilter}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8"
              >
                {filteredProjects.map((project, index) => (
                  <motion.div
                    key={`${activeFilter}-${project.id}`}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ 
                      delay: index * 0.08,
                      duration: 0.5,
                      ease: 'easeOut'
                    }}
                    className="project-card group clickable"
                  >
                <div className="relative rounded-lg overflow-hidden border border-border-color bg-black/50 backdrop-blur-sm">
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={project.image} 
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                                         <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                     {project.featured && (
                       <div className="absolute top-4 left-4 bg-primary text-black px-3 py-1 text-sm font-bold">
                         FEATURED
                       </div>
                     )}
                     {project.title === "Police Bot" && (
                       <div className="absolute top-4 left-4 bg-yellow-500 text-black px-3 py-1 text-caption">
                         TOP 10 - ACEHACK 3.0
                       </div>
                     )}
                                           {project.title === "Craibot" && (
                        <>
                          <div className="absolute top-4 left-4 bg-blue-500 text-white px-3 py-1 text-caption">
                            TOP 15 - INNOVATEX
                          </div>
                          <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 text-caption">
                            UNDER MAINTENANCE
                          </div>
                        </>
                      )}
                     {project.title === "Traffic Hive" && (
                       <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 text-caption">
                         WINNER - SDI 25
                       </div>
                     )}
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="heading-h3 text-primary-color">
                        {project.title}
                      </h3>
                      <span 
                        className="px-2 py-1 text-xs font-bold rounded border"
                        style={{
                          color: getCategoryColor(project.category),
                          borderColor: getCategoryColor(project.category),
                          backgroundColor: `${getCategoryColor(project.category)}20`
                        }}
                      >
                        {project.category}
                      </span>
                    </div>
                    <p className="text-body text-secondary-color mb-4 text-readable">
                      {project.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.technologies.map((tech) => (
                        <span 
                          key={tech}
                          className="px-3 py-1 bg-primary/20 text-primary text-caption border border-primary"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex gap-4">
                      {project.liveUrl && (
                        <a 
                          href={project.liveUrl}
                          className="btn-neon flex items-center gap-2 px-4 py-2 bg-primary text-black text-button-sm hover:bg-opacity-90 hover-scale-glow clickable"
                          style={{ color: '#000' }}
                        >
                          <ExternalLink className="w-4 h-4" />
                          LIVE
                        </a>
                      )}
                      {project.githubUrl && (
                        <a 
                          href={project.githubUrl}
                          className="btn-neon flex items-center gap-2 px-4 py-2 bg-transparent text-primary border-2 border-primary text-button-sm hover:bg-primary hover:text-black hover-neon-glow clickable"
                        >
                          <Github className="w-4 h-4" />
                          CODE
                        </a>
                      )}
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

export default Projects;

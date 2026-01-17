import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Github, Loader } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';
import StaggeredContainer from '../components/StaggeredContainer';

interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  technologies: string[];
  image: string;
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
  badge?: string;
  badgeColor?: string;
  secondaryBadge?: string;
  secondaryBadgeColor?: string;
  order?: number;
}

interface ProjectCategory {
  id: string;
  name: string;
  color: string;
}

const Projects: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  const categories: ProjectCategory[] = [
    { id: 'all', name: 'ALL', color: '#00ffff' },
    { id: 'AI/ML', name: 'AI/ML', color: '#ff8800' },
    { id: 'Web', name: 'WEB', color: '#ff00ff' },
    { id: 'Blockchain', name: 'BLOCKCHAIN', color: '#ffff00' }
  ];

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/projects`);
        if (!response.ok) {
          throw new Error('Failed to fetch projects');
        }
        const data = await response.json();
        // Sort by order if available
        const sortedData = data.sort((a: Project, b: Project) => {
          if (a.order !== undefined && b.order !== undefined) {
            return a.order - b.order;
          }
          return 0;
        });
        setProjects(sortedData);
        setError(null);
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError('Failed to load projects');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [API_URL]);

  const filteredProjects = activeFilter === 'all'
    ? projects
    : projects.filter(project => project.category === activeFilter);

  const getCategoryColor = (categoryId: string): string => {
    const category = categories.find(cat => cat.id === categoryId);
    return category?.color || '#00ffff';
  };

  const getBadgeColorClass = (color?: string) => {
    const colorMap: { [key: string]: string } = {
      'green': 'bg-green-500',
      'yellow': 'bg-yellow-500',
      'blue': 'bg-blue-500',
      'orange': 'bg-orange-500',
      'red': 'bg-red-500',
      'purple': 'bg-purple-500',
    };
    return colorMap[color || ''] || 'bg-primary';
  };

  if (loading) {
    return (
      <main className="flex-grow pt-20">
        <section className="py-24 px-4 md:px-10 relative overflow-hidden">
          <div className="container mx-auto max-w-7xl">
            <div className="flex justify-center items-center min-h-[500px]">
              <Loader className="w-8 h-8 text-cyan-400 animate-spin" />
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex-grow pt-20">
        <section className="py-24 px-4 md:px-10 relative overflow-hidden">
          <div className="container mx-auto max-w-7xl">
            <div className="text-center text-red-400 min-h-[500px] flex items-center justify-center">
              <p>{error}</p>
            </div>
          </div>
        </section>
      </main>
    );
  }

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
              className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4 mb-12 sm:mb-16 px-2"
            >
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveFilter(category.id)}
                  className={`category-btn group relative px-3 sm:px-5 md:px-6 py-2.5 sm:py-3 text-xs sm:text-sm md:text-button border-2 overflow-hidden clickable transition-all duration-300 whitespace-nowrap ${activeFilter === category.id
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
                        {project.badge && (
                          <div className={`absolute top-4 left-4 ${getBadgeColorClass(project.badgeColor)} text-white px-3 py-1 text-caption`}>
                            {project.badge}
                          </div>
                        )}
                        {project.secondaryBadge && (
                          <div className={`absolute top-4 right-4 ${getBadgeColorClass(project.secondaryBadgeColor)} text-white px-3 py-1 text-caption`}>
                            {project.secondaryBadge}
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
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn-neon flex items-center gap-2 px-4 py-2 bg-primary text-black text-button-sm hover:bg-opacity-90 hover-scale-glow clickable"
                              style={{ color: '#000' }}
                            >
                              <ExternalLink className="w-4 h-4" />
                              LIVE
                            </a>
                          )}
                          {project.githubUrl && project.githubUrl !== '#' && (
                            <a
                              href={project.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
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

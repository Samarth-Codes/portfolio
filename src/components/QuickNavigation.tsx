import React from 'react';
import { Link } from 'react-router-dom';
import { Rocket, Brain, Send } from 'lucide-react';

const QuickNavigation: React.FC = () => {
  const navigationItems = [
    {
      path: '/projects',
      icon: Rocket,
      title: 'PROJECTS',
      description: 'Explore my latest digital innovations and groundbreaking projects'
    },
    {
      path: '/skills',
      icon: Brain,
      title: 'SKILLS',
      description: 'Discover my technical expertise and creative capabilities'
    },
    {
      path: '/contact',
      icon: Send,
      title: 'CONTACT',
      description: 'Get in touch to discuss your next digital transformation'
    }
  ];

  return (
    <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-10 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      <div className="container mx-auto max-w-7xl">
        <h2 className="heading-h1 text-center text-primary-color mb-12 sm:mb-16 neon-text-subtle">
          NAVIGATE THE MATRIX
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {navigationItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="card-hover-glow group clickable"
            >
              <div className="relative rounded-lg overflow-hidden bg-transparent backdrop-blur-sm border border-primary p-6 sm:p-8 text-center group-hover:bg-primary/10 transition-all duration-500 min-h-[200px] sm:min-h-[220px] flex flex-col justify-center">
                <item.icon className="w-12 h-12 sm:w-16 sm:h-16 text-primary group-hover:text-primary transition-all duration-300 mb-3 sm:mb-4 mx-auto group-hover:scale-110 group-hover:drop-shadow-[0_0_10px_currentColor]" />
                <h3 className="heading-h4 sm:heading-h3 text-primary-color group-hover:text-primary-color transition-colors duration-300 neon-text-subtle mb-2 sm:mb-3">
                  {item.title}
                </h3>
                <p className="text-body-sm sm:text-body text-secondary-color group-hover:text-secondary-color/90 transition-colors duration-300 text-readable">
                  {item.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default QuickNavigation;

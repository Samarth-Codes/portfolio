import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleResumeClick = () => {
    // Open Google Drive directly
    window.open('https://drive.google.com/file/d/1GL1jqtVKS8rzlxX2TJfkqcBUpkNj7Kw6/view?usp=sharing', '_blank');
  };

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/', label: 'HOME' },
    { path: '/projects', label: 'PROJECTS' },
    { path: '/skills', label: 'SKILLS' },
    { path: '/contact', label: 'CONTACT' }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-[9999] bg-black/50 backdrop-blur-xl border-b border-white/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-10 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => navigate('/')}
            className="heading-h4 sm:heading-h3 text-primary-color flex-shrink-0"
          >
            <span className="hidden xs:inline">SAMARTH</span>
            <span className="xs:hidden">SC</span>
            <span className="text-accent-color hidden xs:inline">-CODES</span>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8 xl:space-x-10">
            {navItems.map((item) => (
              <motion.div
                key={item.path}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <button
                  onClick={() => {
                    console.log('Navigating to:', item.path);
                    try {
                      navigate(item.path);
                    } catch (error) {
                      console.error('Navigation failed, using window.location:', error);
                      window.location.href = item.path;
                    }
                  }}
                  className={`nav-link nav-text clickable transition-all duration-300 relative ${isActive(item.path)
                    ? 'text-accent-color'
                    : 'text-secondary-color hover:text-primary'
                    }`}
                >
                  {item.label}
                  {isActive(item.path) && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-accent-color"
                    />
                  )}
                </button>
              </motion.div>
            ))}

            {/* Resume Download Button */}
            <button
              onClick={handleResumeClick}
              className="bg-orange-500 text-black px-4 py-2 text-button-sm hover:bg-orange-400 clickable transition-all duration-300 rounded"
              style={{ color: '#000' }}
            >
              RESUME
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center space-x-2 xs:space-x-3">
            <button
              onClick={handleResumeClick}
              className="bg-orange-500 text-black px-2 xs:px-3 py-1 xs:py-2 text-xs xs:text-button-sm hover:bg-orange-400 clickable transition-all duration-300 rounded"
              style={{ color: '#000' }}
            >
              <span className="hidden xs:inline">RESUME</span>
              <span className="xs:hidden">CV</span>
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-text-primary hover:text-primary clickable p-2 transition-all duration-300"
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMenuOpen ? <X className="w-5 h-5 xs:w-6 xs:h-6" /> : <Menu className="w-5 h-5 xs:w-6 xs:h-6" />}
            </button>
          </div>
        </div>

        {/* Enhanced Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="lg:hidden mt-4 pb-4 border-t border-white/10 pt-4 overflow-hidden"
            >
              <motion.div
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                exit={{ y: -20 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="flex flex-col space-y-3"
              >
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.path}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{
                      duration: 0.3,
                      delay: 0.1 + index * 0.05,
                      ease: 'easeOut'
                    }}
                  >
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        try {
                          navigate(item.path);
                        } catch (error) {
                          console.error('Navigation failed, using window.location:', error);
                          window.location.href = item.path;
                        }
                      }}
                      className={`nav-link nav-text clickable py-2 px-3 rounded transition-all duration-300 block w-full text-left ${isActive(item.path)
                        ? 'text-accent-color bg-primary/10 border border-primary/30'
                        : 'text-secondary-color hover:text-primary hover:bg-primary/5'
                        }`}
                    >
                      {item.label}
                    </button>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;

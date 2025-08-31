import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Award, Users, Target } from 'lucide-react';
// Removed unused imports

const About: React.FC = () => {
  const stats = [
    { icon: Calendar, value: "3+", label: "Years Experience" },
    { icon: Users, value: "10+", label: "Projects Completed" },
    { icon: Award, value: "5+", label: "Awards Won" },
    { icon: Target, value: "95%", label: "Client Satisfaction" }
  ];

  return (
    <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-10 relative overflow-hidden" id="about">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Profile Picture Section */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center lg:text-left order-2 lg:order-1"
          >
            <div className="relative inline-block">
              <div className="w-64 h-64 sm:w-72 sm:h-72 lg:w-80 lg:h-80 mx-auto lg:mx-0 rounded-full overflow-hidden border-4 border-primary shadow-2xl shadow-primary/30">
                <img
                  src="/images/download.png"
                  alt="Samarth Saxena"
                  className="w-full h-full object-cover rounded-full"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/images/placeholder.svg';
                  }}
                />
              </div>
              <div className="absolute -bottom-3 -right-3 sm:-bottom-4 sm:-right-4 w-16 h-16 sm:w-20 sm:h-20 bg-primary rounded-full flex items-center justify-center">
                <span className="text-black font-bold text-sm sm:text-lg">SC</span>
              </div>
            </div>
          </motion.div>

          {/* About Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="order-1 lg:order-2"
          >
            <h2 className="heading-h1 text-primary-color mb-4 sm:mb-6 text-center lg:text-left">
              ABOUT ME
            </h2>
            <div className="space-y-4 sm:space-y-6 text-secondary-color mb-6 sm:mb-8">
              <p className="text-body-lg text-readable text-center lg:text-left">
              I am a full-stack developer and AI enthusiast passionate about building impactful digital solutions at the intersection of web technologies, machine learning.
              </p>
              <p className="text-body-lg text-readable text-center lg:text-left">
              My journey is defined by building projects that blend innovation with usability — from an AI-powered traffic system reducing congestion by 30% (🏆 Smart Delhi Ideathon 2025 Winner), to an AI legal assistant simplifying regulatory access (Top 10 at AceHack 3.0), and a Web3 tool enabling natural language crypto transactions (Top 15 at InnovateX DTU).
              </p>
              <p className="text-body-lg text-readable text-center lg:text-left">
              With expertise in React, Node.js, Java and AI APIs, I develop scalable, user-first applications. I also have a strong foundation in Data Structures & Algorithms using Java, which helps me write efficient, optimized solutions for real-world problems.

Beyond coding, I was selected as a ClimAct Fellow (UNESCO & POP), where I collaborate with global peers on climate action, policy, and technology’s role in sustainability.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 sm:gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="text-center p-3 sm:p-4 bg-black/30 border border-border-color/30 rounded-lg hover:border-primary/50 transition-all duration-300"
                >
                  <div className="flex justify-center mb-2">
                    <stat.icon className="text-xl sm:text-2xl text-primary" />
                  </div>
                  <div className="heading-h4 text-primary-color mb-1">
                    {stat.value}
                  </div>
                  <div className="text-caption text-secondary-color">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;

import React from 'react';
import { motion } from 'framer-motion';
import Hero from '../components/Hero';
import About from '../components/About';
import Achievements from '../components/Achievements';
import QuickNavigation from '../components/QuickNavigation';
import AchievementsCarousel from '../components/AchievementsCarousel';
import ScrollReveal from '../components/ScrollReveal';

const Home: React.FC = () => {
  return (
    <main className="flex-grow">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <Hero />
      </motion.div>

      <ScrollReveal direction="up" delay={0.2}>
        <About />
      </ScrollReveal>

      <ScrollReveal direction="up" delay={0.1}>
        <Achievements />
      </ScrollReveal>

      <ScrollReveal direction="up" delay={0.1}>
        <QuickNavigation />
      </ScrollReveal>

      <ScrollReveal direction="up" delay={0.3}>
        <AchievementsCarousel />
      </ScrollReveal>
    </main>
  );
};

export default Home;

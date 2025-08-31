import React, { useEffect, useRef } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';

interface ScrollRevealProps {
  children: React.ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right';
  delay?: number;
  duration?: number;
  distance?: number;
  className?: string;
  once?: boolean;
}

const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.6,
  distance = 50,
  className = '',
  once = true
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, margin: '-100px' });
  const controls = useAnimation();

  const getInitialPosition = React.useCallback(() => {
    switch (direction) {
      case 'up':
        return { y: distance, opacity: 0 };
      case 'down':
        return { y: -distance, opacity: 0 };
      case 'left':
        return { x: distance, opacity: 0 };
      case 'right':
        return { x: -distance, opacity: 0 };
      default:
        return { y: distance, opacity: 0 };
    }
  }, [direction, distance]);

  const getAnimatePosition = React.useCallback(() => {
    return { x: 0, y: 0, opacity: 1 };
  }, []);

  useEffect(() => {
    if (isInView) {
      controls.start(getAnimatePosition());
    } else if (!once) {
      controls.start(getInitialPosition());
    }
  }, [isInView, controls, once, getInitialPosition, getAnimatePosition]);

  return (
    <motion.div
      ref={ref}
      initial={getInitialPosition()}
      animate={controls}
      transition={{
        duration,
        delay,
        ease: 'easeOut'
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default ScrollReveal;
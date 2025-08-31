// Global type definitions for the portfolio application

declare module '*.png' {
  const value: string;
  export default value;
}

declare module '*.jpg' {
  const value: string;
  export default value;
}

declare module '*.jpeg' {
  const value: string;
  export default value;
}

declare module '*.gif' {
  const value: string;
  export default value;
}

declare module '*.svg' {
  const value: string;
  export default value;
}

declare module '*.webp' {
  const value: string;
  export default value;
}

// Environment variables type definitions
declare namespace NodeJS {
  interface ProcessEnv {
    REACT_APP_EMAILJS_SERVICE_ID: string;
    REACT_APP_EMAILJS_TEMPLATE_ID: string;
    REACT_APP_EMAILJS_PUBLIC_KEY: string;
  }
}

// Framer Motion custom types for better animation support
export interface AnimationVariants {
  hidden: {
    opacity: number;
    y?: number;
    x?: number;
    scale?: number;
  };
  visible: {
    opacity: number;
    y?: number;
    x?: number;
    scale?: number;
    transition?: {
      duration?: number;
      delay?: number;
      ease?: string;
      staggerChildren?: number;
    };
  };
}

// Custom CSS properties for neon effects
declare module 'react' {
  interface CSSProperties {
    '--neon-color'?: string;
    '--glow-intensity'?: string;
  }
}
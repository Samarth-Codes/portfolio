export interface ExperienceData {
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate?: string;
  currentlyWorking: boolean;
  shortDescription: string;
  detailedDescription: string;
  highlights: string[];
  technologies: string[];
  slug?: string;
  updatedAt?: string;
}

export const FALLBACK_EXPERIENCE: ExperienceData = {
  company: 'Tech Innovation Lab',
  role: 'Software Engineer Intern',
  location: 'Remote / Hybrid',
  startDate: 'Jan 2025',
  endDate: '',
  currentlyWorking: true,
  shortDescription: 'Building scalable web applications, designing RESTful APIs, and developing AI-powered automation workflows.',
  detailedDescription: 'Working on modern full-stack development, architecting high-performance web applications with React and TypeScript, optimizing backend services, and building intelligent data processing pipelines.',
  highlights: [
    'Software Development: Engineered modular, responsive user interfaces and micro-interactions using React, TypeScript, and modern CSS architectures.',
    'Backend & APIs: Developed secure Node.js/Express REST APIs with robust token-based authentication and database caching.',
    'Automation & Data Workflows: Built automated data pipelines and integrated AI models for intelligent workflow processing.',
    'Engineering Impact & Collaboration: Collaborated in agile sprints, participating in code reviews, CI/CD pipeline optimization, and system architecture discussions.'
  ],
  technologies: [
    'React',
    'TypeScript',
    'Node.js',
    'Express',
    'Firebase',
    'Tailwind CSS',
    'Python'
  ],
  slug: 'current-experience'
};

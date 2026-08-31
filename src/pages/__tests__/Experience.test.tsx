import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Experience from '../Experience';
import CurrentExperienceCard from '../../components/CurrentExperienceCard';
import { FALLBACK_EXPERIENCE } from '../../types/experience';

const renderComponent = (ui: React.ReactElement) => {
  return render(ui);
};

describe('Experience Feature Suite', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('CurrentExperienceCard Component', () => {
    it('renders fallback experience data when API is not responding', async () => {
      global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));

      renderComponent(<CurrentExperienceCard />);

      expect(screen.getByText(/Current Experience/i)).toBeInTheDocument();
      expect(screen.getByText(FALLBACK_EXPERIENCE.role)).toBeInTheDocument();
      expect(screen.getByText(FALLBACK_EXPERIENCE.company)).toBeInTheDocument();
      expect(screen.getByText(/View My Work/i)).toBeInTheDocument();
    });

    it('renders dynamic API experience data when fetch succeeds', async () => {
      const mockData = {
        company: 'Vellore Institute of Technology',
        role: 'AI Research Intern',
        location: 'Vellore, India',
        startDate: 'Jan 2025',
        endDate: '',
        currentlyWorking: true,
        shortDescription: 'Developing high-throughput computer vision pipeline.',
        detailedDescription: 'Full description of the AI research internship.',
        highlights: ['Software Development: Created AI models.'],
        technologies: ['PyTorch', 'React', 'Python']
      };

      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => mockData
      } as Response);

      renderComponent(<CurrentExperienceCard />);

      await waitFor(() => {
        expect(screen.getByText('AI Research Intern')).toBeInTheDocument();
        expect(screen.getByText('Vellore Institute of Technology')).toBeInTheDocument();
        expect(screen.getByText(/Developing high-throughput computer vision pipeline/i)).toBeInTheDocument();
        expect(screen.getByText('PyTorch')).toBeInTheDocument();
      });
    });

    it('displays Present when currentlyWorking is true', async () => {
      const mockData = {
        company: 'Test Company',
        role: 'Intern',
        startDate: 'Dec 2024',
        currentlyWorking: true,
        shortDescription: 'Summary...',
        highlights: [],
        technologies: []
      };

      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => mockData
      } as Response);

      renderComponent(<CurrentExperienceCard />);

      await waitFor(() => {
        expect(screen.getByText(/Dec 2024 → Present/i)).toBeInTheDocument();
      });
    });
  });

  describe('Experience Page Component', () => {
    it('renders the detailed experience view with highlights and tech stack', async () => {
      const mockData = {
        company: 'Tech Innovation Lab',
        role: 'Software Engineer Intern',
        location: 'Remote / Hybrid',
        startDate: 'Jan 2025',
        endDate: '',
        currentlyWorking: true,
        shortDescription: 'Short summary',
        detailedDescription: 'Full breakdown of engineering responsibilities.',
        highlights: [
          'Backend & APIs: Designed RESTful API endpoints with Express and Firestore.',
          'Automation: Automated testing and cloud deployments.'
        ],
        technologies: ['React', 'TypeScript', 'Node.js', 'Express']
      };

      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => mockData
      } as Response);

      renderComponent(<Experience />);

      await waitFor(() => {
        expect(screen.getByText('Software Engineer Intern')).toBeInTheDocument();
        expect(screen.getByText('Tech Innovation Lab')).toBeInTheDocument();
        expect(screen.getByText(/Full breakdown of engineering responsibilities/i)).toBeInTheDocument();
        expect(screen.getByText(/What I Have Worked On/i)).toBeInTheDocument();
        expect(screen.getByText(/Designed RESTful API endpoints with Express and Firestore/i)).toBeInTheDocument();
        expect(screen.getByText('Technologies & Tools Used')).toBeInTheDocument();
        expect(screen.getByText('TypeScript')).toBeInTheDocument();
      });
    });
  });
});

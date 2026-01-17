import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, User } from 'lucide-react';

const Hero: React.FC = () => {
  const scrollToAbout = () => {
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center overflow-hidden pt-20">
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-50"
        >
          <source src="https://storage.googleapis.com/stitch-assets/videos/futuristic-plexus.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/80"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_40%,_black)]"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-6 sm:gap-8 px-4 sm:px-6 max-w-6xl mx-auto w-full">
        <h1 className="heading-hero text-primary-color text-center">
          <span className="text-hero" data-text="CODE">CODE</span> OPTIMIZE<br />
          <span className="text-accent-color" data-text="SCALE">SCALE</span>
        </h1>

        <p className="text-lead text-secondary-color animate-fade-in-up max-w-3xl text-readable text-center px-2">
          Aspiring SDE skilled in Java, JavaScript, and full-stack development. Experienced in building scalable systems and impactful projects recognized at hackathons and fellowships. Excited to contribute to both MAANG-scale engineering and fast-paced startup environments.
        </p>

        <div className="flex flex-col xs:flex-row gap-3 xs:gap-4 mt-4 sm:mt-6 w-full xs:w-auto">
          <Link
            to="/projects"
            className="btn-neon flex items-center justify-center rounded-none h-12 xs:h-14 sm:h-16 px-6 xs:px-8 sm:px-10 bg-cyan-500 text-black button-text hover:bg-cyan-400 border-2 border-cyan-500 hover-scale-glow clickable transition-all duration-300"
            style={{ color: '#000' }}
          >
            <span className="text-xs xs:text-sm sm:text-base">EXPLORE PROJECTS</span>
            <ArrowRight className="ml-2 xs:ml-3 w-4 h-4 xs:w-5 xs:h-5 animate-pulse" />
          </Link>

          <button
            onClick={scrollToAbout}
            className="btn-neon flex items-center justify-center rounded-none h-12 xs:h-14 sm:h-16 px-6 xs:px-8 sm:px-10 bg-transparent text-primary button-text border-2 border-primary hover:bg-primary hover:text-black hover-neon-glow clickable transition-all duration-300"
          >
            <span className="text-xs xs:text-sm sm:text-base">LEARN MORE</span>
            <User className="ml-2 xs:ml-3 w-4 h-4 xs:w-5 xs:h-5 animate-pulse" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;

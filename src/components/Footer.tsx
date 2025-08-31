import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="py-6 sm:py-8 px-4 sm:px-6 lg:px-10 bg-black/50 border-t border-white/10 safe-area-inset-bottom">
      <div className="container mx-auto text-center max-w-7xl">
        <p className="text-caption text-secondary-color">
          <span className="hidden sm:inline">© 2024 SAMARTH-CODES. CRAFTING TOMORROW'S DIGITAL LANDSCAPES.</span>
          <span className="sm:hidden">© 2024 SAMARTH-CODES</span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;

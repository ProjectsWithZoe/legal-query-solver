
import React from 'react';
import { Scale } from 'lucide-react';

const Header = () => {
  return (
    <header className="border-b border-law-light-gray bg-white shadow-sm">
      <div className="container mx-auto py-4 px-4 md:px-6 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Scale className="h-8 w-8 text-law-navy" />
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-law-navy">LegalQuery</h1>
            <p className="text-xs text-law-gray">Contract Analysis Solutions</p>
          </div>
        </div>
        <nav className="hidden md:block">
          <ul className="flex space-x-6">
            <li><a href="#" className="text-law-blue hover:text-law-navy transition-colors">Home</a></li>
            <li><a href="#" className="text-law-blue hover:text-law-navy transition-colors">Services</a></li>
            <li><a href="#" className="text-law-blue hover:text-law-navy transition-colors">About</a></li>
            <li><a href="#" className="text-law-blue hover:text-law-navy transition-colors">Contact</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;

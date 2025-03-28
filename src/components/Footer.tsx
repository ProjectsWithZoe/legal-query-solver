
import React from 'react';
import { Scale } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-law-navy text-white mt-12 py-6">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <Scale className="h-6 w-6 mr-2" />
            <span className="font-semibold">LegalQuery</span>
          </div>
          
          <div className="text-sm text-gray-300">
            &copy; {new Date().getFullYear()} LegalQuery Contract Analysis. All rights reserved.
          </div>
          
          <div className="mt-4 md:mt-0">
            <ul className="flex space-x-4 text-sm">
              <li><a href="#" className="hover:text-law-gold transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-law-gold transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-law-gold transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import taginLogo from '../assets/tagin-logo-black.svg';

const Navbar = () => {
  return (
    <nav className="absolute top-0 left-0 right-0 z-50 bg-transparent">
      <div className="max-w-6xl mx-auto flex items-center justify-between h-16 py-12 px-12i">
        {/* Logo on the left */}
        <div className="flex items-center gap-2">
          <img 
            src={taginLogo} 
            alt="TagIn Logo" 
            className="h-10 w-auto"
          />
          <span className="text-2xl font-extrabold tracking-wide text-black">
            TAGIN
          </span>
        </div>

        {/* Buttons on the right */}
        <div className="flex items-center gap-4">
          <Link to="/manufacturer-login">
          <Button
            variant="outline"
            className="bg-white hover:bg-gray-50 text-black px-6 py-6 rounded-2xl border-gray-200 transition-all"
          >
            Manufacturer
          </Button>
          </Link>
          <Link to="/verify">
            <Button className="bg-black hover:bg-gray-900 text-white px-6 py-6 rounded-2xl shadow-xl transition-all">
              Verify Product
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

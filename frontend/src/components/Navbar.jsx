import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Search } from 'lucide-react';
import taginLogo from '../assets/logo-main-white.svg';

const Navbar = () => {
  const navigate = useNavigate();
  const [showVerify, setShowVerify] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // ModelsSection is h-screen; show Verify button after scrolling ~80% past it
      setShowVerify(window.scrollY > window.innerHeight * 0.8);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className="fixed z-[9999] max-w-full top-0 left-0 right-0 bg-black pointer-events-auto">
      <div className="max-w-full mx-14 flex items-center justify-between h-20 px-12">
        {/* Left Side: Logo + Nav Links */}
        <div className="flex items-center gap-12">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <img
              src={taginLogo}
              alt="TagIn Logo"
              className="h-7 w-auto transition-transform duration-300 hover:rotate-90"
            />
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/manufacturer-login" className="text-white hover:text-gray-300 transition-colors font-light">
              Manufacturer
            </Link>
            <Link to="/plans" className="text-white hover:text-gray-300 transition-colors font-light">
              Plans
            </Link>
            <Link to="/blog" className="text-white hover:text-gray-300 transition-colors font-light">
              Blog
            </Link>
            <Link to="/contact" className="text-white hover:text-gray-300 transition-colors font-light">
              Contact
            </Link>
          </div>
        </div>

        {/* Buttons on the right */}
        <div className="flex items-center gap-4">
          {/* Verify button — appears after scrolling past the model section */}
          <div
            style={{
              opacity: showVerify ? 1 : 0,
              transform: showVerify ? 'translateX(0)' : 'translateX(20px)',
              transition: 'opacity 0.4s ease, transform 0.4s ease',
              pointerEvents: showVerify ? 'auto' : 'none',
            }}
          >
            <Button
              onClick={() => navigate('/verify')}
              className="group px-6 py-5 bg-[#5282E1] hover:bg-[#3d68bc] text-white rounded-full font-medium transition-colors text-lg cursor-pointer relative z-50"
            >
              Verify
              <Search className="!w-5 !h-5 transition-transform duration-300 group-hover:scale-110" />
            </Button>
          </div>
          <Button 
            onClick={() => navigate('/user-login')}
            withArrow 
            className="group bg-white hover:bg-gray-50 text-black px-6 py-5 rounded-3xl shadow-xl transition-all"
          >
            Get Started
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

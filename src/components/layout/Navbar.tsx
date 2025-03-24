import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { UserButton } from '@clerk/clerk-react';
import { useIsMobile } from '../../hooks/use-mobile';
import { Button } from '../ui/button';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import { Menu } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const isMobile = useIsMobile();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Rooms', path: '/rooms' },
    { name: 'My Bookings', path: '/bookings' },
    { name: 'Profile', path: '/profile' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-stone-900/90 backdrop-blur-sm shadow-md'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center h-16">
          <NavLink to="/" className="text-2xl font-bold tracking-wider text-white">
            The Rustic Ridge
          </NavLink>

          {isMobile ? (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white">
                  <Menu />
                </Button>
              </SheetTrigger>
              <SheetContent side="top" className="bg-stone-900/90 py-4 px-6">
                <nav className="flex flex-col space-y-6 mt-10">
                  {navLinks.map((link) => (
                    <NavLink
                      key={link.path}
                      to={link.path}
                      className={({ isActive }) => 
                        `text-lg transition-colors py-2 border-b border-stone-800 ${
                          isActive 
                            ? 'font-bold text-amber-500' 
                            : 'text-white hover:text-amber-500'
                        }`
                      }
                    >
                      {link.name}
                    </NavLink>
                  ))}
                  <div className="pt-6 border-t border-stone-700">
                    <UserButton />
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          ) : (
            <div className="flex items-center space-x-8">
              <nav className="flex space-x-8 mr-4">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    className={({ isActive }) =>
                      `relative font-medium text-white hover:text-amber-500 transition-colors ${
                        isActive ? 'text-amber-500' : ''
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {link.name}
                        {isActive && (
                          <motion.div
                            layoutId="navbar-indicator"
                            className="absolute -bottom-1 left-0 right-0 h-0.5 bg-amber-500"
                            transition={{ type: 'spring', duration: 0.6 }}
                          />
                        )}
                      </>
                    )}
                  </NavLink>
                ))}
              </nav>
              <UserButton />
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
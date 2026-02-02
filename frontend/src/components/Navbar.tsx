'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Code2, Github, Linkedin, Mail, LogOut } from 'lucide-react';
import { isAdminAuthenticated, clearAdminCredentials } from '@/services/api';

const navItems = [
  { name: 'Home', href: '/' },
  { name: 'Projects', href: '/projects' },
  { name: 'Experience', href: '/experience' },
  { name: 'Resume', href: '/resume' },
  { name: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setIsAdmin(isAdminAuthenticated());
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    clearAdminCredentials();
    setIsAdmin(false);
    window.location.href = '/';
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/90 backdrop-blur-lg shadow-lg'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-xl flex items-center justify-center">
                <Code2 className="w-6 h-6 text-white" />
              </div>
              <span className={`text-xl font-bold ${isScrolled ? 'text-gray-900' : 'text-white'}`}>
                Portfolio
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    isScrolled
                      ? 'text-gray-700 hover:text-primary-600 hover:bg-primary-50'
                      : 'text-white/90 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              {isAdmin && (
                <>
                  <Link
                    href="/admin"
                    className={`ml-4 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      isScrolled
                        ? 'bg-primary-600 text-white hover:bg-primary-700'
                        : 'bg-white text-primary-600 hover:bg-white/90'
                    }`}
                  >
                    Admin
                  </Link>
                  <button
                    onClick={handleLogout}
                    className={`ml-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      isScrolled
                        ? 'text-gray-700 hover:text-red-600 hover:bg-red-50'
                        : 'text-white/90 hover:text-white hover:bg-white/10'
                    }`}
                    title="Logout"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Social Links (Desktop) */}
            <div className="hidden md:flex items-center space-x-2">
              <a
                href="#"
                className={`p-2 rounded-lg transition-all duration-200 ${
                  isScrolled
                    ? 'text-gray-600 hover:text-primary-600 hover:bg-primary-50'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="#"
                className={`p-2 rounded-lg transition-all duration-200 ${
                  isScrolled
                    ? 'text-gray-600 hover:text-primary-600 hover:bg-primary-50'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="/contact"
                className={`p-2 rounded-lg transition-all duration-200 ${
                  isScrolled
                    ? 'text-gray-600 hover:text-primary-600 hover:bg-primary-50'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className={`md:hidden p-2 rounded-lg transition-all duration-200 ${
                isScrolled
                  ? 'text-gray-700 hover:bg-gray-100'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 md:hidden"
          >
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 bottom-0 w-80 bg-white shadow-xl"
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-4 border-b">
                  <span className="text-xl font-bold">Menu</span>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                  {navItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 font-medium"
                    >
                      {item.name}
                    </Link>
                  ))}
                  {isAdmin ? (
                    <>
                      <Link
                        href="/admin"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block px-4 py-3 rounded-lg bg-primary-600 text-white font-medium text-center mt-4"
                      >
                        Admin Dashboard
                      </Link>
                      <button
                        onClick={() => {
                          handleLogout();
                          setMobileMenuOpen(false);
                        }}
                        className="block w-full px-4 py-3 rounded-lg bg-red-100 text-red-600 font-medium text-center mt-2"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <Link
                      href="/admin/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-4 py-3 rounded-lg bg-gray-100 text-gray-700 font-medium text-center mt-4"
                    >
                      Admin Login
                    </Link>
                  )}
                </nav>
                <div className="p-4 border-t">
                  <div className="flex justify-center space-x-4">
                    <a href="#" className="p-2 text-gray-600 hover:text-primary-600">
                      <Github className="w-5 h-5" />
                    </a>
                    <a href="#" className="p-2 text-gray-600 hover:text-primary-600">
                      <Linkedin className="w-5 h-5" />
                    </a>
                    <a href="/contact" className="p-2 text-gray-600 hover:text-primary-600">
                      <Mail className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

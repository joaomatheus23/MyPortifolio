'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

interface NavbarProps {
  isDarkMode: boolean;
}

export default function Navbar({ isDarkMode: _isDarkMode }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const [isI18nReady, setIsI18nReady] = useState(false);

  // Wait for i18n to be ready
  useEffect(() => {
    if (i18n.isInitialized) {
      setIsI18nReady(true);
    } else {
      const checkReady = () => {
        if (i18n.isInitialized) {
          setIsI18nReady(true);
        } else {
          setTimeout(checkReady, 100);
        }
      };
      checkReady();
    }
  }, [i18n.isInitialized]);

  const navItems = [
    { name: isI18nReady ? t('nav.home') : 'Home', href: '#home' },
    { name: isI18nReady ? t('nav.about') : 'About', href: '#about' },
    { name: isI18nReady ? t('nav.education') : 'Education', href: '#education' },
    { name: isI18nReady ? t('nav.portfolio') : 'Portfolio', href: '#projects' },
    { name: isI18nReady ? t('nav.skills') : 'Skills', href: '#skills' },
    { name: isI18nReady ? t('nav.contact') : 'Contact', href: '#contact' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href === '#home' ? 'body' : href);
    element?.scrollIntoView({ behavior: 'smooth' });
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-dark/90 backdrop-blur-lg border-b border-white/10' 
            : 'bg-transparent'
        }`}
      >
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center"
            >
              <h1 
                className="text-2xl md:text-3xl font-black tracking-tight cursor-pointer"
                style={{ fontFamily: 'var(--font-orbitron)' }}
                onClick={() => scrollToSection('#home')}
              >
                <span className="text-white">J</span>
                <span className="text-primary text-glow-cyan">0</span>
                <span className="text-white">ão</span>
                <span className="text-primary text-sm ml-1">{};</span>
              </h1>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item, index) => (
                <motion.button
                  key={item.name}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  onClick={() => scrollToSection(item.href)}
                  className="text-gray-300 hover:text-primary transition-colors duration-300 font-medium relative group"
                >
                  {item.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                </motion.button>
              ))}
            </div>

            {/* Language switcher and mobile menu */}
            <div className="flex items-center space-x-4">
              {/* Language Switcher */}
              <LanguageSwitcher />
              
              {/* Mobile menu button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-lg glass border border-white/10 hover:border-primary/30 transition-all duration-300"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6 text-white" />
                ) : (
                  <Menu className="w-6 h-6 text-white" />
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <motion.div
        initial={{ opacity: 0, x: '100%' }}
        animate={{ 
          opacity: isMobileMenuOpen ? 1 : 0,
          x: isMobileMenuOpen ? '0%' : '100%'
        }}
        transition={{ duration: 0.3 }}
        className={`fixed top-0 right-0 h-full w-80 bg-dark/95 backdrop-blur-lg border-l border-white/10 z-40 md:hidden ${
          isMobileMenuOpen ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
      >
        <div className="flex flex-col pt-24 px-6">
          {navItems.map((item, index) => (
            <motion.button
              key={item.name}
              initial={{ opacity: 0, x: 50 }}
              animate={{ 
                opacity: isMobileMenuOpen ? 1 : 0,
                x: isMobileMenuOpen ? 0 : 50
              }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              onClick={() => scrollToSection(item.href)}
              className="text-left py-4 text-lg font-semibold text-gray-300 hover:text-primary transition-colors duration-300 border-b border-white/10 last:border-b-0"
            >
              {item.name}
            </motion.button>
          ))}

          {/* Mobile social links */}
          <div className="mt-8 pt-8 border-t border-white/10">
            <h3 className="text-sm font-semibold text-gray-400 mb-4 uppercase tracking-wider">
              Conecte-se
            </h3>
            <div className="space-y-3">
              <a
                href="https://github.com/joaomatheus"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-gray-300 hover:text-primary transition-colors duration-300"
              >
                GitHub
              </a>
              <a
                href="https://linkedin.com/in/joaomatheus"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-gray-300 hover:text-primary transition-colors duration-300"
              >
                LinkedIn
              </a>
              <a
                href="mailto:joaomatheus@email.com"
                className="block text-gray-300 hover:text-primary transition-colors duration-300"
              >
                Email
              </a>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
        />
      )}
    </>
  );
}
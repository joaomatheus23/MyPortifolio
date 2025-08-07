'use client';

import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

// Hook customizado para animação de typewriter com reset
const useTypewriter = (text: string, delay: number = 0, speed: number = 100, resetTrigger: boolean = false) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // Reset quando o trigger mudar
    setDisplayedText('');
    setIsTyping(false);
    setIsComplete(false);

    if (!resetTrigger) return; // Só anima quando visível

    const timer = setTimeout(() => {
      setIsTyping(true);
      let currentIndex = 0;
      
      const typeInterval = setInterval(() => {
        if (currentIndex <= text.length) {
          setDisplayedText(text.slice(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(typeInterval);
          setIsTyping(false);
          setIsComplete(true);
        }
      }, speed);

      return () => clearInterval(typeInterval);
    }, delay);

    return () => clearTimeout(timer);
  }, [text, delay, speed, resetTrigger]);

  return { displayedText, isTyping, isComplete };
};

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(true); // Inicia como true para primeira carga
  const [animationKey, setAnimationKey] = useState(0);
  const { t } = useTranslation();

  // Intersection Observer para detectar quando a seção está visível
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
          setAnimationKey(prev => prev + 1); // Força re-render das animações
        } else if (!entry.isIntersecting && isVisible) {
          setIsVisible(false);
        }
      },
      { threshold: 0.3 } // Trigger quando 30% da seção estiver visível
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  // Textos para animação de typewriter com velocidades mais rápidas
  const greeting = useTypewriter(t('hero.greeting'), 400, 80, isVisible);
  const name = useTypewriter(t('hero.name'), 1200, 120, isVisible);
  const fullName = useTypewriter(t('hero.fullName'), 2200, 100, isVisible);
  const tagline = useTypewriter(t('hero.tagline'), 3500, 60, isVisible);

  const scrollToAbout = () => {
    const aboutSection = document.getElementById('about');
    aboutSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section 
      ref={sectionRef}
      className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-darker via-dark to-darker"
    >
      {/* Background Effects */}
      <div className="absolute inset-0">
        {/* Floating particles */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary rounded-full animate-float opacity-60"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-secondary rounded-full animate-float opacity-40" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-accent rounded-full animate-float opacity-50" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-2/3 right-1/4 w-1 h-1 bg-primary rounded-full animate-float opacity-30" style={{animationDelay: '0.5s'}}></div>
        
        {/* Gradient blobs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-glow"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-pulse-glow" style={{animationDelay: '1s'}}></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Text content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            {/* Developer greeting */}
            <div className="mb-6 h-7 flex items-center">
              <span className="text-primary font-mono text-lg">
                {greeting.displayedText}
                {greeting.isTyping && (
                  <span className="inline-block w-0.5 h-5 bg-primary ml-1 animate-pulse"></span>
                )}
              </span>
            </div>

            {/* Main title */}
            <div className="text-5xl md:text-7xl font-black mb-6 tracking-tight h-20 md:h-24 flex items-center">
              <h1 
                className="font-black tracking-tight"
                style={{ fontFamily: 'var(--font-orbitron)' }}
              >
                {name.displayedText.split('').map((char, index) => (
                  <span
                    key={index}
                    className={
                      char === '0' 
                        ? "text-primary text-glow-cyan" 
                        : "text-white"
                    }
                  >
                    {char}
                  </span>
                ))}
                {name.isTyping && (
                  <span className="inline-block w-1 h-12 md:h-16 bg-primary ml-1 animate-pulse"></span>
                )}
              </h1>
            </div>

            {/* Full name */}
            <div className="text-2xl md:text-3xl font-bold mb-8 text-gray-300 h-8 md:h-10 flex items-center">
              <h2 
                className="font-bold"
                style={{ fontFamily: 'var(--font-orbitron)' }}
              >
                {fullName.displayedText}
                {fullName.isTyping && (
                  <span className="inline-block w-0.5 h-6 md:h-8 bg-gray-300 ml-1 animate-pulse"></span>
                )}
              </h2>
            </div>

            {/* Impact phrase */}
            <div className="text-xl md:text-2xl mb-12 text-gray-400 leading-relaxed max-w-2xl min-h-16 md:min-h-20">
              <p className="leading-relaxed">
                {/* Renderizar o texto com formatação especial para palavras destacadas */}
                {tagline.displayedText.split(' ').map((word, index) => {
                  let className = "text-gray-400";
                  
                  if (word.includes('ideias')) {
                    className = "text-primary font-semibold";
                  } else if (word.includes('experiências')) {
                    className = "text-secondary font-semibold";
                  }
                  
                  return (
                    <span key={index} className={className}>
                      {word}{' '}
                    </span>
                  );
                })}
                {tagline.isTyping && (
                  <span className="inline-block w-0.5 h-5 md:h-6 bg-gray-400 ml-1 animate-pulse"></span>
                )}
              </p>
            </div>

            {/* CTA Buttons */}
            <motion.div
              key={`buttons-${animationKey}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 6.5, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start"
            >
              <button
                onClick={scrollToAbout}
                className="group relative px-8 py-4 bg-gradient-to-r from-primary via-secondary to-accent rounded-lg font-semibold text-dark hover:scale-105 transition-all duration-300 animate-gradient"
              >
                <span className="relative z-10">{t('hero.aboutBtn')}</span>
              </button>

              <a
                href="#projects"
                className="group relative px-8 py-4 glass rounded-lg font-semibold text-white hover:glow-cyan transition-all duration-300 border border-primary/30 hover:border-primary/60"
              >
                {t('hero.projectsBtn')}
              </a>
            </motion.div>
          </motion.div>

          {/* Right side - Profile image */}
          <motion.div
            key={`image-${animationKey}`}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="relative flex justify-center lg:justify-end"
          >
            <div className="relative">
              {/* Glowing border effect */}
              <div className="absolute -inset-4 bg-gradient-to-r from-primary via-secondary to-accent rounded-full opacity-20 blur-lg animate-pulse-glow"></div>
              
              {/* Profile image container */}
              <div className="relative w-80 h-80 md:w-96 md:h-96 rounded-full overflow-hidden glass border-2 border-primary/30">
                <Image
                  src="/profile.jpg"
                  alt="João Matheus - Desenvolvedor Full Stack"
                  fill
                  className="object-cover"
                  priority
                />
                
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-secondary/20"></div>
              </div>

              {/* Floating tech icons */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -top-8 -right-8 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center glass"
              >
                <span className="text-primary font-mono font-bold">React</span>
              </motion.div>

              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute -bottom-8 -left-8 w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center glass"
              >
                <span className="text-secondary font-mono font-bold">Next</span>
              </motion.div>

              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className="absolute top-1/2 -right-12 w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center glass"
              >
                <span className="text-accent font-mono text-sm font-bold">Node</span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        key={`scroll-${animationKey}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 7.5, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <button
          onClick={scrollToAbout}
          className="flex flex-col items-center text-primary hover:text-white transition-colors duration-300 group"
        >
          <span className="text-sm font-mono mb-2 opacity-70 group-hover:opacity-100">
            {t('hero.scrollDown')}
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ChevronDown className="w-6 h-6" />
          </motion.div>
        </button>
      </motion.div>
    </section>
  );
}
'use client';

import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import Image from 'next/image';
import { useState, useEffect, useMemo, useRef } from 'react';
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

type ScriptLine = { prompt: boolean; text: string };

function HeroTerminal({ ready }: { ready: boolean }) {
  const { t } = useTranslation();
  const lines = useMemo<ScriptLine[]>(() => [
    { prompt: true, text: ready ? t('hero.terminal.cmd1') : 'whoami' },
    { prompt: false, text: ready ? t('hero.terminal.out1') : 'João Matheus Marques' },
    { prompt: true, text: ready ? t('hero.terminal.cmd2') : 'focus --now' },
    { prompt: false, text: ready ? t('hero.terminal.out2') : 'blockchain · fintechs · ripple' },
    { prompt: true, text: ready ? t('hero.terminal.cmd3') : 'security --status' },
    { prompt: false, text: ready ? t('hero.terminal.out3') : 'ativa em cada fluxo' },
  ], [ready, t]);
  const scriptKey = lines.map((line) => line.text).join('|');
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    setLineIndex(0);
    setCharIndex(0);
  }, [scriptKey]);

  useEffect(() => {
    if (lineIndex >= lines.length) return;
    const current = lines[lineIndex].text;
    if (charIndex < current.length) {
      const timer = setTimeout(() => setCharIndex((index) => index + 1), lines[lineIndex].prompt ? 48 : 22);
      return () => clearTimeout(timer);
    }
    const timer = setTimeout(() => {
      setLineIndex((index) => index + 1);
      setCharIndex(0);
    }, 320);
    return () => clearTimeout(timer);
  }, [lineIndex, charIndex, lines]);

  const finished = lineIndex >= lines.length;

  return (
    <div className="relative z-20 mx-auto mt-2 w-[min(100%,30rem)] overflow-hidden rounded-xl border border-primary/40 bg-[#070b12]/92 text-left shadow-[0_0_48px_rgba(0,212,255,0.22)] backdrop-blur-md lg:absolute lg:bottom-4 lg:left-0 lg:mx-0 lg:w-[32rem] lg:-translate-x-6">
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-red-400/90"></span>
        <span className="h-2.5 w-2.5 rounded-full bg-yellow-300/90"></span>
        <span className="h-2.5 w-2.5 rounded-full bg-accent"></span>
        <span className="ml-2 font-mono text-xs text-gray-400">
          {ready ? t('hero.terminalTitle') : 'joao@web3 — zsh'}
        </span>
      </div>
      <div className="min-h-[11.5rem] space-y-1.5 px-4 py-4 font-mono text-sm leading-relaxed">
        {lines.slice(0, finished ? lines.length : lineIndex + 1).map((line, index) => {
          const shown = index < lineIndex ? line.text : line.text.slice(0, charIndex);
          return (
            <p key={`${line.text}-${index}`}>
              {line.prompt ? (
                <>
                  <span className="text-accent">~/ledger</span>
                  <span className="text-gray-500"> $ </span>
                  <span className="text-primary">{shown}</span>
                </>
              ) : (
                <span className="text-gray-200">{shown}</span>
              )}
              {!finished && index === lineIndex && (
                <span className="ml-0.5 inline-block h-4 w-1.5 translate-y-0.5 bg-primary animate-pulse"></span>
              )}
            </p>
          );
        })}
        {finished && (
          <p>
            <span className="text-accent">~/ledger</span>
            <span className="text-gray-500"> $ </span>
            <span className="inline-block h-4 w-1.5 translate-y-0.5 bg-primary animate-pulse"></span>
          </p>
        )}
      </div>
    </div>
  );
}

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(true); // Inicia como true para primeira carga
  const [animationKey, setAnimationKey] = useState(0);
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
  const greeting = useTypewriter(isI18nReady ? t('hero.greeting') : "Hello World, I'm", 400, 80, isVisible);
  const name = useTypewriter(isI18nReady ? t('hero.name') : "João", 1200, 120, isVisible);
  const fullName = useTypewriter(isI18nReady ? t('hero.fullName') : "Matheus Marques", 2200, 100, isVisible);
  const tagline = useTypewriter(isI18nReady ? t('hero.tagline') : "Transformando ideias em código e experiências em soluções", 3500, 60, isVisible);

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
        <div className="grid lg:grid-cols-12 gap-10 items-center">
          {/* Left side - Text content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left lg:col-span-5"
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
                  
                  const normalized = word.toLowerCase().replace(/[.,]/g, '');
                  if (normalized.includes('blockchain') || normalized.includes('fintech')) {
                    className = "text-primary font-semibold";
                  } else if (normalized.includes('ripple') || normalized.includes('cibersegurança') || normalized.includes('cybersecurity') || normalized.includes('segurança') || normalized.includes('security')) {
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
                <span className="relative z-10">{isI18nReady ? t('hero.aboutBtn') : "Sobre Mim"}</span>
              </button>

              <a
                href="#projects"
                className="group relative px-8 py-4 glass rounded-lg font-semibold text-white hover:glow-cyan transition-all duration-300 border border-primary/30 hover:border-primary/60"
              >
                {isI18nReady ? t('hero.projectsBtn') : "Ver Projetos"}
              </a>
            </motion.div>
          </motion.div>

          {/* Right side - Profile image */}
          <motion.div
            key={`image-${animationKey}`}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="relative flex justify-center lg:col-span-7 lg:justify-end"
          >
            <div className="relative">
              <div className="pointer-events-none absolute inset-x-8 bottom-10 top-16 bg-primary/20 blur-3xl"></div>
              <Image
                src="/profile.png"
                alt="João Matheus Marques - desenvolvedor Web3"
                width={1024}
                height={1024}
                priority
                className="relative h-auto w-[min(100%,34rem)] object-contain lg:h-[min(78vh,740px)] lg:w-auto lg:max-w-none"
              />
              <HeroTerminal ready={isI18nReady} />
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
            {isI18nReady ? t('hero.scrollDown') : "scroll down"}
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
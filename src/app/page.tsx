'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import AboutMe from '@/components/AboutMe';
import Projects from '@/components/Projects';
import Skills from '@/components/Skills';
import ContactForm from '@/components/ContactForm';
import Footer from '@/components/Footer';
import ClientI18nProvider from '@/components/ClientI18nProvider';

export default function Home() {
  const [isDarkMode, setIsDarkMode] = useState(true);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    // Aqui você pode implementar a lógica para alternar entre modo escuro e neon glow
    document.documentElement.classList.toggle('neon-mode');
  };

  return (
    <ClientI18nProvider>
      <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
        <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
        
        <main>
          <section id="home">
            <HeroSection />
          </section>
          
          <AboutMe />
          <Projects />
          <Skills />
          <ContactForm />
        </main>
        
        <Footer />
      </div>
    </ClientI18nProvider>
  );
}

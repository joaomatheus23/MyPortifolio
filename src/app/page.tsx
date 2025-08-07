'use client';

import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import AboutMe from '@/components/AboutMe';
import Education from '@/components/Education';
import Projects from '@/components/Projects';
import Skills from '@/components/Skills';
import ContactForm from '@/components/ContactForm';
import Footer from '@/components/Footer';
import ClientI18nProvider from '@/components/ClientI18nProvider';

export default function Home() {
  return (
    <ClientI18nProvider>
      <div className="min-h-screen dark">
        <Navbar isDarkMode={true} />
        
        <main>
          <section id="home">
            <HeroSection />
          </section>
          
          <AboutMe />
          <Education />
          <Projects />
          <Skills />
          <ContactForm />
        </main>
        
        <Footer />
      </div>
    </ClientI18nProvider>
  );
}

'use client';

import dynamic from 'next/dynamic';
import HeroSection from '@/components/HeroSection';
import AboutMe from '@/components/AboutMe';
import Experience from '@/components/Experience';
import CyberLab from '@/components/CyberLab';
import CanadaSection from '@/components/CanadaSection';
import Education from '@/components/Education';
import Projects from '@/components/Projects';
import Skills from '@/components/Skills';
import ContactForm from '@/components/ContactForm';
import Footer from '@/components/Footer';
import ClientI18nProvider from '@/components/ClientI18nProvider';
import GuideBot from '@/components/GuideBot';
import ChainProgress from '@/components/ChainProgress';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import BreachGame from '@/components/BreachGame';

const LedgerBackground = dynamic(() => import('@/components/three/LedgerBackground'), { ssr: false });

export default function Home() {
  return (
    <ClientI18nProvider>
      <div className="min-h-screen dark">
        <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
          <span className="ambient-blob left-[-10%] top-[10%] h-[45vw] w-[45vw] bg-primary/25"></span>
          <span className="ambient-blob right-[-12%] top-[35%] h-[40vw] w-[40vw] bg-accent/15 [animation-delay:-9s]"></span>
          <span className="ambient-blob bottom-[-15%] left-[30%] h-[38vw] w-[38vw] bg-secondary/20 [animation-delay:-18s]"></span>
        </div>
        <LedgerBackground />
        <div className="fixed right-4 top-4 z-50 sm:right-6 sm:top-5">
          <LanguageSwitcher />
        </div>
        <ChainProgress />
        <GuideBot />

        <main className="relative z-10">
          <section id="home">
            <HeroSection />
          </section>

          <AboutMe />
          <BreachGame />
          <Experience />
          <CyberLab />
          <CanadaSection />
          <Education />
          <Projects />
          <Skills />
          <ContactForm />
        </main>

        <div className="relative z-10">
          <Footer />
        </div>
      </div>
    </ClientI18nProvider>
  );
}

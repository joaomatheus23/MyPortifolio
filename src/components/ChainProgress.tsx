'use client';

import { useTranslation } from 'react-i18next';
import { sectionUnlocked, useIntro } from '@/lib/introStore';
import { SECTION_IDS, useActiveSection } from '@/lib/useActiveSection';

const LABEL_KEYS: Record<string, string> = {
  home: 'nav.home',
  about: 'nav.about',
  experience: 'nav.experience',
  cyber: 'nav.cyber',
  canada: 'nav.canada',
  education: 'nav.education',
  projects: 'nav.portfolio',
  game: 'nav.game',
  skills: 'nav.skills',
  contact: 'nav.contact',
};

// Barra lateral em forma de corrente: cada seção é um bloco, o atual brilha
export default function ChainProgress() {
  const { t } = useTranslation();
  const active = useActiveSection();
  const activeIndex = SECTION_IDS.indexOf(active);
  const progress = useIntro((s) => s.progress);
  const unlocked = useIntro((s) => s.unlocked);

  const go = (id: string) => {
    if (!unlocked) return;
    const target = id === 'home' ? document.body : document.getElementById(id);
    target?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav aria-label={t('chain.label')} className="fixed left-5 top-1/2 z-30 hidden -translate-y-1/2 xl:block">
      <ol className="relative flex flex-col gap-4">
        <span className="absolute left-[5px] top-1 bottom-1 w-px bg-white/10" aria-hidden="true"></span>
        <span
          className="absolute left-[5px] top-1 w-px bg-gradient-to-b from-primary to-accent transition-all duration-500"
          style={{ height: `calc(${(activeIndex / (SECTION_IDS.length - 1)) * 100}% - 0.25rem)` }}
          aria-hidden="true"
        ></span>
        {SECTION_IDS.map((id, index) => {
          const on = id === active;
          const done = index < activeIndex;
          const open = sectionUnlocked(index, SECTION_IDS.length, progress, unlocked);
          return (
            <li key={id} className="relative">
              <button
                type="button"
                onClick={() => go(id)}
                aria-current={on ? 'true' : undefined}
                className="group flex items-center gap-3"
              >
                <span
                  className={`block h-[11px] w-[11px] rotate-45 border transition-all duration-300 ${
                    !open
                      ? 'border-red-400/70 bg-red-500/10'
                      : !unlocked
                      ? 'border-accent bg-accent/40 shadow-[0_0_10px_rgba(255,59,71,0.7)]'
                      : on
                      ? 'scale-125 border-primary bg-primary shadow-[0_0_12px_rgba(139,92,246,0.9)]'
                      : done
                      ? 'border-primary/60 bg-primary/30'
                      : 'border-white/25 bg-dark group-hover:border-primary/60'
                  }`}
                ></span>
                <span
                  className={`whitespace-nowrap rounded border border-white/10 bg-[#0c0c0f]/90 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.2em] transition-all duration-300 ${
                    on ? 'text-primary' : 'text-gray-400'
                  } pointer-events-none -translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100`}
                >
                  #{String(index).padStart(2, '0')} {t(LABEL_KEYS[id])}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

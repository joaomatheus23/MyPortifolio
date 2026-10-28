'use client';

import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { useTranslation } from 'react-i18next';
import { Blocks } from 'lucide-react';
import { FaNodeJs, FaReact } from 'react-icons/fa';
import {
  SiEthereum,
  SiJavascript,
  SiMongodb,
  SiNextdotjs,
  SiRipple,
  SiSolidity,
  SiTypescript,
  SiXrp,
} from 'react-icons/si';

const NetworkCanvas = dynamic(() => import('./three/NetworkScene'), { ssr: false });

function MetaMaskIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <path fill="#E2761B" d="M27.2 4.8 17.8 11.8l1.8-4.2 7.6-2.8z" />
      <path fill="#E4761B" d="M4.8 4.8 14 12 12.3 7.6 4.8 4.8z" />
      <path fill="#F6851B" d="M23.4 21.8 20.8 26l5.2 1.5 1.5-5.2-4.1-.5z" />
      <path fill="#F6851B" d="M4.5 22.3 6 27.5 11.2 26l-2.6-4.2-4.1.5z" />
      <path fill="#C0AD9E" d="M11.2 26 14 24.2l-2.5-2.1-.3 3.9z" />
      <path fill="#C0AD9E" d="M18 24.2 20.8 26l.3-3.9L18 24.2z" />
      <path fill="#E2761B" d="M14.2 20.8 11.4 19.4l2-.9h5.2l2 .9-2.8 1.4-1.8 1.6-1.8-1.6z" />
      <path fill="#763D16" d="M14.6 18.4h1.1l.5 1.5.5-1.5h1.1l-1.1 2.6h-1L14.6 18.4z" />
      <path fill="#233447" d="M10.6 14.2 9 16.8l5.2.2-.2-5.4-3.4 2.6z" />
      <path fill="#233447" d="M21.4 14.2 18 11.5l-.2 5.5 5.2-.2-1.6-2.6z" />
    </svg>
  );
}

type SkillItem = {
  name: string;
  layer: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  hex: string;
};

export default function Skills() {
  const { t } = useTranslation();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const skills = useMemo<SkillItem[]>(() => [
    { name: 'JavaScript', layer: 'runtime', icon: SiJavascript, color: 'text-[#F7DF1E]', hex: '#F7DF1E' },
    { name: 'TypeScript', layer: 'runtime', icon: SiTypescript, color: 'text-[#3178C6]', hex: '#3178C6' },
    { name: 'React', layer: 'interface', icon: FaReact, color: 'text-[#61DAFB]', hex: '#61DAFB' },
    { name: 'Next.js', layer: 'interface', icon: SiNextdotjs, color: 'text-white', hex: '#e4e4e7' },
    { name: 'Node.js', layer: 'server', icon: FaNodeJs, color: 'text-[#5FA04E]', hex: '#5FA04E' },
    { name: 'MongoDB', layer: 'data', icon: SiMongodb, color: 'text-[#47A248]', hex: '#47A248' },
    { name: 'Blockchain', layer: 'web3', icon: Blocks, color: 'text-primary', hex: '#8b5cf6' },
    { name: 'Ripple', layer: 'web3', icon: SiRipple, color: 'text-white', hex: '#e4e4e7' },
    { name: 'XRP', layer: 'web3', icon: SiXrp, color: 'text-[#23A8E0]', hex: '#23A8E0' },
    { name: 'MetaMask', layer: 'wallet', icon: MetaMaskIcon, color: '', hex: '#E2761B' },
    { name: 'Solidity', layer: 'web3', icon: SiSolidity, color: 'text-[#AA6746]', hex: '#AA6746' },
    { name: 'Ethereum', layer: 'web3', icon: SiEthereum, color: 'text-[#8C8C8C]', hex: '#a1a1aa' },
  ], []);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => {
      setActive((index) => (index + 1) % skills.length);
    }, 2400);
    return () => clearInterval(timer);
  }, [skills.length, paused]);

  const current = skills[active];

  return (
    <section id="skills" className="screen-section overflow-hidden">
      <div className="container relative z-10 mx-auto px-4 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-4 flex flex-col gap-2 md:mb-6 md:flex-row md:items-end md:justify-between"
          >
            <h2 className="text-3xl font-bold tracking-tight text-white md:text-5xl" style={{ fontFamily: 'var(--font-display)' }}>
              {t('skills.title')} <span className="text-primary">{t('skills.titleHighlight')}</span>
            </h2>
            <p className="max-w-md text-sm text-gray-400 md:text-right">{t('skills.subtitle')}</p>
          </motion.div>

          <div className="relative overflow-hidden rounded-2xl border glass-apple-strong">
            <div className="relative flex flex-col gap-3 border-b border-white/[0.06] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="font-mono text-xs tracking-[0.28em] text-gray-500">{t('skillsNetwork.label')}</p>
              <p className="font-mono text-sm text-white">
                <span className="text-accent">{String(active + 1).padStart(2, '0')}</span>
                <span className="text-gray-600"> / {String(skills.length).padStart(2, '0')}</span>
                <span className="mx-3 text-gray-700">·</span>
                <span>{current.name}</span>
                <span className="ml-3 text-gray-500">{current.layer}</span>
                <span className="ml-1 inline-block h-4 w-1.5 translate-y-0.5 bg-accent animate-pulse"></span>
              </p>
            </div>

            <div className="grid md:grid-cols-[1.1fr_1fr]">
              <div
                data-tour="skills-0"
                className="relative border-b border-white/[0.06] md:border-b-0 md:border-r"
                onMouseEnter={() => setPaused(true)}
                onMouseLeave={() => setPaused(false)}
              >
                <NetworkCanvas
                  className="h-56 w-full sm:h-72 md:h-[min(26rem,50svh)]"
                  nodes={skills.map((skill) => ({ name: skill.name, color: skill.hex, icon: skill.icon, iconClass: skill.color }))}
                  active={active}
                  onSelect={setActive}
                />
                <p className="pointer-events-none absolute bottom-3 left-4 font-mono text-[10px] uppercase tracking-[0.22em] text-gray-600">
                  {t('skillsNetwork.hint')}
                </p>
              </div>

              <div data-tour="skills-1" className="grid grid-cols-4 content-center gap-1.5 p-3 sm:grid-cols-3 sm:gap-2 sm:p-6">
                {skills.map((skill, index) => {
                  const on = index === active;
                  return (
                    <button
                      key={skill.name}
                      type="button"
                      onClick={() => setActive(index)}
                      className={`rounded-xl border px-1 py-2.5 text-center transition-all duration-300 sm:px-2 sm:py-4 ${
                        on ? 'glass-apple border-accent/60' : 'glass-apple opacity-80 hover:opacity-100'
                      }`}
                    >
                      <skill.icon className={`mx-auto mb-1.5 h-5 w-5 sm:mb-2 sm:h-7 sm:w-7 ${skill.color}`} />
                      <span className="block truncate text-[10px] font-semibold text-white sm:text-xs">{skill.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

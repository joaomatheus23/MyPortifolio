'use client';

import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
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
};

export default function Skills() {
  const { t } = useTranslation();
  const [active, setActive] = useState(0);

  const skills = useMemo<SkillItem[]>(() => [
    { name: 'JavaScript', layer: 'runtime', icon: SiJavascript, color: 'text-[#F7DF1E]' },
    { name: 'TypeScript', layer: 'runtime', icon: SiTypescript, color: 'text-[#3178C6]' },
    { name: 'React', layer: 'interface', icon: FaReact, color: 'text-[#61DAFB]' },
    { name: 'Next.js', layer: 'interface', icon: SiNextdotjs, color: 'text-white' },
    { name: 'Node.js', layer: 'server', icon: FaNodeJs, color: 'text-[#5FA04E]' },
    { name: 'MongoDB', layer: 'data', icon: SiMongodb, color: 'text-[#47A248]' },
    { name: 'Blockchain', layer: 'web3', icon: Blocks, color: 'text-primary' },
    { name: 'Ripple', layer: 'web3', icon: SiRipple, color: 'text-white' },
    { name: 'XRP', layer: 'web3', icon: SiXrp, color: 'text-[#23A8E0]' },
    { name: 'MetaMask', layer: 'wallet', icon: MetaMaskIcon, color: '' },
    { name: 'Solidity', layer: 'web3', icon: SiSolidity, color: 'text-[#AA6746]' },
    { name: 'Ethereum', layer: 'web3', icon: SiEthereum, color: 'text-[#8C8C8C]' },
  ], []);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((index) => (index + 1) % skills.length);
    }, 1300);
    return () => clearInterval(timer);
  }, [skills.length]);

  const current = skills[active];

  return (
    <section id="skills" className="relative overflow-hidden bg-gradient-to-b from-darker via-dark to-darker py-24">
      <div className="absolute inset-0">
        <div className="absolute left-1/4 top-1/4 h-72 w-72 rounded-full bg-primary/10 blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/5 h-80 w-80 rounded-full bg-secondary/10 blur-3xl"></div>
      </div>

      <div className="container relative z-10 mx-auto px-6">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12 text-center"
          >
            <h2 className="mb-6 text-4xl font-black text-white md:text-5xl" style={{ fontFamily: 'var(--font-orbitron)' }}>
              {t('skills.title')} <span className="text-primary text-glow-cyan">{t('skills.titleHighlight')}</span>
            </h2>
            <p className="mx-auto max-w-3xl text-xl text-gray-400">{t('skills.subtitle')}</p>
            <div className="mx-auto mt-6 h-1 w-20 bg-gradient-to-r from-primary to-secondary"></div>
          </motion.div>

          <div className="relative overflow-hidden rounded-3xl border border-primary/25 bg-black/50 shadow-[0_0_80px_rgba(0,212,255,0.12)]">
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(0,212,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,212,255,0.05)_1px,transparent_1px)] bg-[size:36px_36px]"></div>
            <div className="pointer-events-none absolute inset-x-0 top-0 h-24 animate-[scan_4.2s_linear_infinite] bg-gradient-to-b from-transparent via-primary/25 to-transparent"></div>

            <div className="relative flex flex-col gap-4 border-b border-primary/20 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="font-mono text-xs tracking-[0.28em] text-primary">{t('skills.scanLabel')}</p>
              <p className="font-mono text-sm text-white">
                <span className="text-primary">{String(active + 1).padStart(2, '0')}</span>
                <span className="text-gray-500"> / {String(skills.length).padStart(2, '0')}</span>
                <span className="mx-3 text-gray-600">·</span>
                <span>{current.name}</span>
                <span className="ml-3 text-gray-500">{current.layer}</span>
                <span className="ml-1 inline-block h-4 w-1.5 translate-y-0.5 bg-primary animate-pulse"></span>
              </p>
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-accent">{t('skills.scanStatus')}</p>
            </div>

            <div className="relative grid grid-cols-2 gap-3 p-4 sm:grid-cols-3 lg:grid-cols-6 sm:p-6">
              {skills.map((skill, index) => {
                const on = index === active;
                return (
                  <button
                    key={skill.name}
                    type="button"
                    onClick={() => setActive(index)}
                    className={`relative overflow-hidden rounded-2xl border px-3 py-5 text-center transition-all duration-500 ${
                      on
                        ? 'scale-[1.04] border-primary bg-primary/10 shadow-[0_0_32px_rgba(0,212,255,0.28)]'
                        : 'border-white/10 bg-white/[0.03] hover:border-primary/40'
                    }`}
                  >
                    {on && (
                      <span className="pointer-events-none absolute inset-x-0 top-0 h-full animate-[scan_1.4s_linear_infinite] bg-gradient-to-b from-transparent via-primary/20 to-transparent"></span>
                    )}
                    <skill.icon className={`relative mx-auto mb-3 h-10 w-10 ${skill.color}`} />
                    <span className="relative block text-sm font-semibold text-white">{skill.name}</span>
                    <span className="relative mt-1 block font-mono text-[10px] uppercase tracking-[0.18em] text-gray-500">{skill.layer}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes scan {
          0% { transform: translateY(-120%); }
          100% { transform: translateY(220%); }
        }
      `}</style>
    </section>
  );
}

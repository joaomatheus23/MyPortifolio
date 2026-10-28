'use client';

import { AnimatePresence, motion, useInView } from 'framer-motion';
import { ChevronLeft, ChevronRight, ExternalLink, Eye, Github, Lock, LockOpen } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { fakeHash } from '@/lib/fakeHash';

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  githubUrl: string;
  liveUrl: string;
  category: 'Frontend' | 'Backend' | 'SaaS' | 'Automation' | 'Fullstack' | 'Backend and Automation';
}

type VaultPhase = 'locked' | 'unlocking' | 'open';

// Porta do cofre: metade de um bloco que gira na dobradiça para revelar o projeto
function VaultDoor({ side, phase, hash }: { side: 'left' | 'right'; phase: VaultPhase; hash: string }) {
  const isLeft = side === 'left';
  return (
    <motion.div
      initial={false}
      animate={{ rotateY: phase === 'open' ? (isLeft ? -108 : 108) : 0, opacity: phase === 'open' ? 0.25 : 1 }}
      transition={{ duration: phase === 'open' ? 0.9 : 0.35, ease: [0.65, 0, 0.35, 1] }}
      style={{ transformOrigin: isLeft ? 'left center' : 'right center', backfaceVisibility: 'hidden' }}
      className={`absolute inset-y-0 ${isLeft ? 'left-0' : 'right-0'} z-10 w-1/2 overflow-hidden border-white/10 bg-[linear-gradient(135deg,#17171c,#0b0b0e)] ${
        isLeft ? 'border-r' : 'border-l'
      }`}
    >
      <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.1)_1px,transparent_1px)] bg-[size:22px_22px]"></div>
      <div className={`absolute inset-y-0 ${isLeft ? 'right-0' : 'left-0'} w-px bg-gradient-to-b from-transparent via-primary to-transparent`}></div>
      {[0, 1].map((row) => (
        <span key={row} className={`absolute ${row ? 'bottom-3' : 'top-3'} ${isLeft ? 'left-3' : 'right-3'} h-2 w-2 rounded-full bg-white/15`} />
      ))}
      <p className={`absolute bottom-4 ${isLeft ? 'left-4' : 'right-4'} max-w-[80%] break-all font-mono text-[8px] leading-tight text-gray-600 sm:text-[9px]`}>
        {isLeft ? hash.slice(0, 32) : hash.slice(32, 64)}
      </p>
    </motion.div>
  );
}

function Padlock({ phase }: { phase: VaultPhase }) {
  const color = phase === 'locked' ? '#ff3b47' : '#a78bfa';
  return (
    <div className="pointer-events-none absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
    <motion.div
      initial={false}
      animate={
        phase === 'open'
          ? { y: 70, opacity: 0, rotate: 18, scale: 0.8 }
          : phase === 'unlocking'
          ? { y: 0, opacity: 1, rotate: [0, -6, 6, -3, 0], scale: 1.05 }
          : { y: 0, opacity: 1, rotate: 0, scale: 1 }
      }
      transition={{ duration: phase === 'open' ? 0.6 : 0.45 }}
    >
      <svg viewBox="0 0 64 72" className="h-16 w-14 drop-shadow-[0_0_18px_rgba(255,59,71,0.55)] sm:h-20 sm:w-[4.5rem]">
        <motion.path
          d="M18 32 V20 a14 14 0 0 1 28 0 V32"
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          initial={false}
          animate={{ y: phase === 'locked' ? 0 : -9, rotate: phase === 'locked' ? 0 : -14 }}
          style={{ originX: '28%', originY: '100%' }}
          transition={{ duration: 0.4 }}
        />
        <rect x="8" y="30" width="48" height="38" rx="8" fill="#141418" stroke={color} strokeWidth="3" />
        <circle cx="32" cy="46" r="5" fill={color} />
        <rect x="30" y="48" width="4" height="10" rx="2" fill={color} />
      </svg>
    </motion.div>
    </div>
  );
}

export default function Projects() {
  const { t } = useTranslation();
  const [active, setActive] = useState(0);
  const [phase, setPhase] = useState<VaultPhase>('locked');
  const vaultRef = useRef<HTMLDivElement>(null);
  const vaultInView = useInView(vaultRef, { amount: 0.5 });

  // Projects data with translations
  const projects: Project[] = [
    {
      id: 1,
      title: t('Netflix Clone'),
      description: t('Clone da interface do Netflix'),
      image: "/img/capaproject1.jpeg",
      technologies: ["React", "Next.js", "TypeScript", "TailwindCSS"],
      githubUrl: "https://github.com/joaomatheus23/netflixclone",
      liveUrl: "https://netflixclone-22xn1l06k-joaomatheus23s-projects.vercel.app/",
      category: "Frontend"
    },
    {
      id: 2,
      title: t('Estoka.ai'),
      description: t('Crm integrado com Ia, controle de estoque, rotas de caminhões, financeiro e muito mais!'),
      image: "/img/capaproject2.jpeg",
      technologies: ["React.js", "TypeScript", "Mysql", "Node.js", "TailwindCSS"],
      githubUrl: "https://github.com/Estoka-ai/Estoka.ai",
      liveUrl: "https://estoka-46s2ayozv-joaomatheus23s-projects.vercel.app/",
      category: "Fullstack"
    },
    {
      id: 3,
      title: t('Stock Investing'),
      description: t('MVP de um site de investimentos em ações'),
      image: "/img/capaproject3.jpeg",
      technologies: ["Vue.js", "Chart.js", "Node.js", "MySQL", "Api Restufull"],
      githubUrl: "https://github.com/StockInvesting/app-stocks",
      liveUrl: "https://stockinvesting-nm7cc3y9f-joaomatheus23s-projects.vercel.app/dashboard",
      category: "Fullstack"
    },
    {
      id: 4,
      title: t('Busca Cep'),
      description: t('Api para busca de cep em C#'),
      image: "/img/projectbackend.jpeg",
      technologies: ["C#", ".NET"],
      githubUrl: "https://github.com/joaomatheus23/ApiBuscaCep",
      liveUrl: "https://github.com/joaomatheus23/ApiBuscaCep",
      category: "Backend"
    },
    {
      id: 5,
      title: t('CRUD'),
      description: t('Crud para controle de compras, com autenticação e controle de acesso, rotas protegidas, validação de dados, e muito mais!'),
      image: "/img/projectbackend.jpeg",
      technologies: ["Laravel", "Sawagger","MySQL"],
      githubUrl: "https://github.com/joaomatheus23/crudLaravel",
      liveUrl: "https://github.com/joaomatheus23/crudLaravel",
      category: "Backend"
    },
    {
      id: 6,
      title: t('Corte de audio com Ia'),
      description: t('Script para cortar seus audios com Ia, automatico e com qualidade!'),
      image: "/img/projectbackend.jpeg",
      technologies: ["Python", "FastAPI", "OpenAI"],
      githubUrl: "https://github.com/joaomatheus23/picotaraudiogrande",
      liveUrl: "https://github.com/joaomatheus23/picotaraudiogrande",
      category: "Backend and Automation"
    }
  ];

  // A cada bloco escolhido (e quando o cofre aparece na tela): trancado, cadeado abrindo, portas abertas
  useEffect(() => {
    setPhase('locked');
    if (!vaultInView) return;
    const unlock = setTimeout(() => setPhase('unlocking'), 450);
    const open = setTimeout(() => setPhase('open'), 1050);
    return () => {
      clearTimeout(unlock);
      clearTimeout(open);
    };
  }, [active, vaultInView]);

  const current = projects[active];
  const hash = fakeHash(current.title, 64);
  const prevHash = fakeHash(projects[(active + projects.length - 1) % projects.length].title, 40);
  const go = (delta: number) => setActive((index) => (index + delta + projects.length) % projects.length);

  return (
    <section id="projects" className="screen-section overflow-hidden">
      <div className="container relative z-10 mx-auto px-4 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-4 flex flex-col gap-2 md:mb-6 md:flex-row md:items-end md:justify-between"
          >
            <h2 className="text-3xl font-bold tracking-tight text-white md:text-5xl" style={{ fontFamily: 'var(--font-display)' }}>
              {t('projects.title')} <span className="text-primary">{t('projects.titleHighlight')}</span>
            </h2>
            <p className="max-w-md text-sm text-gray-400 md:text-right">{t('projects.subtitle')}</p>
          </motion.div>

          <div className="grid items-center gap-4 md:grid-cols-[1.2fr_1fr] lg:grid-cols-[1.3fr_1fr] lg:gap-8">
            <div
              ref={vaultRef}
              data-tour="projects-0"
              className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-white/10 bg-black shadow-[0_0_60px_rgba(139,92,246,0.15)] lg:max-h-[52svh]"
              style={{ perspective: 1400 }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.id}
                  initial={{ opacity: 0, scale: 1.08, filter: 'blur(10px)' }}
                  animate={phase === 'open' ? { opacity: 1, scale: 1, filter: 'blur(0px)' } : { opacity: 0.35, scale: 1.08, filter: 'blur(10px)' }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.7 }}
                  className="absolute inset-0"
                >
                  <Image
                    src={current.image}
                    alt={current.title}
                    fill
                    sizes="(min-width: 1024px) 640px, 100vw"
                    className="object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                </motion.div>
              </AnimatePresence>

              <VaultDoor side="left" phase={phase} hash={hash} />
              <VaultDoor side="right" phase={phase} hash={hash} />
              <Padlock phase={phase} />

              <span
                className={`absolute left-3 top-3 z-30 flex items-center gap-1.5 rounded-full border bg-black/70 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.2em] backdrop-blur ${
                  phase === 'open' ? 'border-primary/50 text-primary' : 'border-accent/50 text-accent'
                }`}
              >
                {phase === 'open' ? <LockOpen className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
                {t(`vault.${phase}`)}
              </span>
              <span className="absolute bottom-3 right-3 z-30 rounded bg-black/70 px-2 py-1 font-mono text-[10px] text-gray-300">
                {t('projectsChain.block')} #{String(current.id).padStart(2, '0')}
              </span>
            </div>

            <div className="flex min-h-0 flex-col">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.id}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.35 }}
                >
                  <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.25em] text-gray-500">
                    <span className="text-accent">{current.category}</span>
                  </p>
                  <h3 className="mb-2 text-2xl font-bold tracking-tight text-white md:text-3xl">{current.title}</h3>
                  <p className="mb-3 line-clamp-3 text-sm leading-relaxed text-gray-400 md:text-base">{current.description}</p>
                  <div className="mb-3 flex flex-wrap gap-1.5">
                    {current.technologies.map((tech) => (
                      <span key={tech} className="rounded-md border border-white/10 px-2 py-0.5 font-mono text-[11px] text-gray-300">
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="mb-4 hidden space-y-0.5 font-mono text-[10px] text-gray-600 sm:block">
                    <p className="truncate"><span className="text-gray-500">{t('projectsChain.hash')}</span> 0x{hash.slice(0, 40)}</p>
                    <p className="truncate"><span className="text-gray-500">{t('projectsChain.prev')}</span> 0x{prevHash}</p>
                  </div>
                  <div data-tour="projects-2" className="flex gap-2">
                    <a
                      href={current.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-white/15 px-4 py-2.5 text-sm font-semibold text-white transition hover:border-white/40"
                    >
                      <Github className="h-4 w-4" />
                      {t('projects.code')}
                    </a>
                    <a
                      href={current.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary/85"
                    >
                      <Eye className="h-4 w-4" />
                      {t('projects.demo')}
                    </a>
                  </div>
                </motion.div>
              </AnimatePresence>

              <div data-tour="projects-1" className="mt-5 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => go(-1)}
                  aria-label={t('projectsChain.prevBtn')}
                  className="rounded-full border border-white/10 p-2 text-gray-300 transition hover:border-primary/60 hover:text-white"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <div className="no-scrollbar flex flex-1 items-center overflow-x-auto py-1">
                  {projects.map((project, index) => (
                    <div key={project.id} className="flex items-center">
                      {index > 0 && <span className={`h-px w-3 sm:w-4 ${index <= active ? 'bg-primary/60' : 'bg-white/10'}`} />}
                      <button
                        type="button"
                        onClick={() => setActive(index)}
                        title={project.title}
                        aria-label={project.title}
                        aria-current={index === active ? 'true' : undefined}
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md border transition sm:h-10 sm:w-10 ${
                          index === active
                            ? 'border-primary bg-primary/20 text-white shadow-[0_0_16px_rgba(139,92,246,0.5)]'
                            : 'border-white/10 bg-white/[0.03] text-gray-500 hover:border-white/30 hover:text-white'
                        }`}
                      >
                        {index === active ? <LockOpen className="h-4 w-4" /> : <Lock className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => go(1)}
                  aria-label={t('projectsChain.nextBtn')}
                  className="rounded-full border border-white/10 p-2 text-gray-300 transition hover:border-primary/60 hover:text-white"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
              <a
                href="https://github.com/joaomatheus23"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 self-start font-mono text-xs uppercase tracking-[0.2em] text-gray-500 transition hover:text-primary"
              >
                <Github className="h-4 w-4" />
                {t('projects.viewAll')}
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

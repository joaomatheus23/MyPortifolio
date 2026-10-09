'use client';

import { motion } from 'framer-motion';
import { Globe, Languages, Sparkles } from 'lucide-react';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';

const cards = [
  { key: 'english', icon: Languages, color: 'primary' },
  { key: 'growth', icon: Sparkles, color: 'secondary' },
  { key: 'global', icon: Globe, color: 'accent' },
] as const;

export default function CanadaSection() {
  const { t } = useTranslation();

  return (
    <section id="canada" className="scroll-mt-24 py-24 bg-gradient-to-b from-darker via-dark to-darker relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/3 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-secondary/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-5"
          >
            <div className="relative">
              <div className="absolute -inset-3 bg-gradient-to-b from-primary/40 via-secondary/20 to-accent/30 rounded-3xl blur-xl opacity-70"></div>
              <div className="relative aspect-[3/4] rounded-3xl overflow-hidden border border-primary/40 shadow-[0_0_40px_rgba(0,212,255,0.18)]">
                <Image
                  src="/img/canada.jpg"
                  alt="João Matheus em Toronto, durante a imersão no Canadá"
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 420px, 100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20"></div>
                <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full glass border border-primary/40 text-primary font-mono text-xs">
                    {t('canada.place')}
                  </span>
                  <span className="h-2 w-2 rounded-full bg-accent animate-pulse"></span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="lg:col-span-7"
          >
            <p className="text-primary font-mono text-sm mb-4">{t('canada.kicker')}</p>
            <h2
              className="text-4xl md:text-5xl font-black text-white mb-6"
              style={{ fontFamily: 'var(--font-orbitron)' }}
            >
              {t('canada.title')}{' '}
              <span className="text-primary text-glow-cyan">{t('canada.titleHighlight')}</span>
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-primary to-secondary mb-8"></div>

            <p className="text-xl text-white leading-relaxed mb-5">{t('canada.lead')}</p>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>{t('canada.p1')}</p>
              <p>{t('canada.p2')}</p>
              <p>{t('canada.p3')}</p>
            </div>

            <div className="grid sm:grid-cols-3 gap-4 mt-8">
              {cards.map((card) => (
                <div
                  key={card.key}
                  className={`glass rounded-xl p-4 border ${
                    card.color === 'primary'
                      ? 'border-primary/20'
                      : card.color === 'secondary'
                      ? 'border-secondary/20'
                      : 'border-accent/20'
                  }`}
                >
                  <card.icon
                    className={`w-5 h-5 mb-3 ${
                      card.color === 'primary'
                        ? 'text-primary'
                        : card.color === 'secondary'
                        ? 'text-secondary'
                        : 'text-accent'
                    }`}
                  />
                  <h3 className="text-white font-semibold text-sm mb-1">
                    {t(`canada.cards.${card.key}.title`)}
                  </h3>
                  <p className="text-gray-400 text-xs leading-relaxed">
                    {t(`canada.cards.${card.key}.description`)}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

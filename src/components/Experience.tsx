'use client';

import { motion } from 'framer-motion';
import { Blocks, Landmark, Shield } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const tags = ['Ripple', 'XRP Ledger', 'Web3', 'Fintech', 'Tokenização', 'Cibersegurança'];

export default function Experience() {
  const { t } = useTranslation();

  const points = [
    { icon: Blocks, key: 'one', color: 'primary' },
    { icon: Shield, key: 'two', color: 'secondary' },
    { icon: Landmark, key: 'three', color: 'accent' },
  ] as const;

  return (
    <section id="experience" className="py-24 bg-gradient-to-b from-darker via-dark to-darker relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/5 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black mb-6 text-white" style={{ fontFamily: 'var(--font-orbitron)' }}>
              {t('experience.title')} <span className="text-primary text-glow-cyan">{t('experience.titleHighlight')}</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">{t('experience.subtitle')}</p>
            <div className="w-20 h-1 bg-gradient-to-r from-primary to-secondary mx-auto mt-6"></div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="glass rounded-2xl p-8 md:p-10 border border-primary/20"
          >
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
              <div>
                <p className="text-primary font-mono text-sm mb-2">{t('experience.context')}</p>
                <h3 className="text-4xl md:text-5xl font-black text-white" style={{ fontFamily: 'var(--font-orbitron)' }}>
                  {t('experience.company')}
                </h3>
                <p className="text-gray-300 mt-2">{t('experience.role')}</p>
              </div>
            </div>

            <p className="text-lg text-gray-300 leading-relaxed max-w-4xl">{t('experience.summary')}</p>

            <div className="flex flex-wrap gap-2 mt-6">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-mono"
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 mt-8">
            {points.map((point, index) => (
              <motion.div
                key={point.key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`glass rounded-xl p-6 border ${
                  point.color === 'primary'
                    ? 'border-primary/20'
                    : point.color === 'secondary'
                    ? 'border-secondary/20'
                    : 'border-accent/20'
                }`}
              >
                <div className={`p-3 rounded-lg w-fit mb-4 ${
                  point.color === 'primary'
                    ? 'bg-primary/10'
                    : point.color === 'secondary'
                    ? 'bg-secondary/10'
                    : 'bg-accent/10'
                }`}>
                  <point.icon className={`w-6 h-6 ${
                    point.color === 'primary'
                      ? 'text-primary'
                      : point.color === 'secondary'
                      ? 'text-secondary'
                      : 'text-accent'
                  }`} />
                </div>
                <p className="text-gray-300 leading-relaxed">{t(`experience.points.${point.key}`)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

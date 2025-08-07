'use client';

import { motion } from 'framer-motion';
import { GraduationCap, BookOpen, Award, ExternalLink } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Certificate {
  id: string;
  title: string;
  platform: string;
  hours: string;
  imageUrl: string;
}

export default function Education() {
  const { t } = useTranslation();

  const certificates: Certificate[] = [
    {
      id: '1',
      title: t('education.courses.items.reactIntensive.title'),
      platform: t('education.courses.items.reactIntensive.platform'),
      hours: t('education.courses.items.reactIntensive.hours'),
      imageUrl: 'https://udemy-certificate.s3.amazonaws.com/pdf/UC-ea74a10c-79b4-426a-8040-0d7e1c1eeaf5.pdf'
    },
    {
      id: '2',
      title: t('education.courses.items.reactSpecialized.title'),
      platform: t('education.courses.items.reactSpecialized.platform'),
      hours: t('education.courses.items.reactSpecialized.hours'),
      imageUrl: 'https://cursos.dankicode.com/api/certificados/8812378a-abf4-4ff4-a2aa-5536fc40b4b5'
    }
  ];

  const educationData = [
    {
      type: 'academic',
      title: t('education.academic.highSchool.title'),
      institution: t('education.academic.highSchool.institution'),
      period: t('education.academic.highSchool.period'),
      description: t('education.academic.highSchool.description')
    },
    {
      type: 'language',
      title: t('education.academic.english.title'),
      institution: t('education.academic.english.institution'),
      period: t('education.academic.english.period'),
      description: t('education.academic.english.description')
    },
    {
      type: 'academic',
      title: t('education.academic.graduation.title'),
      institution: t('education.academic.graduation.institution'),
      period: t('education.academic.graduation.period'),
      description: t('education.academic.graduation.description')
    }
  ];

  const coursesData = [
    {
      title: t('education.courses.items.reactIntensive.title'),
      platform: t('education.courses.items.reactIntensive.platform'),
      hours: t('education.courses.items.reactIntensive.hours'),
      description: t('education.courses.items.reactIntensive.description')
    },
    {
      title: t('education.courses.items.reactSpecialized.title'),
      platform: t('education.courses.items.reactSpecialized.platform'),
      hours: t('education.courses.items.reactSpecialized.hours'),
      description: t('education.courses.items.reactSpecialized.description')
    },
    {
      title: t('education.courses.items.webDevelopment.title'),
      platform: t('education.courses.items.webDevelopment.platform'),
      hours: t('education.courses.items.webDevelopment.hours'),
      description: t('education.courses.items.webDevelopment.description')
    },
    {
      title: t('education.courses.items.webDevelopmentDanki.title'),
      platform: t('education.courses.items.webDevelopmentDanki.platform'),
      hours: t('education.courses.items.webDevelopmentDanki.hours'),
      description: t('education.courses.items.webDevelopmentDanki.description')
    }
  ];

  return (
    <section id="education" className="py-24 bg-gradient-to-b from-darker via-dark to-darker relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-secondary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 left-1/6 w-48 h-48 bg-primary/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black mb-6 text-white" style={{ fontFamily: 'var(--font-orbitron)' }}>
              {t('education.title')} <span className="text-primary text-glow-cyan">{t('education.titleHighlight')}</span>
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-primary to-secondary mx-auto"></div>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-16">
            {/* Formação Acadêmica */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="flex items-center mb-8">
                <div className="p-3 bg-primary/10 rounded-lg mr-4">
                  <GraduationCap className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-white">{t('education.academic.title')}</h3>
              </div>

              <div className="space-y-6">
                {educationData.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="glass rounded-xl p-6 border border-gray-700/50 hover:border-primary/30 transition-all duration-300"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="text-lg font-semibold text-white">{item.title}</h4>
                      <span className="text-sm text-primary font-mono">{item.period}</span>
                    </div>
                    <p className="text-secondary text-sm mb-2">{item.institution}</p>
                    <p className="text-gray-300 text-sm leading-relaxed">{item.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Cursos e Certificados */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-8"
            >
              <div className="flex items-center mb-8">
                <div className="p-3 bg-secondary/10 rounded-lg mr-4">
                  <BookOpen className="w-6 h-6 text-secondary" />
                </div>
                <h3 className="text-2xl font-bold text-white">{t('education.courses.title')}</h3>
              </div>

              <div className="space-y-6">
                {coursesData.map((course, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="glass rounded-xl p-6 border border-gray-700/50 hover:border-secondary/30 transition-all duration-300"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="text-lg font-semibold text-white">{course.title}</h4>
                      <span className="text-sm text-secondary font-mono">{course.hours}</span>
                    </div>
                    <p className="text-secondary text-sm mb-2">{course.platform}</p>
                    <p className="text-gray-300 text-sm leading-relaxed mb-4">{course.description}</p>
                    
                    {/* Botão para certificado (apenas para os 2 primeiros cursos) */}
                    {index < 2 && (
                      <a
                        href={certificates[index].imageUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-secondary/10 text-secondary rounded-lg hover:bg-secondary/20 transition-all duration-300 text-sm"
                      >
                        <Award className="w-4 h-4" />
                        {t('education.courses.viewCertificate')}
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>


    </section>
  );
} 
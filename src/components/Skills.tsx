'use client';

import { motion } from 'framer-motion';
import { Monitor, Server, Cloud } from 'lucide-react';
import { 
  FaReact, 
  FaVuejs, 
  FaPhp, 
  FaNodeJs, 
  FaLaravel, 
  FaDocker, 
  FaAws, 
  FaGitAlt, 
  FaLinux,
  FaNpm
} from 'react-icons/fa';
import { 
  SiTypescript, 
  SiNextdotjs, 
  SiTailwindcss, 
  SiSass, 
  SiFramer, 
  SiVite,
  SiDotnet,
  SiMysql,
  SiPostgresql,
  SiRedis,
  SiNginx,
  SiZapier
} from 'react-icons/si';
import { MdOutlineAutoFixHigh } from 'react-icons/md';
import { DiMsqlServer, DiVisualstudio } from 'react-icons/di';
import { TbBrandCSharp, TbNetwork } from 'react-icons/tb';
import { SiGraphql, SiRust, SiGo, SiKubernetes, SiPython } from 'react-icons/si';
import { GiBrain } from 'react-icons/gi';
import { useTranslation } from 'react-i18next';

interface Skill {
  name: string;
  level: string; // Changed to string to accept translated levels
  icon: React.ComponentType<any>;
  color: string;
}

interface SkillCategory {
  title: string;
  icon: any;
  skills: Skill[];
  color: string;
}





export default function Skills() {
  const { t } = useTranslation();

  // Skills categories with translations
  const skillCategories: SkillCategory[] = [
    {
      title: t('skills.categories.frontend'),
      icon: Monitor,
      color: "primary",
      skills: [
        { name: "React", level: t('skills.levels.advanced'), icon: FaReact, color: "text-blue-400" },
        { name: "Vue.js", level: t('skills.levels.intermediate'), icon: FaVuejs, color: "text-green-400" },
        { name: "TypeScript", level: t('skills.levels.advanced'), icon: SiTypescript, color: "text-blue-500" },
        { name: "Next.js", level: t('skills.levels.advanced'), icon: SiNextdotjs, color: "text-white" },
        { name: "TailwindCSS", level: t('skills.levels.advanced'), icon: SiTailwindcss, color: "text-cyan-400" },
        { name: "Sass/SCSS", level: t('skills.levels.intermediate'), icon: SiSass, color: "text-pink-400" },
        { name: "Framer Motion", level: t('skills.levels.intermediate'), icon: SiFramer, color: "text-purple-400" },
        { name: "Vite", level: t('skills.levels.intermediate'), icon: SiVite, color: "text-yellow-400" }
      ]
    },
    {
      title: t('skills.categories.backend'),
      icon: Server,
      color: "secondary",
      skills: [
        { name: "PHP", level: t('skills.levels.advanced'), icon: FaPhp, color: "text-purple-400" },
        { name: "C#", level: t('skills.levels.intermediate'), icon: TbBrandCSharp, color: "text-purple-500" },
        { name: "Node.js", level: t('skills.levels.advanced'), icon: FaNodeJs, color: "text-green-500" },
        { name: "Laravel", level: t('skills.levels.advanced'), icon: FaLaravel, color: "text-red-400" },
        { name: ".NET Core", level: t('skills.levels.intermediate'), icon: SiDotnet, color: "text-purple-400" },
        { name: "MySQL", level: t('skills.levels.advanced'), icon: SiMysql, color: "text-blue-500" },
        { name: "PostgreSQL", level: t('skills.levels.intermediate'), icon: SiPostgresql, color: "text-blue-400" },
        { name: "Redis", level: t('skills.levels.intermediate'), icon: SiRedis, color: "text-red-500" }
      ]
    },
    {
      title: t('skills.categories.devops'),
      icon: Cloud,
      color: "accent",
      skills: [
        { name: "Docker", level: t('skills.levels.intermediate'), icon: FaDocker, color: "text-blue-400" },
        { name: "AWS", level: t('skills.levels.intermediate'), icon: FaAws, color: "text-orange-400" },
        { name: "Git", level: t('skills.levels.advanced'), icon: FaGitAlt, color: "text-orange-500" },
        { name: "Linux", level: t('skills.levels.intermediate'), icon: FaLinux, color: "text-yellow-400" },
        { name: "Nginx", level: t('skills.levels.intermediate'), icon: SiNginx, color: "text-green-500" },
        { name: "n8n", level: t('skills.levels.advanced'), icon: TbNetwork, color: "text-purple-400" },
        { name: "Zapier", level: t('skills.levels.beginner'), icon: SiZapier, color: "text-orange-400" },
        { name: "Python", level: t('skills.levels.intermediate'), icon: SiPython, color: "text-yellow-400" }
      ]
    }
  ];

  // Update level colors and progress to use translations
  const levelColors = {
    [t('skills.levels.beginner')]: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    [t('skills.levels.intermediate')]: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    [t('skills.levels.advanced')]: 'bg-green-500/20 text-green-400 border-green-500/30'
  };

  const levelProgress = {
    [t('skills.levels.beginner')]: 30,
    [t('skills.levels.intermediate')]: 65,
    [t('skills.levels.advanced')]: 90
  };
  return (
    <section id="skills" className="py-24 bg-gradient-to-b from-darker via-dark to-darker relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/3 left-1/5 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse-glow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl animate-pulse-glow" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-3/4 left-1/3 w-64 h-64 bg-accent/5 rounded-full blur-3xl animate-pulse-glow" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black mb-6 text-white" style={{ fontFamily: 'var(--font-orbitron)' }}>
              {t('skills.title')} <span className="text-primary text-glow-cyan">{t('skills.titleHighlight')}</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              {t('skills.subtitle')}
            </p>
            <div className="w-20 h-1 bg-gradient-to-r from-primary to-secondary mx-auto mt-6"></div>
          </motion.div>

          {/* Skills categories */}
          <div className="grid lg:grid-cols-3 gap-8">
            {skillCategories.map((category, categoryIndex) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: categoryIndex * 0.2 }}
                className="glass rounded-2xl p-8 border border-white/10 hover:border-primary/30 transition-all duration-500 group"
              >
                {/* Category header */}
                <div className="flex items-center mb-8">
                  <div className={`p-4 rounded-xl mr-4 ${
                    category.color === 'primary' ? 'bg-primary/10' :
                    category.color === 'secondary' ? 'bg-secondary/10' :
                    'bg-accent/10'
                  }`}>
                    <category.icon className={`w-8 h-8 ${
                      category.color === 'primary' ? 'text-primary' :
                      category.color === 'secondary' ? 'text-secondary' :
                      'text-accent'
                    }`} />
                  </div>
                  <h3 className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-orbitron)' }}>
                    {category.title}
                  </h3>
                </div>

                {/* Skills list */}
                <div className="space-y-6">
                  {category.skills.map((skill, skillIndex) => (
                    <motion.div
                      key={skill.name}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: (categoryIndex * 0.2) + (skillIndex * 0.1) }}
                      className="group/skill"
                    >
                      {/* Skill header */}
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <div className="mr-3 flex items-center justify-center w-8 h-8">
                            <skill.icon className={`text-xl ${skill.color}`} />
                          </div>
                          <span className="text-white font-semibold">{skill.name}</span>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-mono border ${levelColors[skill.level]}`}>
                          {skill.level}
                        </span>
                      </div>

                      {/* Progress bar */}
                      <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${levelProgress[skill.level]}%` }}
                          transition={{ duration: 1, delay: (categoryIndex * 0.2) + (skillIndex * 0.1) + 0.3 }}
                          className={`h-full rounded-full ${
                            category.color === 'primary' ? 'bg-gradient-to-r from-primary to-cyan-400' :
                            category.color === 'secondary' ? 'bg-gradient-to-r from-secondary to-purple-400' :
                            'bg-gradient-to-r from-accent to-green-400'
                          }`}
                        />
                      </div>

                      {/* Progress percentage */}
                      <div className="text-right mt-1">
                        <motion.span
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          transition={{ duration: 0.4, delay: (categoryIndex * 0.2) + (skillIndex * 0.1) + 0.5 }}
                          className="text-xs text-gray-400 font-mono"
                        >
                          {levelProgress[skill.level]}%
                        </motion.span>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Category glow effect */}
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl ${
                  category.color === 'primary' ? 'bg-gradient-to-br from-primary/5 to-cyan-400/5' :
                  category.color === 'secondary' ? 'bg-gradient-to-br from-secondary/5 to-purple-400/5' :
                  'bg-gradient-to-br from-accent/5 to-green-400/5'
                }`}></div>
              </motion.div>
            ))}
          </div>

          {/* Additional info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-center mt-16"
          >
            <div className="glass rounded-2xl p-8 max-w-4xl mx-auto border border-primary/20">
              <h3 className="text-2xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-orbitron)' }}>
                {t('skills.alwaysLearning.title')}
              </h3>
              <p className="text-gray-300 leading-relaxed">
                {t('skills.alwaysLearning.description')}
              </p>
              <div className="flex flex-wrap justify-center gap-4 mt-6">
                {[
                  { name: 'GraphQL', icon: SiGraphql, color: 'text-pink-400' },
                  { name: 'Rust', icon: SiRust, color: 'text-orange-500' },
                  { name: 'Go', icon: SiGo, color: 'text-cyan-400' },
                  { name: 'Kubernetes', icon: SiKubernetes, color: 'text-blue-400' },
                  { name: 'AI/ML', icon: GiBrain, color: 'text-purple-400' }
                ].map((tech) => (
                  <span
                    key={tech.name}
                    className="px-4 py-2 bg-gradient-to-r from-primary/10 to-secondary/10 text-primary rounded-full text-sm font-mono border border-primary/20 hover:border-primary/40 transition-colors duration-200 flex items-center gap-2"
                  >
                    <tech.icon className={`text-base ${tech.color}`} />
                    {tech.name}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
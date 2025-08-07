'use client';

import { motion } from 'framer-motion';
import { Code, Database, Cloud, Monitor, Server, Zap } from 'lucide-react';

interface Skill {
  name: string;
  level: 'Iniciante' | 'Intermediário' | 'Avançado';
  icon: string;
  color: string;
}

interface SkillCategory {
  title: string;
  icon: any;
  skills: Skill[];
  color: string;
}

const skillCategories: SkillCategory[] = [
  {
    title: "Frontend",
    icon: Monitor,
    color: "primary",
    skills: [
      { name: "React", level: "Avançado", icon: "⚛️", color: "text-primary" },
      { name: "Vue.js", level: "Avançado", icon: "💚", color: "text-accent" },
      { name: "TypeScript", level: "Avançado", icon: "🔷", color: "text-primary" },
      { name: "Next.js", level: "Intermediário", icon: "▲", color: "text-white" },
      { name: "TailwindCSS", level: "Avançado", icon: "🎨", color: "text-primary" },
      { name: "Sass/SCSS", level: "Intermediário", icon: "💅", color: "text-secondary" },
      { name: "Framer Motion", level: "Intermediário", icon: "🎭", color: "text-accent" },
      { name: "Vite", level: "Intermediário", icon: "⚡", color: "text-accent" }
    ]
  },
  {
    title: "Backend",
    icon: Server,
    color: "secondary",
    skills: [
      { name: "PHP", level: "Avançado", icon: "🐘", color: "text-secondary" },
      { name: "C#", level: "Avançado", icon: "🔷", color: "text-secondary" },
      { name: "Node.js", level: "Intermediário", icon: "🟢", color: "text-accent" },
      { name: "Laravel", level: "Avançado", icon: "🔺", color: "text-secondary" },
      { name: ".NET Core", level: "Intermediário", icon: "💜", color: "text-secondary" },
      { name: "MySQL", level: "Avançado", icon: "🗄️", color: "text-primary" },
      { name: "PostgreSQL", level: "Intermediário", icon: "🐘", color: "text-primary" },
      { name: "Redis", level: "Intermediário", icon: "🔴", color: "text-accent" }
    ]
  },
  {
    title: "DevOps & Cloud",
    icon: Cloud,
    color: "accent",
    skills: [
      { name: "Docker", level: "Intermediário", icon: "🐳", color: "text-primary" },
      { name: "AWS", level: "Iniciante", icon: "☁️", color: "text-accent" },
      { name: "Git", level: "Avançado", icon: "📝", color: "text-primary" },
      { name: "Linux", level: "Intermediário", icon: "🐧", color: "text-accent" },
      { name: "Nginx", level: "Intermediário", icon: "🔧", color: "text-secondary" },
      { name: "n8n", level: "Avançado", icon: "🤖", color: "text-accent" },
      { name: "Zapier", level: "Intermediário", icon: "⚡", color: "text-primary" },
      { name: "CI/CD", level: "Iniciante", icon: "🔄", color: "text-secondary" }
    ]
  }
];

const levelColors = {
  'Iniciante': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  'Intermediário': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'Avançado': 'bg-green-500/20 text-green-400 border-green-500/30'
};

const levelProgress = {
  'Iniciante': 30,
  'Intermediário': 65,
  'Avançado': 90
};

export default function Skills() {
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
              Minhas <span className="text-primary text-glow-cyan">Skills</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Tecnologias e ferramentas que domino para criar soluções completas e eficientes.
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
                          <span className="text-2xl mr-3">{skill.icon}</span>
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
                Sempre Aprendendo
              </h3>
              <p className="text-gray-300 leading-relaxed">
                A tecnologia evolui constantemente, e eu me mantenho atualizado com as últimas tendências e melhores práticas. 
                Estou sempre explorando novas ferramentas e frameworks para oferecer as melhores soluções possíveis.
              </p>
              <div className="flex flex-wrap justify-center gap-4 mt-6">
                {['GraphQL', 'Rust', 'Go', 'Kubernetes', 'AI/ML'].map((tech) => (
                  <span
                    key={tech}
                    className="px-4 py-2 bg-gradient-to-r from-primary/10 to-secondary/10 text-primary rounded-full text-sm font-mono border border-primary/20 hover:border-primary/40 transition-colors duration-200"
                  >
                    🔄 {tech}
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
 'use client';

import { motion } from 'framer-motion';
import { Code, Database, Zap } from 'lucide-react';

export default function AboutMe() {
  return (
    <section id="about" className="py-24 bg-gradient-to-b from-darker via-dark to-darker relative overflow-hidden">
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
              Sobre <span className="text-primary text-glow-cyan">Mim</span>
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-primary to-secondary mx-auto"></div>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left side - Text content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-6" style={{ fontFamily: 'var(--font-orbitron)' }}>
                Desenvolvedor Full Stack
              </h3>

              <p className="text-lg text-gray-300 leading-relaxed">
                Sou um desenvolvedor apaixonado por tecnologia com mais de{' '}
                <span className="text-primary font-semibold">3 anos de experiência</span>{' '}
                criando soluções digitais inovadoras. Especializado em desenvolvimento{' '}
                <span className="text-secondary font-semibold">frontend</span> e{' '}
                <span className="text-accent font-semibold">backend</span>, transformo ideias complexas em aplicações elegantes e funcionais.
              </p>

              <p className="text-lg text-gray-300 leading-relaxed">
                Minha jornada no desenvolvimento me levou a trabalhar com tecnologias modernas como{' '}
                <span className="text-primary">React</span>, <span className="text-primary">Vue.js</span> no frontend, 
                e <span className="text-secondary">PHP</span>, <span className="text-secondary">C#</span> no backend. 
                Também tenho experiência em <span className="text-accent">automações com n8n</span> e{' '}
                <span className="text-accent">criação de SaaS</span>.
              </p>

              <p className="text-lg text-gray-300 leading-relaxed">
                Sempre busco estar atualizado com as últimas tendências e melhores práticas do desenvolvimento, 
                focando em criar experiências de usuário excepcionais e código limpo, escalável e maintível.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 mt-8 pt-8 border-t border-gray-700">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">3+</div>
                  <div className="text-sm text-gray-400 font-mono">Anos de Experiência</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-secondary mb-2">50+</div>
                  <div className="text-sm text-gray-400 font-mono">Projetos Concluídos</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent mb-2">10+</div>
                  <div className="text-sm text-gray-400 font-mono">Tecnologias</div>
                </div>
              </div>
            </motion.div>

            {/* Right side - Skills preview */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-8"
            >
              {/* Frontend */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="glass rounded-xl p-6 border border-primary/20 hover:border-primary/40 transition-all duration-300"
              >
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-primary/10 rounded-lg mr-4">
                    <Code className="w-6 h-6 text-primary" />
                  </div>
                  <h4 className="text-xl font-bold text-white">Frontend</h4>
                </div>
                <p className="text-gray-300 mb-4">
                  Criação de interfaces modernas e responsivas com foco na experiência do usuário.
                </p>
                <div className="flex flex-wrap gap-2">
                  {['React', 'Vue.js', 'TypeScript', 'TailwindCSS', 'Next.js'].map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-mono"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </motion.div>

              {/* Backend */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="glass rounded-xl p-6 border border-secondary/20 hover:border-secondary/40 transition-all duration-300"
              >
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-secondary/10 rounded-lg mr-4">
                    <Database className="w-6 h-6 text-secondary" />
                  </div>
                  <h4 className="text-xl font-bold text-white">Backend</h4>
                </div>
                <p className="text-gray-300 mb-4">
                  Desenvolvimento de APIs robustas e arquiteturas escaláveis.
                </p>
                <div className="flex flex-wrap gap-2">
                  {['PHP', 'C#', 'Node.js', 'MySQL', 'PostgreSQL'].map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 bg-secondary/10 text-secondary rounded-full text-sm font-mono"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </motion.div>

              {/* Automation */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="glass rounded-xl p-6 border border-accent/20 hover:border-accent/40 transition-all duration-300"
              >
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-accent/10 rounded-lg mr-4">
                    <Zap className="w-6 h-6 text-accent" />
                  </div>
                  <h4 className="text-xl font-bold text-white">Automação & SaaS</h4>
                </div>
                <p className="text-gray-300 mb-4">
                  Automações inteligentes e desenvolvimento de soluções SaaS completas.
                </p>
                <div className="flex flex-wrap gap-2">
                  {['n8n', 'Zapier', 'SaaS', 'APIs', 'DevOps'].map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 bg-accent/10 text-accent rounded-full text-sm font-mono"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
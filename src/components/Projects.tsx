'use client';

import { motion } from 'framer-motion';
import { ExternalLink, Github, Eye } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  githubUrl: string;
  liveUrl: string;
  category: 'Frontend' | 'Backend' | 'SaaS' | 'Automation';
}



const categoryColors = {
  Frontend: 'primary',
  Backend: 'secondary',
  SaaS: 'accent',
  Automation: 'glow-cyan'
};

export default function Projects() {
  const { t } = useTranslation();

  // Projects data with translations
  const projects: Project[] = [
    {
      id: 1,
      title: t('projects.items.ecommerce.title'),
      description: t('projects.items.ecommerce.description'),
      image: "/projects/ecommerce.jpg",
      technologies: ["React", "Next.js", "TypeScript", "TailwindCSS", "Stripe"],
      githubUrl: "https://github.com/joaomatheus",
      liveUrl: "https://demo-ecommerce.com",
      category: "Frontend"
    },
    {
      id: 2,
      title: t('projects.items.api.title'),
      description: t('projects.items.api.description'),
      image: "/projects/api-saas.jpg",
      technologies: ["C#", ".NET Core", "PostgreSQL", "Redis", "Docker"],
      githubUrl: "https://github.com/joaomatheus",
      liveUrl: "https://api-saas-demo.com",
      category: "Backend"
    },
    {
      id: 3,
      title: t('projects.items.dashboard.title'),
      description: t('projects.items.dashboard.description'),
      image: "/projects/dashboard.jpg",
      technologies: ["Vue.js", "Chart.js", "PHP", "MySQL", "WebSockets"],
      githubUrl: "https://github.com/joaomatheus",
      liveUrl: "https://dashboard-demo.com",
      category: "Frontend"
    },
    {
      id: 4,
      title: t('projects.items.automation.title'),
      description: t('projects.items.automation.description'),
      image: "/projects/automation.jpg",
      technologies: ["n8n", "Node.js", "MongoDB", "AWS", "Docker"],
      githubUrl: "https://github.com/joaomatheus",
      liveUrl: "https://automation-demo.com",
      category: "Automation"
    },
    {
      id: 5,
      title: t('projects.items.crm.title'),
      description: t('projects.items.crm.description'),
      image: "/projects/crm.jpg",
      technologies: ["React", "PHP", "Laravel", "MySQL", "Redis"],
      githubUrl: "https://github.com/joaomatheus",
      liveUrl: "https://crm-demo.com",
      category: "SaaS"
    },
    {
      id: 6,
      title: t('projects.items.chatbot.title'),
      description: t('projects.items.chatbot.description'),
      image: "/projects/chatbot.jpg",
      technologies: ["Python", "FastAPI", "OpenAI", "React", "WebSockets"],
      githubUrl: "https://github.com/joaomatheus",
      liveUrl: "https://chatbot-demo.com",
      category: "SaaS"
    }
  ];
  return (
    <section id="projects" className="py-24 bg-gradient-to-b from-dark via-darker to-dark relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-accent/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/6 w-64 h-64 bg-secondary/5 rounded-full blur-3xl"></div>
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
              {t('projects.title')} <span className="text-primary text-glow-cyan">{t('projects.titleHighlight')}</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              {t('projects.subtitle')}
            </p>
            <div className="w-20 h-1 bg-gradient-to-r from-primary to-secondary mx-auto mt-6"></div>
          </motion.div>

          {/* Projects grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="group relative glass rounded-2xl overflow-hidden border border-white/10 hover:border-primary/30 transition-all duration-500"
              >
                {/* Project image */}
                <div className="relative h-48 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/10 to-accent/20"></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  
                  {/* Placeholder gradient instead of image */}
                  <div className="w-full h-full bg-gradient-to-br from-primary/30 via-secondary/20 to-accent/30 flex items-center justify-center">
                    <div className="text-6xl opacity-30">
                      {project.category === 'Frontend' && '🖥️'}
                      {project.category === 'Backend' && '⚙️'}
                      {project.category === 'SaaS' && '☁️'}
                      {project.category === 'Automation' && '🤖'}
                    </div>
                  </div>

                  {/* Overlay with links */}
                  <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors duration-200"
                    >
                      <Github className="w-6 h-6 text-white" />
                    </a>
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 bg-primary/20 rounded-full hover:bg-primary/30 transition-colors duration-200"
                    >
                      <ExternalLink className="w-6 h-6 text-primary" />
                    </a>
                  </div>

                  {/* Category badge */}
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold ${
                      project.category === 'Frontend' ? 'bg-primary/20 text-primary' :
                      project.category === 'Backend' ? 'bg-secondary/20 text-secondary' :
                      project.category === 'SaaS' ? 'bg-accent/20 text-accent' :
                      'bg-cyan-400/20 text-cyan-400'
                    }`}>
                      {project.category}
                    </span>
                  </div>
                </div>

                {/* Project content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-primary transition-colors duration-300">
                    {project.title}
                  </h3>
                  
                  <p className="text-gray-400 text-sm leading-relaxed mb-4">
                    {project.description}
                  </p>

                  {/* Technologies */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-1 bg-white/5 text-white/70 rounded text-xs font-mono hover:bg-primary/10 hover:text-primary transition-colors duration-200"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-3">
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-white/5 hover:bg-white/10 rounded-lg transition-colors duration-200 text-sm"
                    >
                      <Github className="w-4 h-4" />
                      {t('projects.code')}
                    </a>
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-colors duration-200 text-sm"
                    >
                      <Eye className="w-4 h-4" />
                      {t('projects.demo')}
                    </a>
                  </div>
                </div>

                {/* Glow effect on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 rounded-2xl"></div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* View more button */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mt-12"
          >
            <a
              href="https://github.com/joaomatheus"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 glass rounded-lg font-semibold text-white hover:glow-cyan transition-all duration-300 border border-primary/30 hover:border-primary/60"
            >
              <Github className="w-5 h-5" />
              {t('projects.viewAll')}
              <ExternalLink className="w-4 h-4" />
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
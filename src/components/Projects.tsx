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
  category: 'Frontend' | 'Backend' | 'SaaS' | 'Automation' | 'Fullstack' | 'Backend and Automation';
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
      githubUrl: "https://github.com/StockInvesting/app-stocks",
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
                  
                  {/* Real image or placeholder */}
                  {project.image && project.image !== "/img/capaproject1.jpeg" ? (
                    <img 
                      src={project.image} 
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  ) : project.image === "/img/capaproject1.jpeg" ? (
                    <img 
                      src={project.image} 
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/30 via-secondary/20 to-accent/30 flex items-center justify-center">
                      <div className="text-6xl opacity-30">
                        {project.category === 'Frontend' && '🖥️'}
                        {project.category === 'Backend' && '⚙️'}
                        {project.category === 'SaaS' && '☁️'}
                        {project.category === 'Automation' && '🤖'}
                      </div>
                    </div>
                  )}

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
              href="https://github.com/joaomatheus23"
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
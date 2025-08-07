'use client';

import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, MessageCircle, Heart, ArrowUp } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const socialLinks = [
    {
      name: 'GitHub',
      icon: Github,
      url: 'https://github.com/joaomatheus23',
      color: 'hover:text-white'
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      url: 'https://www.linkedin.com/in/jo%C3%A3o-matheus-marques-52a65a232/',
      color: 'hover:text-blue-400'
    },
    {
      name: 'Email',
      icon: Mail,
      url: 'mailto:joaomatheusjau667@gmail.com',
      color: 'hover:text-primary'
    },
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      url: 'https://wa.me/5514981459596',
      color: 'hover:text-green-400'
    }
  ];

  const quickLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Sobre', href: '#about' },
    { name: 'Projetos', href: '#projects' },
    { name: 'Skills', href: '#skills' },
    { name: 'Contato', href: '#contact' }
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href === '#home' ? 'body' : href);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-gradient-to-t from-darker via-dark to-darker border-t border-white/10 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-secondary/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Main footer content */}
        <div className="py-16">
          <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
            {/* Brand section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-2"
            >
              <h3 
                className="text-3xl font-black mb-4"
                style={{ fontFamily: 'var(--font-orbitron)' }}
              >
                <span className="text-white">J</span>
                <span className="text-primary text-glow-cyan">0</span>
                <span className="text-white">ão</span>
                <span className="text-primary text-lg ml-1">{};</span>
              </h3>
              <p className="text-gray-400 leading-relaxed max-w-md mb-6">
                Desenvolvedor Full Stack apaixonado por criar soluções digitais inovadoras. 
                Transformando ideias em código e experiências em soluções desde 2021.
              </p>
              <div className="flex items-center text-gray-400">
                <span>Feito com</span>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="mx-2"
                >
                  <Heart className="w-4 h-4 text-red-400 fill-current" />
                </motion.div>
                <span>e muito café ☕</span>
              </div>
            </motion.div>

            {/* Quick links */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h4 className="text-xl font-bold text-white mb-6" style={{ fontFamily: 'var(--font-orbitron)' }}>
                Links Rápidos
              </h4>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.name}>
                    <button
                      onClick={() => scrollToSection(link.href)}
                      className="text-gray-400 hover:text-primary transition-colors duration-300 block"
                    >
                      {link.name}
                    </button>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Contact info */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h4 className="text-xl font-bold text-white mb-6" style={{ fontFamily: 'var(--font-orbitron)' }}>
                Contato
              </h4>
              <div className="space-y-4">
                <div className="flex items-center text-gray-400">
                  <Mail className="w-4 h-4 text-primary mr-3" />
                  <span className="text-sm">joaomatheusjau@gmail.com</span>
                </div>
                <div className="flex items-center text-gray-400">
                  <MessageCircle className="w-4 h-4 text-accent mr-3" />
                  <span className="text-sm">+55 (14) 98145-9596</span>
                </div>
              </div>

              {/* Social links */}
              <div className="mt-6">
                <h5 className="text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wider">
                  Redes Sociais
                </h5>
                <div className="flex space-x-4">
                  {socialLinks.map((social) => (
                    <motion.a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1, y: -2 }}
                      className={`p-2 bg-white/5 rounded-lg border border-white/10 hover:border-white/20 transition-all duration-300 ${social.color}`}
                    >
                      <social.icon className="w-5 h-5" />
                    </motion.a>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="py-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between"
        >
          <p className="text-gray-400 text-sm text-center md:text-left mb-4 md:mb-0">
            © {new Date().getFullYear()} João Matheus. Todos os direitos reservados.
          </p>

          <div className="flex items-center space-x-6">
            <span className="text-gray-400 text-sm">
              Desenvolvido com Next.js, TailwindCSS & Framer Motion
            </span>
            
            {/* Back to top button */}
            <motion.button
              onClick={scrollToTop}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 bg-primary/10 hover:bg-primary/20 rounded-lg border border-primary/20 hover:border-primary/40 transition-all duration-300 group"
            >
              <ArrowUp className="w-5 h-5 text-primary group-hover:text-white transition-colors duration-300" />
            </motion.button>
          </div>
        </motion.div>

        {/* Tech stack showcase */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="pb-8"
        >
          <div className="flex flex-wrap justify-center items-center gap-6 text-gray-500 text-sm">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-primary rounded-full"></span>
              React & Next.js
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-secondary rounded-full"></span>
              TypeScript
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-accent rounded-full"></span>
              TailwindCSS
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-cyan-400 rounded-full"></span>
              Framer Motion
            </span>
          </div>
        </motion.div>
      </div>

      {/* Animated background particles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/6 w-1 h-1 bg-primary rounded-full animate-float opacity-60"></div>
        <div className="absolute top-1/3 right-1/4 w-1.5 h-1.5 bg-secondary rounded-full animate-float opacity-40" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-1/3 left-1/3 w-1 h-1 bg-accent rounded-full animate-float opacity-50" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-2/3 right-1/6 w-1.5 h-1.5 bg-primary rounded-full animate-float opacity-30" style={{animationDelay: '0.5s'}}></div>
      </div>
    </footer>
  );
}
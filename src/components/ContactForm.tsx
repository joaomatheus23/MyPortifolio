'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Mail, Github, Linkedin, MessageCircle, Send, CheckCircle, AlertCircle } from 'lucide-react';
import emailjs from '@emailjs/browser';

interface FormData {
  name: string;
  email: string;
  message: string;
}

interface FormStatus {
  type: 'idle' | 'sending' | 'success' | 'error';
  message: string;
}

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: ''
  });

  const [formStatus, setFormStatus] = useState<FormStatus>({
    type: 'idle',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      setFormStatus({
        type: 'error',
        message: 'Por favor, preencha todos os campos.'
      });
      return;
    }

    setFormStatus({
      type: 'sending',
      message: 'Enviando mensagem...'
    });

    try {
      // Configuração do EmailJS (você precisará configurar suas credenciais)
      await emailjs.send(
        'YOUR_SERVICE_ID', // Substitua pela sua service ID
        'YOUR_TEMPLATE_ID', // Substitua pela sua template ID
        {
          from_name: formData.name,
          from_email: formData.email,
          message: formData.message,
          to_email: 'joaomatheusjau667@gmail.com' // Substitua pelo seu email
        },
        'YOUR_PUBLIC_KEY' // Substitua pela sua public key
      );

      setFormStatus({
        type: 'success',
        message: 'Mensagem enviada com sucesso! Obrigado pelo contato.'
      });

      // Limpar o formulário
      setFormData({
        name: '',
        email: '',
        message: ''
      });

    } catch (error) {
      console.error('Error sending email:', error);
      setFormStatus({
        type: 'error',
        message: 'Erro ao enviar mensagem. Tente novamente ou entre em contato diretamente.'
      });
    }

    // Limpar status após 5 segundos
    setTimeout(() => {
      setFormStatus({ type: 'idle', message: '' });
    }, 5000);
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

  return (
    <section id="contact" className="py-24 bg-gradient-to-b from-dark via-darker to-dark relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/6 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse-glow"></div>
        <div className="absolute bottom-1/3 right-1/5 w-80 h-80 bg-accent/5 rounded-full blur-3xl animate-pulse-glow" style={{animationDelay: '1.5s'}}></div>
        <div className="absolute top-2/3 left-1/2 w-64 h-64 bg-secondary/5 rounded-full blur-3xl animate-pulse-glow" style={{animationDelay: '3s'}}></div>
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
              Entre em <span className="text-primary text-glow-cyan">Contato</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Vamos conversar sobre seu próximo projeto? Estou sempre aberto a novas oportunidades e desafios interessantes.
            </p>
            <div className="w-20 h-1 bg-gradient-to-r from-primary to-secondary mx-auto mt-6"></div>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Contact form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="glass rounded-2xl p-8 border border-white/10"
            >
              <h3 className="text-2xl font-bold text-white mb-6" style={{ fontFamily: 'var(--font-orbitron)' }}>
                Envie uma Mensagem
              </h3>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name field */}
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-300 mb-2">
                    Nome
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all duration-300"
                    placeholder="Seu nome completo"
                    required
                  />
                </div>

                {/* Email field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all duration-300"
                    placeholder="Digite seu email"
                    required
                  />
                </div>

                {/* Message field */}
                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-gray-300 mb-2">
                    Mensagem
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={5}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all duration-300 resize-none"
                    placeholder="Descreva seu projeto ou como posso ajudar..."
                    required
                  ></textarea>
                </div>

                {/* Status message */}
                {formStatus.type !== 'idle' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex items-center gap-2 p-3 rounded-lg ${
                      formStatus.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                      formStatus.type === 'error' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                      'bg-primary/10 text-primary border border-primary/20'
                    }`}
                  >
                    {formStatus.type === 'success' && <CheckCircle className="w-5 h-5" />}
                    {formStatus.type === 'error' && <AlertCircle className="w-5 h-5" />}
                    {formStatus.type === 'sending' && (
                      <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                    )}
                    <span className="text-sm">{formStatus.message}</span>
                  </motion.div>
                )}

                {/* Submit button */}
                <motion.button
                  type="submit"
                  disabled={formStatus.type === 'sending'}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-primary via-secondary to-accent rounded-lg font-semibold text-dark hover:scale-105 transition-all duration-300 animate-gradient disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {formStatus.type === 'sending' ? (
                    <>
                      <div className="w-5 h-5 border-2 border-dark border-t-transparent rounded-full animate-spin"></div>
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Enviar Mensagem
                    </>
                  )}
                </motion.button>
              </form>
            </motion.div>

            {/* Contact info and social links */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-8"
            >
              {/* Contact info */}
              <div className="glass rounded-2xl p-8 border border-white/10">
                <h3 className="text-2xl font-bold text-white mb-6" style={{ fontFamily: 'var(--font-orbitron)' }}>
                  Vamos Conectar
                </h3>
                <p className="text-gray-300 leading-relaxed mb-6">
                  Estou sempre interessado em novos projetos desafiadores e oportunidades de colaboração. 
                  Seja para desenvolvimento de aplicações web, automações ou consultoria técnica, 
                  ficarei feliz em conversar sobre como posso ajudar.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-center text-gray-300">
                    <Mail className="w-5 h-5 text-primary mr-3" />
                    <span>joaomatheusjau667@gmail.com</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <MessageCircle className="w-5 h-5 text-accent mr-3" />
                    <span>+55 (14) 98145-9596</span>
                  </div>
                </div>
              </div>

              {/* Social links */}
              <div className="glass rounded-2xl p-8 border border-white/10">
                <h3 className="text-xl font-bold text-white mb-6" style={{ fontFamily: 'var(--font-orbitron)' }}>
                  Redes Sociais
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {socialLinks.map((social, index) => (
                    <motion.a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                      className={`flex items-center gap-3 p-4 bg-white/5 rounded-lg border border-white/10 hover:border-white/20 transition-all duration-300 ${social.color}`}
                    >
                      <social.icon className="w-6 h-6" />
                      <span className="font-semibold">{social.name}</span>
                    </motion.a>
                  ))}
                </div>
              </div>

              {/* Additional info */}
              <div className="glass rounded-2xl p-8 border border-primary/20">
                <h3 className="text-xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-orbitron)' }}>
                  Disponibilidade
                </h3>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-3 h-3 bg-accent rounded-full animate-pulse"></div>
                  <span className="text-accent font-semibold">Disponível para novos projetos</span>
                </div>
                <p className="text-gray-300 text-sm">
                  Respondo normalmente em até 24 horas. Para projetos urgentes, 
                  entre em contato via WhatsApp.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
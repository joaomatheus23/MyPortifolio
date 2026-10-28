'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Mail, Github, Linkedin, MessageCircle, Send, CheckCircle, AlertCircle } from 'lucide-react';
import emailjs from '@emailjs/browser';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: ''
  });

  const [tab, setTab] = useState<'message' | 'channels'>('message');

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

  const inputClass =
    'w-full rounded-lg border border-white/15 bg-black/50 px-4 py-2.5 text-white placeholder-gray-400 transition focus:border-primary/60 focus:bg-white/[0.05] focus:outline-none';

  return (
    <section id="contact" className="screen-section overflow-hidden">
      <div className="container relative z-10 mx-auto px-4 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-4 flex flex-col gap-2 md:mb-8 md:flex-row md:items-end md:justify-between"
          >
            <h2 className="text-3xl font-bold tracking-tight text-white md:text-5xl" style={{ fontFamily: 'var(--font-display)' }}>
              {t('contact.title')} <span className="text-primary">{t('contact.titleHighlight')}</span>
            </h2>
            <p className="max-w-md text-sm text-gray-400 md:text-right">{t('contact.subtitle')}</p>
          </motion.div>

          <div className="mb-3 flex gap-1 rounded-lg border border-white/10 bg-black/40 p-1 md:hidden" role="tablist">
            {(['message', 'channels'] as const).map((key) => (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={tab === key}
                onClick={() => setTab(key)}
                className={`flex-1 rounded-md py-2 font-mono text-[11px] uppercase tracking-[0.2em] transition ${tab === key ? 'bg-primary text-white' : 'text-gray-400'}`}
              >
                {t(`contactTabs.${key}`)}
              </button>
            ))}
          </div>

          <div className="grid items-stretch gap-4 md:grid-cols-[1.1fr_1fr] md:gap-6">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              data-tour="contact-0"
              className={`${tab === 'message' ? 'block' : 'hidden'} rounded-2xl border glass-apple-strong p-5 sm:p-7 md:block`}
            >
              <h3 className="mb-4 text-lg font-semibold text-white">{t('contact.form.title')}</h3>
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="mb-1 block font-mono text-[10px] uppercase tracking-[0.2em] text-gray-300">
                      {t('contact.form.name')}
                    </label>
                    <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} className={inputClass} placeholder={t('contact.form.namePlaceholder')} required />
                  </div>
                  <div>
                    <label htmlFor="email" className="mb-1 block font-mono text-[10px] uppercase tracking-[0.2em] text-gray-300">
                      {t('contact.form.email')}
                    </label>
                    <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} className={inputClass} placeholder={t('contact.form.emailPlaceholder')} required />
                  </div>
                </div>
                <div>
                  <label htmlFor="message" className="mb-1 block font-mono text-[10px] uppercase tracking-[0.2em] text-gray-300">
                    {t('contact.form.message')}
                  </label>
                  <textarea id="message" name="message" value={formData.message} onChange={handleInputChange} rows={4} className={`${inputClass} resize-none`} placeholder={t('contact.form.messagePlaceholder')} required></textarea>
                </div>

                {formStatus.type !== 'idle' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex items-center gap-2 rounded-lg p-3 ${
                      formStatus.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                      formStatus.type === 'error' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                      'bg-primary/10 text-primary border border-primary/20'
                    }`}
                  >
                    {formStatus.type === 'success' && <CheckCircle className="h-5 w-5" />}
                    {formStatus.type === 'error' && <AlertCircle className="h-5 w-5" />}
                    {formStatus.type === 'sending' && <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>}
                    <span className="text-sm">{formStatus.message}</span>
                  </motion.div>
                )}

                <motion.button
                  type="submit"
                  disabled={formStatus.type === 'sending'}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-white transition hover:bg-primary/85 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {formStatus.type === 'sending' ? (
                    <>
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      {t('contact.form.send')}
                    </>
                  )}
                </motion.button>
              </form>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
              data-tour="contact-1"
              className={`${tab === 'channels' ? 'flex' : 'hidden'} flex-col rounded-2xl border glass-apple-strong p-5 sm:p-7 md:flex`}
            >
              <h3 className="mb-2 text-lg font-semibold text-white">{t('contact.connect.title')}</h3>
              <p className="mb-4 text-sm leading-relaxed text-gray-400">{t('contact.connect.description')}</p>
              <div className="mb-4 space-y-2 text-sm text-gray-300">
                <p className="flex items-center gap-3"><Mail className="h-4 w-4 text-primary" />joaomatheusjau667@gmail.com</p>
                <p className="flex items-center gap-3"><MessageCircle className="h-4 w-4 text-accent" />+55 (14) 98145-9596</p>
              </div>
              <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.22em] text-gray-500">{t('contact.social.title')}</p>
              <div className="grid grid-cols-2 gap-2">
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ y: -2 }}
                    className={`flex items-center gap-2.5 rounded-lg border border-white/15 bg-black/50 px-3 py-2.5 text-sm font-semibold text-gray-200 transition hover:border-white/25 ${social.color}`}
                  >
                    <social.icon className="h-4 w-4" />
                    {social.name}
                  </motion.a>
                ))}
              </div>
              <div className="mt-auto pt-4">
                <p className="flex items-center gap-2 text-sm font-semibold text-accent">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-accent"></span>
                  {t('contact.availability.status')}
                </p>
                <p className="mt-1 text-xs text-gray-500">{t('contact.availability.description')}</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

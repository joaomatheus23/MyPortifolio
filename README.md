# 🚀 Portfólio Futurista - João Matheus

Um portfólio moderno e futurista para desenvolvedor Full Stack, criado com Next.js, TailwindCSS e Framer Motion.

## ✨ Características

- **Design Futurista**: Interface moderna com efeitos glassmorphism, gradientes neon e animações suaves
- **Totalmente Responsivo**: Layout 100% responsivo para todos os dispositivos
- **Animações Avançadas**: Animações fluidas com Framer Motion
- **Performance Otimizada**: Construído com Next.js 15 e TailwindCSS 4
- **Formulário de Contato**: Integração com EmailJS para envio de mensagens
- **SEO Otimizado**: Metadados configurados para melhor indexação

## 🎨 Seções

1. **Hero Section** - Apresentação principal com nome e frase de impacto
2. **About Me** - Descrição profissional e experiência
3. **Projects** - Showcase de projetos com links para GitHub e demo
4. **Skills** - Habilidades técnicas organizadas por categoria
5. **Contact** - Formulário de contato e links para redes sociais

## 🛠️ Tecnologias Utilizadas

- **Frontend**: Next.js 15, React, TypeScript
- **Estilização**: TailwindCSS 4, CSS customizado
- **Animações**: Framer Motion
- **Formulário**: EmailJS
- **Ícones**: Lucide React
- **Fontes**: Orbitron, Space Mono (Google Fonts)

## 🚀 Como Executar

### Pré-requisitos

- Node.js 18+ 
- npm ou yarn

### Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/portfolio-futurista.git
cd portfolio-futurista
```

2. Instale as dependências:
```bash
npm install
```

3. Execute o projeto em modo de desenvolvimento:
```bash
npm run dev
```

4. Acesse [http://localhost:3000](http://localhost:3000) no seu navegador

### Build para Produção

```bash
npm run build
npm start
```

## ⚙️ Configuração

### EmailJS

Para configurar o formulário de contato:

1. Crie uma conta no [EmailJS](https://www.emailjs.com/)
2. Configure um serviço de email
3. Crie um template de email
4. Atualize as credenciais em `src/components/ContactForm.tsx`:
   - `YOUR_SERVICE_ID`
   - `YOUR_TEMPLATE_ID`
   - `YOUR_PUBLIC_KEY`

### Personalização

#### Cores e Tema

As cores principais estão definidas em `src/app/globals.css`:

```css
:root {
  --cyber-blue: #00d4ff;
  --neon-purple: #8b5cf6;
  --neon-green: #00ff88;
  --dark-bg: #0f0f0f;
}
```

#### Conteúdo

Edite os seguintes arquivos para personalizar o conteúdo:

- `src/components/HeroSection.tsx` - Informações principais
- `src/components/AboutMe.tsx` - Descrição e experiência
- `src/components/Projects.tsx` - Lista de projetos
- `src/components/Skills.tsx` - Habilidades técnicas
- `src/components/ContactForm.tsx` - Informações de contato

#### Imagem de Perfil

Substitua `public/profile.jpg` pela sua foto de perfil (recomendado: 400x400px)

## 📱 Responsividade

O projeto é totalmente responsivo com breakpoints:

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px  
- **Desktop**: > 1024px

## 🎯 Funcionalidades

### Animações

- Animações de entrada ao rolar a página
- Efeitos hover nos cards e botões
- Partículas flutuantes animadas
- Gradientes animados

### Tema

- **Modo Escuro**: Interface principal com tons escuros
- **Modo Neon**: Efeitos de brilho intensificados (toggle no navbar)

### Performance

- Carregamento lazy de imagens
- Otimização de fontes
- Bundling otimizado com Next.js

## 📧 Contato

Para dúvidas sobre este projeto:

- **Email**: joaomatheus@email.com
- **LinkedIn**: [linkedin.com/in/joaomatheus](https://linkedin.com/in/joaomatheus)
- **GitHub**: [github.com/joaomatheus](https://github.com/joaomatheus)

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🤝 Contribuições

Contribuições são bem-vindas! Sinta-se à vontade para:

1. Fazer fork do projeto
2. Criar uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abrir um Pull Request

---

⭐ Se este projeto te ajudou, considere dar uma estrela no repositório!

Desenvolvido com 💜 por [João Matheus](https://github.com/joaomatheus)
# 🚀 Guia de Deploy - Domínio Personalizado

## **Opções Recomendadas:**

### **1. Vercel (Mais Fácil para Next.js)**

#### **Passo a Passo:**
1. **Conecte ao GitHub:**
   ```bash
   # Faça push do seu código para o GitHub
   git add .
   git commit -m "Deploy preparation"
   git push origin main
   ```

2. **Deploy no Vercel:**
   - Acesse [vercel.com](https://vercel.com)
   - Conecte sua conta GitHub
   - Importe o repositório
   - Configure o domínio personalizado

3. **Configurar Domínio:**
   - No dashboard do Vercel: Settings → Domains
   - Adicione seu domínio: `chat`
   - Configure os DNS conforme instruções

#### **Configuração DNS (Vercel):**
```
Tipo: A
Nome: @
Valor: 76.76.19.19

Tipo: CNAME
Nome: www
Valor: cname.vercel-dns.com
```

### **2. Netlify (Alternativa)**

#### **Passo a Passo:**
1. **Build local:**
   ```bash
   npm run build
   npm run export  # Se necessário
   ```

2. **Deploy:**
   - Acesse [netlify.com](https://netlify.com)
   - Arraste a pasta `out` ou conecte ao GitHub
   - Configure domínio personalizado

### **3. Railway (Backend + Frontend)**

#### **Para aplicações full-stack:**
```bash
# Instale Railway CLI
npm install -g @railway/cli

# Login
railway login

# Deploy
railway up
```

## **🔧 Configurações Importantes:**

### **1. Variáveis de Ambiente:**
Crie um arquivo `.env.local`:
```env
NEXT_PUBLIC_SITE_URL=https://chat
NEXT_PUBLIC_API_URL=https://api.chat
```

### **2. Otimizações para Produção:**
```bash
# Build otimizado
npm run build

# Teste local
npm run start
```

### **3. Configuração do Next.js:**
```typescript
// next.config.ts
const nextConfig = {
  output: 'standalone', // Para Vercel
  images: {
    domains: ['chat'], // Seu domínio
  },
  // Outras configurações...
}
```

## **🌐 Configuração do Domínio:**

### **DNS Records:**
```
# Para Vercel
A     @     76.76.19.19
CNAME www   cname.vercel-dns.com

# Para Netlify
A     @     75.2.60.5
CNAME www   chat.netlify.app
```

## **📊 Monitoramento:**

### **1. Analytics:**
- Google Analytics
- Vercel Analytics
- Hotjar (para UX)

### **2. Performance:**
- Lighthouse
- PageSpeed Insights
- WebPageTest

## **🔒 Segurança:**

### **1. HTTPS:**
- Automático no Vercel/Netlify
- Certificado SSL gratuito

### **2. Headers de Segurança:**
```typescript
// next.config.ts
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ]
  },
}
```

## **🚀 Comandos Úteis:**

```bash
# Build para produção
npm run build

# Teste local
npm run start

# Lint
npm run lint

# Type check
npm run type-check
```

## **📞 Suporte:**

- **Vercel:** [vercel.com/support](https://vercel.com/support)
- **Netlify:** [netlify.com/support](https://netlify.com/support)
- **Railway:** [railway.app/support](https://railway.app/support)

---

**Recomendação:** Use Vercel para o deploy inicial, é a opção mais simples e otimizada para Next.js! 🎯 
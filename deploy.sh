#!/bin/bash

echo "🚀 Iniciando deploy do portfólio..."

# Verificar se há mudanças não commitadas
if [ -n "$(git status --porcelain)" ]; then
    echo "⚠️  Há mudanças não commitadas. Fazendo commit..."
    git add .
    git commit -m "Deploy: $(date)"
fi

# Push para o repositório
echo "📤 Fazendo push para o GitHub..."
git push origin main

# Build local para teste
echo "🔨 Fazendo build local..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build realizado com sucesso!"
    
    # Deploy no Vercel (se configurado)
    if command -v vercel &> /dev/null; then
        echo "🚀 Fazendo deploy no Vercel..."
        vercel --prod
    else
        echo "📝 Para fazer deploy no Vercel:"
        echo "1. Instale o Vercel CLI: npm i -g vercel"
        echo "2. Execute: vercel --prod"
    fi
    
    echo "🎉 Deploy concluído!"
    echo "🌐 Seu site estará disponível em: https://chat"
else
    echo "❌ Erro no build. Verifique os erros acima."
    exit 1
fi 
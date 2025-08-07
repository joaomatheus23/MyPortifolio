# Imagens dos Projetos

Para adicionar imagens dos seus projetos:

## Estrutura de pastas:
```
public/
  img/
    capaproject1.jpeg  # Imagem do primeiro projeto (Netflix Clone)
    project2.jpg       # Imagem do segundo projeto
    project3.jpg       # Imagem do terceiro projeto
    ...
```

## Como adicionar:

1. **Salve sua imagem** nesta pasta com o nome desejado
2. **Formatos aceitos:** JPG, PNG, WebP
3. **Tamanho recomendado:** 800x600px ou similar
4. **Atualize o caminho** no componente `Projects.tsx`:

```tsx
{
  id: 1,
  title: "Nome do Projeto",
  image: "/img/sua-imagem.jpg", // Caminho aqui
  // ... outras propriedades
}
```

## Imagens configuradas:
- `capaproject1.jpeg` - Netflix Clone (primeiro projeto)

## Dicas:
- Use imagens de alta qualidade
- Mantenha proporção 4:3 ou 16:9
- Otimize as imagens para web (compressão)
- Nomes de arquivo em minúsculas e sem espaços 
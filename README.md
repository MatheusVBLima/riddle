# Vigília

Vigília é um puzzlehunt de navegador em português, organizado pela estrutura da
Divina Comédia. São 30 fases de pesquisa, dedução e observação: Inferno,
Purgatório e Paraíso, com uma meta ao fim de cada cântica e um epílogo depois
das estrelas.

## Desenvolvimento

O projeto usa Bun exclusivamente:

```bash
bun install
bun run dev
```

Checks de implementação:

```bash
bun run typecheck
bun run lint
bun run test:meta
bun run test:bundle
bun run build
```

As respostas, dicas e soluções ficam em módulos `server-only` e são validadas
por server actions. O contrato canônico está em `lib/phases.ts`; os assets
originais da nova edição ficam em `public/dante`.

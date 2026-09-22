# Vigília — implementação da Comédia

## Contrato

O conteúdo das trinta fases vive em \`lib/phases.ts\), protegido por \`server-only\`. O cliente recebe apenas os dados necessários para renderizar o enunciado. Respostas, variantes, dicas, soluções, âncoras de pesquisa e referências editoriais não entram no bundle client.

Cada fase declara:

- \`cantica\`: \`inferno\`, \`purgatorio\` ou \`paradiso\`;
- \`unit\`: círculo, terraço, esfera ou meta;
- \`artifact\`: visual/áudio original usado como superfície de pista;
- \`researchTerms\`: termos de revisão autoral, mantidos no servidor;
- uma única \`hint\` e uma \`solution\`.

## Metas

- Fase 10: os nove círculos levam a \`PURGATÓRIO\`.
- Fase 20: antepurgatório, sete terraços e Paraíso terrestre levam a \`PARAÍSO\`.
- Fase 30: as nove esferas e os três finais levam a \`STELLE\`; o epílogo acrescenta a camada narrativa do amor.

A validação final continua sendo uma Server Action. As seis letras são conferidas no servidor antes de aceitar a palavra final.

## Pesquisa

As fases usam fatos reconhecíveis da obra e de sua cosmologia. O jogador não precisa de uma tradução única. A autoria deve confirmar cada âncora em pelo menos duas fontes e escrever a pista com palavras próprias.

Fontes úteis para revisão:

- [Dante Digital](https://digitaldante.columbia.edu/)
- [Dartmouth Dante Project](https://dante.dartmouth.edu/)
- [Project Gutenberg](https://www.gutenberg.org/)

## Visual e assets

A interface usa carvão, papel escuro e ocre. Os diagramas em \`components/phase-artifact.tsx\` são originais e os assets estáticos ficam em \`public/dante/\`:

- \`porta.svg\`;
- \`montanha.svg\`;
- \`esferas.svg\`;
- \`leitura-inferno-iii.ogg\` e \`leitura-inferno-v.ogg\`, leituras reais de Dante sob CC BY-SA 2.5;
- \`README.md\` registra atribuição e links das fontes musicais externas.

Regenerar com \`bun run assets:dante\`.

## Verificação

- \`bun run typecheck\`
- \`bun run lint\`
- \`bun run build\`
- \`bun run test:meta\`
- \`bun run test:bundle\`

O teste de invariantes confere a divisão 3×10, a ordem estrutural, as três metas, as dicas únicas e a existência dos assets. O scanner garante que respostas, dicas e soluções não foram parar ao cliente.

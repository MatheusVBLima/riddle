# Vigília — implementação da Comédia

## Contrato

O conteúdo das trinta fases vive em `lib/phases.ts`, protegido por `server-only`. O cliente recebe apenas os dados necessários para renderizar o enunciado e o formato da resposta. Respostas, variantes, dicas, soluções, âncoras de pesquisa e referências editoriais não entram no bundle client.

Cada fase declara:

- `cantica`: `inferno`, `purgatorio` ou `paradiso`;
- `unit`: círculo, terraço, esfera ou meta;
- `artifact`: visual/áudio original usado como superfície de pista;
- `researchTerms`: termos de revisão autoral, mantidos no servidor;
- `intermediates`: âncoras do caminho com uma orientação curta;
- uma única `hint` e uma `solution`.

## Sessão e progresso

`lib/session.ts` guarda o estado de servidor em cookies assinados com HMAC:

- `vigilia_progresso`: maior fase resolvida. `/f/n` só abre com `n ≤ progresso + 1`, e `/vigilia` exige a fase 30;
- `vigilia_dicas`: horário em que cada dica foi aberta. A solução abre dez minutos depois.

Variáveis de ambiente: `VIGILIA_SECRET` (obrigatória em produção; sem ela os cookies usam a chave de desenvolvimento) e `VIGILIA_UNLOCK_ALL=1` (abre todas as fases, só para desenvolvimento).

O localStorage continua guardando o histórico exibido pela interface: os anéis da home e o atalho de retorno.

## Metas

Cada meta extrai uma letra de cada resposta do seu bloco, na ordem da obra:

- Fase 10: as marcas dos nove anéis formam `EMISFERIO`.
- Fase 20: os algarismos das nove estações formam `RENASCIDO`.
- Fase 30: as marcas das nove esferas formam `AMOR CHE MO…`, o começo do último verso; a resposta é a palavra que fecha as três cânticas, `STELLE`. O acerto leva ao epílogo.

O material jogável vive em `lib/inferno-material.ts`, `lib/purgatorio-material.ts` e `lib/paradiso-material.ts`, e o teste de invariantes decodifica cada peça e confere as três extrações. A fase 30 usa o mesmo formulário das outras; a validação continua numa Server Action.

## Superfícies de pista

As pistas vivem na tela, no título da aba e na URL; nada exige inspecionar elemento. A página lê os parâmetros (`?nivel=`, `?grade=`, `?fumaca=`, `?muro=`, `?agua=`, `?exame=`, `?coro=`) e o título da aba vem de `artifactTitle` em `app/f/[n]/page.tsx`, só para fases já abertas. Duas fases mexem na aba pelo cliente (`components/tab-signals.tsx`): a 15 passa frases em ciclo e a 16 só fala quando a página está escondida.

## Pesquisa

As fases usam fatos reconhecíveis da obra e de sua cosmologia. O jogador não precisa de uma tradução única. A autoria deve confirmar cada âncora em pelo menos duas fontes e escrever a pista com palavras próprias.

Fontes úteis para revisão:

- [Dante Digital](https://digitaldante.columbia.edu/)
- [Dartmouth Dante Project](https://dante.dartmouth.edu/)
- [Project Gutenberg](https://www.gutenberg.org/)

## Visual e assets

A interface usa carvão e papel escuro, com um acento que muda por cântica: ocre na home, brasa no Inferno, safira no Purgatório e ouro pálido no Paraíso. O token é `--vigil-accent`, trocado pelo `data-cantica` do `<main>`; os SVGs usam `currentColor` para o acento.

Os diagramas em `components/phase-artifact.tsx` são originais e os assets estáticos ficam em `public/dante/`:

- `porta.svg`;
- `montanha.svg`;
- `esferas.svg`;
- `registro-a.ogg`, leitura real do canto III do *Inferno* sob CC BY-SA 2.5;
- `registro-c.wav`, tons em três alturas da fase 3, gerados de `lib/inferno-material.ts` por `bun run assets:audio`;
- `README.md` registra atribuição e links das fontes musicais externas.

Regenerar os SVGs com `bun run assets:dante`.

## Verificação

- `bun run typecheck`
- `bun run lint`
- `bun run build`
- `bun run test:meta`
- `bun run test:bundle`

O teste de invariantes confere a divisão 3×10, a ordem estrutural, as três metas, as dicas únicas, as âncoras intermediárias, a ausência das respostas nos componentes e SVGs e a existência dos assets. O scanner garante que respostas, dicas e soluções não foram parar no cliente.

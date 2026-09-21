# riddle

## O que é

Um jogo de enigmas de navegador com 30 fases. O jogador avança descobrindo que
qualquer parte da página pode ser pista: o texto, o título da aba, a URL, o
HTML, os nomes dos arquivos, as imagens, o áudio, os headers.

A filosofia é a de Notpron, Black Riddle e Ouverture Facile — observar,
investigar, pesquisar, transformar — mas com enigmas, respostas e cadeias
lógicas inteiramente originais.

## A sensação que o jogo persegue

> "Eu não fazia ideia do que precisava fazer... mas agora que descobri, faz
> todo sentido."

Esse "aha" vale mais do que dificuldade. Toda fase tem uma cadeia lógica
reconstruível. Nunca "como eu deveria adivinhar isso?".

## Estrutura

- Fases 1–5: introdução. Ensinam implicitamente que tudo pode ser pista.
- Fases 6–9: combinam duas fontes de pista.
- **Fase 10: primeiro meta-enigma.** Usa informação das fases anteriores por
  uma relação nova, não por concatenação.
- Fases 11–15: áudio, imagem, mapas, propriedades de arquivo.
- Fases 16–19: mídias e informações misturadas.
- **Fase 20: segundo meta-enigma.** Usa elementos de 11–19.
- Fases 21–25: múltiplas camadas.
- Fases 26–29: mecânicas já aprendidas em combinações novas.
- **Fase 30: meta final.** Detalhes que pareciam ambientação ganham sentido.

Dificuldade de 1 a 5 por fase. A curva não é linear: depois de uma fase muito
difícil, uma mais curta dá ritmo.

## Atmosfera

Misteriosa, digital, minimalista, um pouco inquietante, curiosa, inteligente.
Não é terror. O puzzle continua sendo o principal. A narrativa aparece em
fragmentos, nunca em blocos de exposição, e converge na fase 30.

## Regras que valem para toda fase

- Resposta inequívoca. O jogador sabe quando achou.
- Exatamente três níveis de dica: direção, mecânica, quase-solução. Depois
  disso, uma opção separada revela a solução completa.
- Sem red herrings deliberados. Decorativo pode existir, mas tem que parecer
  claramente decorativo.
- Sem dependência de ferramenta paga, plugin antigo ou site externo instável.
- Caminho alternativo quando a pista depende só de cor, áudio ou visão.

## Estado

Este repositório contém a base do jogo: rotas de fase, verificação de
resposta, sistema de dicas, progresso e a identidade visual. O conteúdo das 30
fases é especificado separadamente e entra pelo contrato em `lib/phases.ts`.

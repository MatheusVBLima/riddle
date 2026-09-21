# Vigília — referência de implementação

Fonte de design completa: [Caderno de Vigília](https://claude.ai/artifact/NVqg7DSeZAL9BYSU8sDrRb). Esta nota local registra os contratos e invariantes necessários ao código; não substitui as fichas completas do artifact.

## Regras que o código precisa preservar

- Uma dica por registro. A dica junta mecânica e direção; a solução completa continua atrás de uma ação separada.
- Respostas, variantes aceitas e soluções ficam em `lib/phases.ts`, protegido por `server-only`. Componentes client recebem somente o índice e resultados mínimos da server action.
- Resposta normalizada de forma exata. Nunca dar “quase” ou contagem de letras certas.
- Assets de enigma em `public/r/NN/`, servidos crus por `<img>`/`<audio>` e sem otimização que remova metadados.
- O símbolo da marca é a flor de oito pétalas em ocre. Deve aparecer no rodapé de todas as fases e junto de cada uma das nove lacunas, sem uso decorativo adicional.

## Conteúdo congelado e metas

Não revisar texto, acento, pontuação, espaços significativos, atributos ou markup destes grupos sem atualizar e conferir o meta correspondente:

- Registro 01 e registro 26: o diff entre eles precisa resultar exatamente em `VESTIGIO`.
- Registros 11–19: as letras intrusas, na ordem, formam `NOVEVEZES`; a leitura em espiral da fase 20 dá `NOVE VEZES`.
- Registros 02, 05, 08, 12, 15, 17, 22, 25 e 28: cada ausência sinalizada fornece, em ordem, `MARGARIDA`.
- Fases 15 e 28 compartilham o quadrado de Políbio; a planta e a cifra devem usar a mesma matriz. A célula de inventário B4 também carrega a divisão silábica da fase 29, sem mudar a letra pintada no piso.

## Respostas canônicas e propriedades

| Registro | Resposta | Letras |
| --- | --- | ---: |
| 01 | LUA | 3 |
| 02 | MAPA | 4 |
| 05 | ÁLBUM | 5 |
| 03 | PIRITA | 6 |
| 09 | CADERNO | 7 |
| 04 | TORNEIRA | 8 |
| 06 | CAMPAINHA | 9 |
| 07 | TERMÔMETRO | 10 |
| 08 | CALCULADORA | 11 |

Ordenar as nove respostas por comprimento e extrair a letra de mesmo índice produz `LABIRINTO` (fase 10). Os comprimentos de 3 a 11 são todos distintos e não podem mudar.

| Sistema | Fonte | Resultado obrigatório |
| --- | --- | --- |
| Erratas | 11–19, lidas em espiral na fase 20 | `NOVE VEZES` |
| Lacunas | 02=M, 05=A, 08=R, 12=G, 15=A, 17=R, 22=I, 25=D, 28=A | `MARGARIDA` |
| Espectrograma | PETALAS_18 `[1, 5, 3, 9, 2, 6, 11, 4]` indexa as 12 regras | `AUSENCIA` |
| Vigenère | `ABRA A GAVETA QUE NAO TEM PUXADOR`, chave `LABIRINTO` | saída da cifra da fase 17 |
| Políbio | matriz compartilhada pelas fases 15 e 28 | `A CHAVE ESTA NA PAGINA QUE NAO TEM NUMERO` |

## Estado desta implementação

O exemplo antigo das fases 01 e 02 divergia do design e foi substituído pelo conteúdo canônico. As fases 01–30 já têm fichas e assets locais; o teste visual em produção das fases novas ainda falta. Esta nota não é uma exportação integral do artifact.

## Confirmações e ajustes antes de concluir 21–30

- O artifact já confirma uma dica por fase: o resumo lista “DICAS — UMA POR FASE”, a seção global especifica uma só dica e cada ficha 21–30 traz “DICA ÚNICA”. Não foi necessário condensar as fichas.
- Registro 25: os rumos publicados (`047°, 122°, 211°, 298°, 012°`) não convergem perto de H8 quando traçados desde B3, H2, N6, M11 e E13; vários pares se cruzam fora da carta. O componente usa `131°, 179°, 250°, 300°, 032°`, que produz uma região de cruzamento pequena centrada em H8. O enunciado e a solução de design permanecem iguais.
- Registro 26: título, descrição, `lang`, classe, `aria-label` e rodapé carregam as sete inserções. Next App Router não oferece um `head.tsx` de página para o comentário literal; a página mantém o comentário em nó raw no corpo e fornece as duas versões selecionáveis lado a lado, na ordem da ficha, como alternativa acessível.
- Registro 30: as letras são validadas individualmente por Server Action; a ação final revalida as nove antes de aceitar o nome. As letras confirmadas podem ficar em `localStorage`, mas o servidor não confia nesse estado ao conferir a resposta final.

## Divergências corrigidas antes do congelamento

- Registro 17: o texto cifrado publicado no artifact não decifrava para a frase da solução com Vigenère e chave `LABIRINTO`. Foi substituído pelo resultado da fórmula que o próprio artifact especifica: `LBSI R ONOSEA RCV VNH HPM QCOIQHF`. `verify-meta-invariants.ts` recalcula e compara.
- Registro 18: a sequência descrita inicialmente nas pétalas divergia da sequência que o quadro de solução e o anexo usam para formar `AUSENCIA`. O WAV e a alternativa acessível usam a lista canônica do anexo: `1, 5, 3, 9, 2, 6, 11, 4`.
- Registro 19: o cookie de 14 letras, ao passar pela função literal do artifact, produzia dez letras; a resposta tem nove. O input foi alterado para `ZAFKAVTAPXAGW` (13 letras), que produz `CLARABOIA` sem mudar a função. O teste de invariantes confere o resultado.
- Registros 15 e 28: o artifact chama a planta de 23 cômodos, mas exige uma grade de piso com 25 posições B2–F6. A planta mantém 23 cômodos fechados por paredes e renderiza a matriz compartilhada de 25 posições como o bloco de piso da chave.

Os registros 11–19 estão marcados no código como conteúdo congelado. As erratas e as lacunas ficam protegidas por constantes e testes.

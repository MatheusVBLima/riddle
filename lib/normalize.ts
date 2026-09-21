/**
 * Normalização de resposta.
 *
 * O jogador não deve errar por acento, caixa, espaço ou hífen — só por não ter
 * resolvido o enigma. "Véu de Ísis", "veu de isis" e "VEU-DE-ISIS" são a mesma
 * resposta.
 *
 * O que sobra é só [a-z0-9], então a comparação é exata: nada de distância de
 * edição ou prefixo, que abririam espaço para força bruta.
 */
export function normalizeAnswer(raw: string): string {
  return raw
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
}

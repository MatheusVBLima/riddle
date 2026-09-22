/**
 * Material jogável das fases 11–20. As pistas vivem na tela, no título da aba
 * e na URL. Nada aqui contém respostas; o teste de invariantes decodifica cada
 * peça e confere que ela leva à âncora esperada.
 */

/** Fase 11: palavras latinas que só aparecem refletidas sob o horizonte. */
export const MIRRORED_LATIN = ["IUVENIS", "UNUS", "NOX", "CAELUM", "AURUM"] as const

/**
 * Fase 12: sete relevos do pavimento dos soberbos, descritos sem nome. Cada um
 * guarda a letra da posição indicada no nome português da figura.
 */
export const CARVINGS = [
  { riddle: "o que foi criado mais nobre que todos e caiu como um raio", position: 3 },
  { riddle: "a mãe que viu morrer os catorze filhos e virou pedra", position: 2 },
  { riddle: "a rainha que mergulhou a cabeça de Ciro em sangue", position: 3 },
  { riddle: "a tecelã que desafiou uma deusa e ficou presa à própria teia", position: 1 },
  { riddle: "o rei que fugiu num carro antes que alguém o perseguisse", position: 3 },
  { riddle: "o rei que morreu sobre a própria espada em Gelboé", position: 3 },
  { riddle: "o general que perdeu a cabeça dentro da própria tenda", position: 6 },
] as const

/** Fase 13: o rio só aparece na tela; quem vive nas margens, só na aba. */
export const RIVER_BANKS_TITLE = "vigília · 🐖 → 🐕 → 🐺 → 🦊"

/** Fase 14: três falas escondidas na fumaça. ?fumaca=0..100 regula a névoa. */
export const SMOKE_LINES = [
  "o mundo é cego, e tu vens dele",
  "vocês que vivem põem toda causa no céu",
  "se fosse assim, não haveria livre-arbítrio",
] as const

/** Lê ?fumaca=: sem valor válido, a fumaça fica inteira (100). */
export function smokeLevel(raw: string | undefined): number {
  if (!raw || !/^\d{1,3}$/.test(raw)) return 100
  return Math.min(100, Number.parseInt(raw, 10))
}

/** Cobre cada letra conforme a densidade; o mesmo nível cobre sempre as mesmas letras. */
export function throughSmoke(line: string, level: number, offset = 0): string {
  let letter = offset
  return [...line].map((char) => {
    if (!/\p{L}/u.test(char)) return char
    const covered = (letter * 37 + 11) % 100 < level
    letter++
    return covered ? "░" : char
  }).join("")
}

/** Fase 15: o que passa correndo pelo título da aba, em ciclo. */
export const RUNNING_TITLES = [
  "· · ·",
  "fui abade",
  "· · ·",
  "sob o bom barbarossa",
  "· · ·",
  "numa abadia de verona",
] as const

/** Fase 16: o que a aba diz só enquanto ninguém olha a página. */
export const HIDDEN_TITLE = "vigília · o monte tremeu e todos cantaram glória"

/**
 * Fase 17: frutos com sílabas e, no chão, sombras numeradas. Os raios são
 * paralelos (a sombra cai em x + (chão − y) × 0,9); um deles vem desenhado.
 */
export const FRUIT_GROUND = 260
export const FRUIT_SLOPE = 0.9
export const FRUITS = [
  { syllable: "GUIT", x: 116, y: 200 },
  { syllable: "NO", x: 89, y: 70 },
  { syllable: "NE", x: 242, y: 140 },
  { syllable: "TA", x: 260, y: 60 },
  { syllable: "TO", x: 458, y: 180 },
  { syllable: "RO", x: 485, y: 110 },
] as const
export const SHADOWS = [
  { x: 170, order: 4 },
  { x: 260, order: 1 },
  { x: 350, order: 6 },
  { x: 440, order: 2 },
  { x: 530, order: 5 },
  { x: 620, order: 3 },
] as const

/** Fase 18: o muro de fogo só se abre a um nome. */
export const FIRE_TEMPLATE = "?muro=········"
export const FIRE_NAMES = ["beatrice", "beatriz"] as const
export const FIRE_LINES = [
  "o melhor ferreiro da língua materna",
  "chora e vai cantando, numa língua que não é a tua",
] as const

export function fireOpens(raw: string | undefined): boolean | null {
  if (raw === undefined) return null
  const name = raw.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().trim()
  return (FIRE_NAMES as readonly string[]).includes(name)
}

/** Fase 19: ?agua=1 apaga o texto; ?agua=2 o devolve. */
export const WATER_TEXT = [
  "da mesma fonte saem duas águas.",
  "a primeira leva embora a lembrança da culpa.",
  "a segunda devolve a lembrança de cada bem feito.",
] as const

export function waterState(raw: string | undefined): "surface" | "forget" | "remember" | "unknown" {
  if (raw === undefined) return "surface"
  if (raw === "1") return "forget"
  if (raw === "2") return "remember"
  return "unknown"
}

/** Fase 20: posição da letra a extrair em cada estação, da praia ao jardim. */
export const STATION_INDICES = [2, 3, 3, 2, 1, 5, 6, 7, 4] as const

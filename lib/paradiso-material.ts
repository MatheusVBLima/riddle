/**
 * Material jogável das fases 21–30. As pistas vivem na tela, no título da aba
 * e na URL. Nada aqui contém respostas; o teste de invariantes decodifica cada
 * peça e confere que ela leva à âncora esperada.
 */

/**
 * Fase 21: seis superfícies da Lua, cada uma com manchas em algumas das seis
 * posições possíveis (1–3 na coluna esquerda, 4–6 na direita, de cima para baixo).
 */
export const MOON_SPOTS = [[1, 2], [1, 5], [1, 3, 4, 5], [1, 4, 5], [1], [2, 3, 4]] as const

/** Fase 22: o documento fica na tela; a chave (palavra.letra), só na aba. */
export const EAGLE_DOCUMENT =
  "A águia partiu de Troia com Eneias, cruzou Alba e pousou sobre Roma. Sob as suas asas vieram reis, cônsules e césares; um deles domou o Egito, outro fechou as portas da guerra. Depois dela, um imperador reuniu as leis num só corpo, e o mesmo emblema passou de bandeira em bandeira até perder o sentido nas mãos de quem brigava."
export const EAGLE_KEYS = ["III.I", "IV.II", "V.II", "VII.I", "II.II", "VIII.II", "XVIII.II", "XX.III", "VI.II"] as const
export const EAGLE_TITLE = "vigília · " + EAGLE_KEYS.join(" ")

/** Fase 23: grade 7×7 e três trajetórias (linha, coluna), cada uma do ponto cheio ao anel. */
export const ORBIT_GRID = ["OAVMGAM", "FATISNP", "ADCPSFS", "OOLBFGZ", "CEPNDSR", "VRNHVRO", "ZCELRNT"] as const
export const ORBIT_PATHS: readonly (readonly (readonly [number, number])[])[] = [
  [[0, 6], [0, 5], [5, 1], [1, 4], [4, 1], [6, 3], [5, 3], [0, 1]],
  [[1, 2], [5, 5], [5, 6], [5, 4], [2, 0], [2, 1], [3, 1], [6, 4]],
  [[3, 3], [1, 3], [4, 5], [1, 6], [3, 0]],
]

/** Fase 24: a coroa de doze luzes fica na tela; as iniciais, só na aba. */
export const CROWN_TITLE = "vigília · eu · a · g · p · s · d · o · b · i · b · r · ?"

/** Fase 25: pontos e traços ao longo da cruz; o braço vertical vem primeiro. */
export const CROSS_MORSE = {
  vertical: [".--.", ".-", "---"],
  horizontal: [".-", ".-..", "....", ".", "..", "---"],
} as const

/** Fase 26: espiral horária a partir do canto marcado; a célula vazia fecha o percurso. */
export const SPIRAL_ROWS = ["DILIGI", "IIUDIT", "URRACE", "QE·MAI", "MTSITU", "AITITS"] as const

/** Fase 27: degraus da escada, de baixo (1) para cima (12); a aba conta os que importam. */
export const LADDER_RUNGS = "SECODIVAESLN"
export const LADDER_TITLE = "vigília · 3 · 8 · 1 · 10 · 6 · 12 · 4"

/**
 * Fase 28: três símbolos de virtude, na ordem da tela. ?exame= recebe as
 * iniciais de quem examinou cada uma, na mesma ordem.
 */
export const EXAM_SYMBOLS = ["♥", "✝", "⚓"] as const
export const EXAM_TEMPLATE = "?exame=···"
export const EXAM_PASS_TITLE = "vigília · entrei neste céu pelo signo que me viu nascer"
export const EXAM_FAIL_TITLE = "vigília · a banca não aprova"

export function examPasses(raw: string | undefined): boolean | null {
  if (raw === undefined) return null
  return ["JPT", "GPG"].includes(raw.trim().toUpperCase())
}

/** Fase 29: ?coro=1..9 diz, na aba, o nome de cada círculo numa ordem antiga. */
export const CHOIR_TEMPLATE = "?coro=·"
export const OLD_CHOIR_ORDER = [
  "serafins",
  "querubins",
  "tronos",
  "dominações",
  "principados",
  "potestades",
  "virtudes",
  "arcanjos",
  "anjos",
] as const

export function choirTitle(raw: string | undefined): string | null {
  if (raw === undefined) return null
  const index = /^\d$/.test(raw) ? Number(raw) : 0
  const name = OLD_CHOIR_ORDER[index - 1]
  return name ? "vigília · coro " + index + " · " + name : "vigília · não há coro com esse número"
}

/** Fase 30: posição da letra a extrair em cada esfera, da Lua ao Primeiro Móvel. */
export const SPHERE_INDICES = [5, 3, 2, 6, 3, 5, 2, 3, 5] as const

/** Os três fins de percurso: cântica, canto e verso. */
export const ENDINGS = [
  { label: "PRIMEIRO PERCURSO", verse: "XXXIV · verso 139" },
  { label: "SEGUNDO PERCURSO", verse: "XXXIII · verso 145" },
  { label: "TERCEIRO PERCURSO", verse: "XXXIII · verso 145" },
] as const

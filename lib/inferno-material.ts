/**
 * Material jogável das fases 1–10: o que o jogador vê e transforma.
 *
 * As pistas vivem na tela, no título da aba e na URL. Este módulo nunca contém
 * respostas nem as âncoras em texto claro; o teste de invariantes decodifica
 * cada peça e confere que ela leva à âncora esperada.
 */

/** Fase 1: as quatro vozes do castelo, com o epíteto que o guia usa para cada uma. */
export const BROKEN_VOICES = [
  { mark: "I", epithet: "sovrano", initial: "O", length: 5 },
  { mark: "II", epithet: "satiro", initial: "O", length: 6 },
  { mark: "III", epithet: "il terzo", initial: "O", length: 6 },
  { mark: "IIII", epithet: "l'ultimo", initial: "L", length: 6 },
] as const

export const MARGIN_VOICE = { initial: "V", length: 8 } as const

/** Fase 2: folha deslocada três posições. */
export const SHIFTED_SHEET = "ULPLQL / GRLV QRPHV / XP OLYUR / YHQWR"

/**
 * Fase 3: cada batida tem uma de três alturas (1 grave, 2 média, 3 aguda).
 * Trios formam letras; grupos de trios formam palavras.
 */
export const PITCH_WORDS: readonly (readonly (readonly [number, number, number])[])[] = [
  [[2, 3, 2], [2, 3, 1], [3, 1, 1], [1, 2, 1], [2, 3, 1]],
  [[2, 2, 3], [1, 1, 2]],
  [[1, 2, 1], [1, 3, 3], [3, 2, 1], [3, 2, 2], [1, 1, 2]],
]

/** Fase 4: duas sequências entrelaçadas; a segunda corre no sentido oposto. */
export const CROSSING_STRIP = "PIELRRCUHBEETHICERNEIP"

/**
 * Fase 5: a fala dos que gorgolejam no Estige saiu às avessas e partida ao
 * meio. As letras de posição par sobem em bolhas na tela; as de posição ímpar
 * afundaram e ficam só no título da aba.
 */
export const SURFACE_BUBBLES = "INGAPII"
export const MUD_TITLE = "vigília · sob a lama: t e r o p l f"

/** Fase 6: pedra quadriculada (colunas A–F, linhas 1–6) e a leitura. */
export const STONE_COLUMNS = "ABCDEF"
export const STONE_ROWS = ["ENFUHN", "NOMMAV", "CTJXPN", "XNBTCF", "OJGLZR", "ZAOHIQ"] as const
export const STONE_READING = ["C2", "A5", "F1", "G4", "D4", "B6", "E3", "A1", "D0", "F5", "B3", "E6"] as const

/**
 * Fase 7: a placa só mostra a superfície e avisa que o endereço precisa de um
 * nível. Com ?nivel=1..3 na URL, cada nível troca o título da aba.
 */
export const RIVER_SURFACE = "para descer, o endereço precisa de um nível"
export const RIVER_DEPTHS = [
  "mil em volta do fosso, com arcos",
  "o do meio olha o próprio peito",
  "ele criou o filho de Tétis",
] as const

/** Nível pedido por ?nivel= (ou ?nível=); null quando ausente ou não numérico. */
export function levelFrom(query: Record<string, string | undefined>): number | null {
  const raw = query.nivel ?? query["nível"]
  return raw && /^\d+$/.test(raw) ? Number.parseInt(raw, 10) : null
}

/** Título da aba para um nível pedido pela URL; null quando nenhum foi pedido. */
export function riverTitle(level: number | null): string | null {
  if (level === null) return null
  return "vigília · " + (RIVER_DEPTHS[level - 1] ?? "o sangue não tem esse fundo")
}

/** Fase 8: dois canais alternados no mesmo registro. */
export const TWO_CHANNELS = "AULMEAMCDHAASMCAODLUUPNLAAS"

/**
 * Fase 9: quadrado 3×3 sem repetição por linha ou coluna. Os números são dias;
 * os vazios precisam ser deduzidos. A tela mostra só os dias; quem escreve a
 * grade completa em ?grade= recebe as letras no título da aba, linha a linha,
 * e ainda precisa reordená-las pelos dias.
 */
export const FROZEN_LETTERS = ["ORT", "FRE", "OME"] as const
export const FROZEN_DAYS: readonly (readonly (number | null)[])[] = [
  [2, null, 1],
  [null, 1, null],
  [1, null, null],
]
export const FROZEN_TEMPLATE = "?grade=·········"

/** Lê ?grade=: null sem parâmetro, false se não fecha, a grade se fecha. */
export function readFrozenGrid(raw: string | null): number[][] | false | null {
  if (raw === null) return null
  if (!/^[123]{9}$/.test(raw)) return false
  const grid = [0, 3, 6].map((start) => [...raw.slice(start, start + 3)].map(Number))
  const lines = [...grid, ...[0, 1, 2].map((column) => grid.map((row) => row[column]))]
  if (!lines.every((line) => new Set(line).size === 3)) return false
  const matchesDays = FROZEN_DAYS.every((row, r) => row.every((day, column) => day === null || grid[r][column] === day))
  return matchesDays ? grid : false
}

/** Título da aba da fase 9; null quando não há ?grade= no endereço. */
export function frozenTitle(raw: string | null): string | null {
  const grid = readFrozenGrid(raw)
  if (grid === null) return null
  if (grid === false) return "vigília · o gelo não cede"
  return "vigília · " + FROZEN_LETTERS.map((row) => row.toLowerCase()).join(" · ")
}

/** Fase 10: posição da letra a extrair em cada anel, do primeiro ao nono círculo. */
export const RING_INDICES = [2, 1, 2, 3, 1, 10, 4, 2, 6] as const

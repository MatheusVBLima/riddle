import "server-only"

/** Constantes compartilhadas pelos metas. Alterações exigem revisar as fichas. */
export const RESPOSTAS_1_9 = {
  "01": "LUA",
  "02": "MAPA",
  "03": "PIRITA",
  "04": "TORNEIRA",
  "05": "ÁLBUM",
  "06": "CAMPAINHA",
  "07": "TERMÔMETRO",
  "08": "CALCULADORA",
  "09": "CADERNO",
} as const

export const ERRATAS = {
  "11": ["inverno", "invenno", "N"],
  "12": ["relógio", "relóoio", "O"],
  "13": ["cofre", "covre", "V"],
  "14": ["assinatura", "essinatura", "E"],
  "15": ["garrafa", "garrava", "V"],
  "16": ["gaveta", "geveta", "E"],
  "17": ["prateleira", "prateleiza", "Z"],
  "18": ["janela", "jenela", "E"],
  "19": ["cortina", "sortina", "S"],
} as const

export const LACUNAS = {
  "02": "M",
  "05": "A",
  "08": "R",
  "12": "G",
  "15": "A",
  "17": "R",
  "22": "I",
  "25": "D",
  "28": "A",
} as const

export const QUADRADO_POLIBIO = [
  ["G", "U", "A", "R", "D"],
  ["B", "C", "E", "F", "H"],
  ["IJ", "K", "L", "M", "N"],
  ["O", "P", "Q", "S", "T"],
  ["V", "W", "X", "Y", "Z"],
] as const

export const ESPIRAL_20 = [
  [11, 12, 13],
  [18, 19, 14],
  [17, 16, 15],
] as const

/** Regras congeladas do registro 18; as iniciais são dados do enigma. */
export const REGRAS_VIGILIA = [
  "Acender só a luz do cômodo em que se está.",
  "Nada entra na casa sem ser pesado.",
  "Silêncio das 22h às 6h, inclusive o meu.",
  "Ao descer, a lanterna tem de estar carregada.",
  "Usar as duas mãos para o que é de vidro.",
  "Cada coisa volta para o lugar de onde saiu.",
  "Não copiar nome próprio nenhum.",
  "Pesar antes, etiquetar depois.",
  "Escrever a data antes de escrever qualquer coisa.",
  "Nunca contar em voz alta.",
  "Ir até a jenela uma vez por dia, mesmo sem vontade.",
  "Ir à janela de novo antes de dormir.",
] as const

export const PETALAS_18 = [1, 5, 3, 9, 2, 6, 11, 4] as const

/** Cifrado da fase 17, calculado pelo Vigenère descrito no caderno. */
export const CLARO_17 = "ABRA A GAVETA QUE NAO TEM PUXADOR"
export const CHAVE_17 = "LABIRINTO"
export const CIFRA_17 = "LBSI R ONOSEA RCV VNH HPM QCOIQHF"

/** Cookie ajustado a 13 letras para a função publicada devolver 9. */
export const COOKIE_19 = "ZAFKAVTAPXAGW"

export const CIFRA_28 = [
  [1, 3], [2, 2], [2, 5], [1, 3], [5, 1], [2, 3], [2, 3], [4, 4], [4, 5], [1, 3], [3, 5],
  [1, 3], [4, 2], [1, 3], [1, 1], [3, 1], [3, 5], [1, 3], [4, 3], [1, 2], [2, 3], [3, 5],
  [1, 3], [4, 1], [4, 5], [2, 3], [3, 4], [3, 5], [1, 2], [3, 4], [2, 3], [1, 4], [4, 1],
] as const

export const META_I_ANSWER = Object.values(RESPOSTAS_1_9)
  .sort((a, b) => a.length - b.length)
  .map((answer, index) => answer[index])
  .join("")

export const META_II_ANSWER = Object.values(ERRATAS)
  .map(([, , intruder]) => intruder)
  .join("")

export const META_FINAL_ANSWER = Object.entries(LACUNAS)
  .sort(([a], [b]) => Number(a) - Number(b))
  .map(([, letter]) => letter)
  .join("")

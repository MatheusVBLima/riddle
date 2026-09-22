import "server-only"

export const CANTICAS = ["inferno", "purgatorio", "paradiso"] as const
export type Cantica = (typeof CANTICAS)[number]

export const META_TRANSITIONS = {
  10: "EMISFERIO",
  20: "RENASCIDO",
  30: "STELLE",
} as const

export const INFERNO_CIRCLES = [
  "limbo",
  "luxúria",
  "gula",
  "avareza",
  "ira",
  "heresia",
  "violência",
  "fraude",
  "traição",
] as const

export const PURGATORIO_STATIONS = [
  "antepurgatório",
  "orgulho",
  "inveja",
  "ira",
  "preguiça",
  "avareza",
  "gula",
  "luxúria",
  "paraíso terrestre",
] as const

export const PARADISO_SPHERES = [
  "lua",
  "mercúrio",
  "vênus",
  "sol",
  "marte",
  "júpiter",
  "saturno",
  "estrelas fixas",
  "primum mobile",
] as const

/** Referências internas de revisão editorial; nunca chegam ao cliente. */
export const RESEARCH_REFERENCES = {
  inferno: ["Inf. I", "Inf. II", "Inf. V", "Inf. VI", "Inf. VII", "Inf. X", "Inf. XII", "Inf. XXVI", "Inf. XXXII–XXXIV"],
  purgatorio: ["Purg. I–II", "Purg. X–XII", "Purg. XIII", "Purg. XV", "Purg. XVII", "Purg. XIX", "Purg. XXIII", "Purg. XXV–XXVII", "Purg. XXVIII–XXXIII"],
  paradiso: ["Par. III", "Par. VI", "Par. VIII", "Par. X–XIII", "Par. XIV–XVII", "Par. XVIII–XX", "Par. XXI–XXII", "Par. XXIV–XXVI", "Par. XXVII–XXVIII"],
} as const

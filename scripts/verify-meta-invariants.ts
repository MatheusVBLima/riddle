import assert from "node:assert/strict"
import { existsSync, readdirSync, readFileSync } from "node:fs"

import {
  CANTICAS,
  INFERNO_CIRCLES,
  META_TRANSITIONS,
  PARADISO_SPHERES,
  PURGATORIO_STATIONS,
} from "@/lib/canon"
import * as material from "@/lib/inferno-material"
import * as paradiso from "@/lib/paradiso-material"
import * as purgatorio from "@/lib/purgatorio-material"
import { normalizeAnswer } from "@/lib/normalize"
import { answerShape, getPhase, intermediateFor, isCorrect, PHASE_COUNT } from "@/lib/phases"

assert.equal(PHASE_COUNT, 30)
assert.deepEqual(CANTICAS, ["inferno", "purgatorio", "paradiso"])
assert.deepEqual(INFERNO_CIRCLES, ["limbo", "luxúria", "gula", "avareza", "ira", "heresia", "violência", "fraude", "traição"])
assert.equal(PURGATORIO_STATIONS.length, 9)
assert.equal(PARADISO_SPHERES.length, 9)

for (let index = 1; index <= PHASE_COUNT; index++) {
  const phase = getPhase(index)
  assert.ok(phase, "fase " + index + " existe")
  assert.ok(phase.hint.trim(), "fase " + index + " tem uma dica")
  assert.ok(phase.solution.trim(), "fase " + index + " tem solução")
  assert.ok(phase.researchTerms.length >= 2, "fase " + index + " tem âncoras de pesquisa")
  assert.ok(phase.reference.trim(), "fase " + index + " tem referência editorial")
  assert.equal(phase.unidadeEstrutural, phase.unit, "fase " + index + " expõe a unidade estrutural")
  assert.deepEqual(phase.temaDePesquisa, phase.researchTerms, "fase " + index + " expõe o tema de pesquisa")
  assert.deepEqual(phase.variantesAceitas, phase.accepts ?? [], "fase " + index + " expõe as variantes aceitas")
  assert.equal(phase.referenciasVerificacao, phase.reference, "fase " + index + " mantém a referência no servidor")
  assert.equal("hints" in phase, false, "fase " + index + " não declara dicas em camadas")
  assert.ok(answerShape(index).length > 0, "fase " + index + " tem formato de resposta")

  for (const [key, message] of Object.entries(phase.intermediates ?? {})) {
    assert.equal(key, normalizeAnswer(key), "fase " + index + ": âncora " + key + " precisa estar normalizada")
    assert.ok(message.trim(), "fase " + index + ": âncora " + key + " tem orientação")
    assert.equal(isCorrect(index, key), false, "fase " + index + ": âncora " + key + " colide com uma resposta aceita")
    assert.equal(intermediateFor(index, key), message)
  }
}

// Nenhuma superfície renderizada pode escrever a resposta da fase.
function fold(value: string) {
  return value.normalize("NFD").replace(/\p{Diacritic}/gu, "").toUpperCase()
}
const surfaces = [
  ...readdirSync("components").filter((file) => file.endsWith(".tsx")).map((file) => "components/" + file),
  ...readdirSync("public/dante").filter((file) => file.endsWith(".svg")).map((file) => "public/dante/" + file),
  "lib/inferno-material.ts",
  "lib/purgatorio-material.ts",
  "lib/paradiso-material.ts",
]
const surfaceText = fold(surfaces.map((file) => readFileSync(file, "utf8")).join(" "))
for (let index = 1; index <= PHASE_COUNT; index++) {
  const phase = getPhase(index)
  if (!phase) continue
  for (const secret of [phase.answer, ...(phase.accepts ?? [])]) {
    const tokens = fold(secret).split(/[^A-Z0-9]+/).filter(Boolean)
    const matcher = new RegExp("(?:^|[^A-Z0-9])" + tokens.join("[^A-Z0-9]+") + "(?:$|[^A-Z0-9])")
    assert.equal(matcher.test(surfaceText), false, "resposta " + JSON.stringify(secret) + " da fase " + index + " aparece em um componente, SVG ou material")
  }
}

// O material do Inferno precisa levar às âncoras previstas pela autoria.
const shift = (text: string, by: number) =>
  text.replace(/[A-Z]/g, (letter) => String.fromCharCode(((letter.charCodeAt(0) - 65 + by + 26) % 26) + 65))
assert.equal(shift(material.SHIFTED_SHEET, -3), "RIMINI / DOIS NOMES / UM LIVRO / VENTO")

const pitchText = material.PITCH_WORDS.map((word) =>
  word.map(([a, b, c]) => String.fromCharCode(64 + (a - 1) * 9 + (b - 1) * 3 + (c - 1))).join("")
).join(" ")
assert.equal(pitchText, "PORCO NA CHUVA")

const odd = [...material.CROSSING_STRIP].filter((_, index) => index % 2 === 0).join("")
const even = [...material.CROSSING_STRIP].filter((_, index) => index % 2 === 1).reverse().join("")
assert.deepEqual([odd, even], ["PERCHETIENI", "PERCHEBURLI"])

const sunken = material.MUD_TITLE.split(":").pop()?.replace(/\s+/g, "").toUpperCase() ?? ""
assert.equal(sunken.length, material.SURFACE_BUBBLES.length, "a aba da fase 5 guarda a outra metade")
const mudSpeech = [...material.SURFACE_BUBBLES].map((letter, index) => letter + sunken[index]).join("")
assert.equal([...mudSpeech].reverse().join(""), "FILIPPOARGENTI")

const stoneReading = material.STONE_READING.map((coordinate) => {
  const column = material.STONE_COLUMNS.indexOf(coordinate[0])
  const row = Number(coordinate.slice(1))
  return column < 0 || row < 1 || row > material.STONE_ROWS.length ? "" : material.STONE_ROWS[row - 1][column]
}).join("")
assert.equal(stoneReading, "MONTAPERTI")

assert.equal(material.RIVER_DEPTHS.length, 3)
assert.ok(material.RIVER_SURFACE.includes("nível"), "a fase 7 precisa indicar o parâmetro na tela")
assert.equal(material.riverTitle(null), null)
assert.equal(material.riverTitle(2), "vigília · " + material.RIVER_DEPTHS[1])

const channels = [0, 1].map((channel) => [...material.TWO_CHANNELS].filter((_, index) => index % 2 === channel).join(""))
assert.deepEqual(channels, ["ALEMDASCOLUNAS", "UMACHAMADUPLA"])

// O quadrado da fase 9 precisa ter uma única solução compatível com os dias dados.
const permutations = [[1, 2, 3], [1, 3, 2], [2, 1, 3], [2, 3, 1], [3, 1, 2], [3, 2, 1]]
const squares: number[][][] = []
for (const a of permutations) for (const b of permutations) for (const c of permutations) {
  const square = [a, b, c]
  const columnsOk = [0, 1, 2].every((column) => new Set(square.map((row) => row[column])).size === 3)
  const cluesOk = material.FROZEN_DAYS.every((row, r) => row.every((day, column) => day === null || square[r][column] === day))
  if (columnsOk && cluesOk) squares.push(square)
}
assert.equal(squares.length, 1, "a grade da fase 9 precisa ter solução única")
const frozenReading = squares[0].map((row, r) => row.map((_, day) => material.FROZEN_LETTERS[r][row.indexOf(day + 1)]).join("")).join("")
assert.equal(frozenReading, "TORREFOME")

// A URL só solta as letras para a grade certa, escrita linha por linha.
const frozenDigits = squares[0].flat().join("")
assert.ok(material.readFrozenGrid(frozenDigits), "a grade resolvida precisa ser aceita em ?grade=")
assert.equal(material.readFrozenGrid(null), null)
for (const wrong of ["123123123", "231312132", "abc", "2313121234"]) {
  assert.equal(material.readFrozenGrid(wrong), false, "?grade=" + wrong + " não pode abrir o gelo")
}
assert.equal(material.frozenTitle(frozenDigits), "vigília · " + material.FROZEN_LETTERS.map((row) => row.toLowerCase()).join(" · "))
assert.equal(material.frozenTitle("111111111"), "vigília · o gelo não cede")

// Cada meta extrai uma letra de cada resposta do seu bloco, na ordem da obra.
function extract(indices: readonly number[], first: number) {
  return indices.map((position, offset) => {
    const answer = normalizeAnswer(getPhase(first + offset)?.answer ?? "")
    assert.ok(position <= answer.length, "fase " + (first + offset) + ": a posição " + position + " passa do fim da resposta")
    return answer[position - 1]
  }).join("")
}
assert.equal(extract(material.RING_INDICES, 1), normalizeAnswer(META_TRANSITIONS[10]), "a extração da meta 10 precisa formar a resposta")
assert.equal(extract(purgatorio.STATION_INDICES, 11), normalizeAnswer(META_TRANSITIONS[20]), "a extração da meta 20 precisa formar a resposta")
assert.equal(extract(paradiso.SPHERE_INDICES, 21), "amorchemo", "a extração da meta 30 precisa dar o começo do último verso")

// O material do Purgatório precisa levar às âncoras previstas pela autoria.
const latin: Record<string, string> = { IUVENIS: "JOVEM", UNUS: "UM", NOX: "NOITE", CAELUM: "CEU", AURUM: "OURO" }
assert.equal(purgatorio.MIRRORED_LATIN.map((word) => latin[word][0]).join(""), "JUNCO")

const carvingNames = ["LUCIFER", "NIOBE", "TOMIRIS", "ARACNE", "ROBOAO", "SAUL", "HOLOFERNES"]
assert.equal(purgatorio.CARVINGS.map((carving, index) => carvingNames[index][carving.position - 1]).join(""), "CIMABUE")

for (const beast of ["🐖", "🐕", "🐺", "🦊"]) assert.ok(purgatorio.RIVER_BANKS_TITLE.includes(beast))

assert.equal(purgatorio.smokeLevel(undefined), 100)
assert.equal(purgatorio.smokeLevel("0"), 0)
assert.equal(purgatorio.smokeLevel("abc"), 100)
for (const line of purgatorio.SMOKE_LINES) {
  assert.equal(purgatorio.throughSmoke(line, 0), line)
  assert.equal(/\p{L}/u.test(purgatorio.throughSmoke(line, 100)), false, "fumaça cheia cobre todas as letras")
}

for (const word of ["abade", "barbarossa", "verona"]) assert.ok(purgatorio.RUNNING_TITLES.some((title) => title.includes(word)))
assert.ok(purgatorio.HIDDEN_TITLE.includes("tremeu") && purgatorio.HIDDEN_TITLE.includes("glória"))

const byShadow = purgatorio.FRUITS.map((fruit) => {
  const x = fruit.x + (purgatorio.FRUIT_GROUND - fruit.y) * purgatorio.FRUIT_SLOPE
  const shadow = purgatorio.SHADOWS.find((candidate) => Math.abs(candidate.x - x) < 1)
  assert.ok(shadow, "o fruto " + fruit.syllable + " precisa ter sombra")
  return { order: shadow.order, syllable: fruit.syllable }
}).sort((a, b) => a.order - b.order)
assert.equal(byShadow.map((entry) => entry.syllable).join(""), "NOTAROGUITTONE")

assert.equal(purgatorio.fireOpens("Beatrice"), true)
assert.equal(purgatorio.fireOpens("beatriz"), true)
assert.equal(purgatorio.fireOpens("virgilio"), false)
assert.equal(purgatorio.fireOpens(undefined), null)
assert.deepEqual(["1", "2", undefined, "3"].map((raw) => purgatorio.waterState(raw)), ["forget", "remember", "surface", "unknown"])

// O material do Paraíso precisa levar às âncoras previstas pela autoria.
const braille: Record<string, string> = { "1,2": "B", "1,5": "E", "1,3,4,5": "N", "1,4,5": "D", "1": "A", "2,3,4": "S" }
assert.equal(paradiso.MOON_SPOTS.map((spots) => braille[spots.join(",")]).join(""), "BENDAS")

const romanValue = (roman: string) => {
  const values: Record<string, number> = { I: 1, V: 5, X: 10, L: 50 }
  return [...roman].reduce((total, char, index, all) => {
    const value = values[char]
    return values[all[index + 1]] > value ? total - value : total + value
  }, 0)
}
const documentWords = paradiso.EAGLE_DOCUMENT.split(/\s+/).map((word) => fold(word).replace(/[^A-Z]/g, ""))
const pilgrim = paradiso.EAGLE_KEYS.map((key) => {
  const [word, letter] = key.split(".").map(romanValue)
  return documentWords[word - 1][letter - 1]
}).join("")
assert.equal(pilgrim, "PEREGRINO")
assert.ok(paradiso.EAGLE_TITLE.endsWith(paradiso.EAGLE_KEYS.join(" ")))

assert.deepEqual(
  paradiso.ORBIT_PATHS.map((path) => path.map(([row, column]) => paradiso.ORBIT_GRID[row][column]).join("")),
  ["MARSELHA", "TROVADOR", "BISPO"]
)

assert.ok(paradiso.CROWN_TITLE.endsWith("a · g · p · s · d · o · b · i · b · r · ?"))

const morse: Record<string, string> = { ".-": "A", ".": "E", "....": "H", "..": "I", ".-..": "L", "---": "O", ".--.": "P" }
assert.equal(
  [paradiso.CROSS_MORSE.vertical, paradiso.CROSS_MORSE.horizontal].map((arm) => arm.map((code) => morse[code]).join("")).join(" "),
  "PAO ALHEIO"
)

const spiral: string[] = []
const spiralGrid = paradiso.SPIRAL_ROWS.map((row) => [...row])
let top = 0, left = 0, bottom = spiralGrid.length - 1, right = spiralGrid[0].length - 1
while (top <= bottom && left <= right) {
  for (let column = left; column <= right; column++) spiral.push(spiralGrid[top][column])
  top++
  for (let row = top; row <= bottom; row++) spiral.push(spiralGrid[row][right])
  right--
  for (let column = right; column >= left; column--) spiral.push(spiralGrid[bottom][column])
  bottom--
  for (let row = bottom; row >= top; row--) spiral.push(spiralGrid[row][left])
  left++
}
assert.equal(spiral.join(""), "DILIGITEIUSTITIAMQUIIUDICATISTERRAM·", "a espiral termina na casa vazia")

const rungs = paradiso.LADDER_TITLE.split("·").slice(1).map((value) => Number(value.trim()))
assert.equal(rungs.map((rung) => paradiso.LADDER_RUNGS[rung - 1]).join(""), "CASSINO")

assert.equal(paradiso.examPasses("jpt"), true)
assert.equal(paradiso.examPasses("PJT"), false)
assert.equal(paradiso.examPasses(undefined), null)
assert.equal(paradiso.choirTitle("5"), "vigília · coro 5 · principados")
assert.equal(paradiso.choirTitle("7"), "vigília · coro 7 · virtudes")
assert.equal(paradiso.choirTitle("0"), "vigília · não há coro com esse número")
assert.equal(paradiso.choirTitle(undefined), null)

const groups = [
  { name: "inferno", from: 1, to: 10 },
  { name: "purgatorio", from: 11, to: 20 },
  { name: "paradiso", from: 21, to: 30 },
] as const

for (const group of groups) {
  for (let index = group.from; index <= group.to; index++) {
    assert.equal(getPhase(index)?.cantica, group.name, "fase " + index + " está na cântica errada")
  }
}

assert.equal(getPhase(10)?.answer, META_TRANSITIONS[10])
assert.equal(getPhase(20)?.answer, META_TRANSITIONS[20])
assert.equal(getPhase(30)?.answer, META_TRANSITIONS[30])

assert.equal(existsSync("public/dante/porta.svg"), true)
assert.equal(existsSync("public/dante/montanha.svg"), true)
assert.equal(existsSync("public/dante/esferas.svg"), true)
assert.equal(existsSync("public/dante/registro-a.ogg"), true)
assert.equal(existsSync("public/dante/registro-c.wav"), true)
assert.equal(existsSync("public/dante/README.md"), true)
assert.ok(readFileSync("public/dante/porta.svg", "utf8").includes("Porta de três alturas"))
assert.ok(readFileSync("public/dante/README.md", "utf8").includes("CC BY-SA 2.5"))

console.log("Invariantes dantescos, três cânticas, metas, dicas únicas e assets conferidos.")

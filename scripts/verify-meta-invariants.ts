import assert from "node:assert/strict"
import { existsSync, readFileSync } from "node:fs"

import sharp from "sharp"

import {
  CHAVE_17,
  CIFRA_17,
  CIFRA_28,
  CLARO_17,
  COOKIE_19,
  ERRATAS,
  ESPIRAL_20,
  LACUNAS,
  META_FINAL_ANSWER,
  META_I_ANSWER,
  META_II_ANSWER,
  PETALAS_18,
  QUADRADO_POLIBIO,
  RESPOSTAS_1_9,
  REGRAS_VIGILIA,
} from "@/lib/canon"
import { BEARINGS_25 } from "@/lib/chart"
import { getPhase, PHASE_COUNT, verifyFinalReconstruction } from "@/lib/phases"

assert.equal(PHASE_COUNT, 30)
for (let index = 1; index <= PHASE_COUNT; index++) {
  const phase = getPhase(index)
  assert.ok(phase, `fase ${index} existe`)
  assert.equal(typeof phase.hint, "string", `fase ${index} tem uma dica`)
  assert.ok(phase.hint.trim().length > 0, `fase ${index} tem texto de dica`)
  assert.equal("hints" in phase, false, `fase ${index} não declara dicas em camadas`)
}

const answers = Object.values(RESPOSTAS_1_9)
const lengths = answers.map((answer) => answer.length).sort((a, b) => a - b)
assert.deepEqual(lengths, [3, 4, 5, 6, 7, 8, 9, 10, 11])
assert.equal(new Set(lengths).size, 9)
assert.equal(META_I_ANSWER, "LABIRINTO")
assert.equal(META_II_ANSWER, "NOVEVEZES")
assert.equal(META_FINAL_ANSWER, "MARGARIDA")
const orderedGapLetters = Object.entries(LACUNAS)
  .sort(([a], [b]) => Number(a) - Number(b))
  .map(([, letter]) => letter)
assert.equal(verifyFinalReconstruction(orderedGapLetters), true)
assert.equal(verifyFinalReconstruction(["M", "A", "R", "G", "A", "R", "I", "D", "X"]), false)
assert.deepEqual(ESPIRAL_20, [[11, 12, 13], [18, 19, 14], [17, 16, 15]])

const intrusionLetters = Object.values(ERRATAS).map(([, , letter]) => letter)
assert.equal(intrusionLetters.join(""), "NOVEVEZES")
assert.equal(
  Object.entries(LACUNAS)
    .sort(([a], [b]) => Number(a) - Number(b))
    .map(([, letter]) => letter)
    .join(""),
  "MARGARIDA"
)

const decoded = CIFRA_28
  .map(([row, column]) => {
    const cell = QUADRADO_POLIBIO[row - 1][column - 1]
    return cell === "IJ" ? "I" : cell
  })
  .join("")
assert.equal(decoded, "ACHAVEESTANAPAGINAQUENAOTEMNUMERO")

const petalInitials = PETALAS_18
  .map((position) => REGRAS_VIGILIA[position - 1][0])
  .join("")
assert.equal(petalInitials, "AUSENCIA")

function vigenere(text: string, key: string) {
  let keyIndex = 0
  return [...text]
    .map((character) => {
      if (!/[A-Z]/.test(character)) return character
      const shift = key.charCodeAt(keyIndex++ % key.length) - 65
      return String.fromCharCode(65 + ((character.charCodeAt(0) - 65 + shift) % 26))
    })
    .join("")
}

assert.equal(vigenere(CLARO_17, CHAVE_17), CIFRA_17)

const gridColumns = "ABCDEFGHIJKLMNOP"
const bearingPoints = BEARINGS_25.map((point) => ({
  ...point,
  x: gridColumns.indexOf(point.cell[0]) + 0.5,
  y: Number(point.cell.slice(1)) - 0.5,
  dx: Math.sin(point.degrees * Math.PI / 180),
  dy: -Math.cos(point.degrees * Math.PI / 180),
}))
const crossings: Array<{ x: number; y: number }> = []
for (let first = 0; first < bearingPoints.length; first++) {
  for (let second = first + 1; second < bearingPoints.length; second++) {
    const a = bearingPoints[first]
    const b = bearingPoints[second]
    const determinant = a.dx * b.dy - a.dy * b.dx
    if (Math.abs(determinant) < 0.001) continue
    const dx = b.x - a.x
    const dy = b.y - a.y
    const distance = (dx * b.dy - dy * b.dx) / determinant
    const otherDistance = (dx * a.dy - dy * a.dx) / determinant
    if (distance >= 0 && otherDistance >= 0) {
      crossings.push({ x: a.x + distance * a.dx, y: a.y + distance * a.dy })
    }
  }
}
assert.equal(crossings.length, 10)
const crossingCenter = {
  x: crossings.reduce((sum, point) => sum + point.x, 0) / crossings.length,
  y: crossings.reduce((sum, point) => sum + point.y, 0) / crossings.length,
}
assert.ok(Math.hypot(crossingCenter.x - 7.5, crossingCenter.y - 7.5) < 0.25)
assert.ok(Math.max(...crossings.map((point) => Math.hypot(point.x - crossingCenter.x, point.y - crossingCenter.y))) < 0.5)

function passPocket(input: string) {
  const letters = [...input.toUpperCase()].filter((character) => /[A-Z]/.test(character))
  return letters
    .map((character, index) =>
      String.fromCharCode(65 + ((character.charCodeAt(0) - 65 + (index % 7) + 1) % 26))
    )
    .reverse()
    .filter((_, index) => (index + 1) % 3 !== 0)
    .join("")
}

assert.equal(passPocket(COOKIE_19), "CLARABOIA")

for (const [index, [correct, incorrect, intruder]] of Object.entries(ERRATAS)) {
  const phase = getPhase(Number(index))
  assert.ok(phase, `fase ${index} existe`)
  assert.ok(phase.prompt.includes(incorrect), `fase ${index} preserva a grafia errada`)
  assert.ok(phase.prompt.includes(correct), `fase ${index} preserva a grafia correta`)
  assert.equal(correct.length, incorrect.length, `fase ${index} altera uma letra, sem inserção`)
  const differences = [...correct].filter((letter, position) => letter !== [...incorrect][position])
  assert.equal(differences.length, 1)
  assert.equal([...incorrect].find((letter, position) => letter !== [...correct][position]), intruder.toLowerCase())
}

const transmission = readFileSync("public/r/14/transmissao.wav")
assert.equal(transmission.length, 2_118_744)
assert.equal(transmission.toString("ascii", 0, 4), "RIFF")
const endDirectory = transmission.length - 22
assert.equal(transmission.readUInt32LE(endDirectory), 0x06054b50)
const centralDirectory = transmission.readUInt32LE(endDirectory + 16)
assert.equal(transmission.readUInt32LE(centralDirectory), 0x02014b50)
const localHeader = transmission.readUInt32LE(centralDirectory + 42)
assert.equal(transmission.readUInt32LE(localHeader), 0x04034b50)
assert.equal(transmission.toString("ascii", localHeader + 30, localHeader + 39), "pauta.svg")

const floorPlan = readFileSync("public/r/15/planta.svg", "utf8")
const roomIds = [...floorPlan.matchAll(/<g id="([A-J]\d{1,2})">/g)].map((match) => match[1])
assert.equal(roomIds.length, 23)
assert.ok(roomIds.includes("F7"))
const sealedRoom = floorPlan.match(/<g id="F7">([\s\S]*?)<\/g>/)?.[1]
assert.ok(sealedRoom)
assert.equal(sealedRoom.includes("vao"), false)
const phase15 = readFileSync("components/phase-artifact.tsx", "utf8")
assert.ok(phase15.includes('coordinate === "B4" ? "VÉS·PE·RA"'))

assert.equal(existsSync("public/r/22/i.png"), false)
assert.equal(Buffer.from("ZnVuZG8gZGEgZ2F2ZXRhLCBhbyBjb250csOhcmlv", "base64").toString("utf8"), "fundo da gaveta, ao contrário")
assert.ok(readFileSync("public/r/29/arepsev.svg", "utf8").includes("o título desta porta mente; conte as letras dele"))
assert.ok(readFileSync("public/r/28/selos.svg", "utf8").includes("c9944f"))
const nauticalChart = readFileSync("public/r/25/carta.svg", "utf8")
assert.ok(nauticalChart.includes("<title>Carta náutica da baía</title>"))
assert.ok(nauticalChart.includes("Na célula H8 há uma marca"))
assert.ok(nauticalChart.includes("sem bandeira"))
const flagPanelIndex = nauticalChart.indexOf("<g><g transform=\"translate(842 100)\">")
assert.ok(flagPanelIndex >= 0)
const flagPanel = nauticalChart.slice(flagPanelIndex)
for (const letter of "ABCDEFGHIJKLMNOPQRSTUVWXYZ") {
  assert.equal(flagPanel.includes(`>${letter}</text>`), letter !== "D", `cartela do código de sinais: ${letter}`)
}
assert.ok(readFileSync("components/phase-artifact.tsx", "utf8").includes('<BearingChart assetSrc="/r/25/carta.svg"'))
assert.ok(readFileSync("components/bearing-chart.tsx", "utf8").includes("assetSrc: string"))

const book = await sharp("public/r/28/livro.webp").metadata()
assert.ok((book.width ?? 0) >= 2400)
assert.ok(readFileSync("components/phase-artifact.tsx", "utf8").includes('note="guarda — 1968"'))

const imageA = await sharp("public/r/24/a.png").raw().toBuffer({ resolveWithObject: true })
const imageB = await sharp("public/r/24/b.png").raw().toBuffer({ resolveWithObject: true })
assert.deepEqual(imageA.info, imageB.info)
assert.equal(imageA.info.width, 1200)
assert.equal(imageA.info.height, 900)
const modifiedPixels = new Set<string>()
for (let pixel = 0; pixel < imageA.data.length; pixel += 3) {
  const delta = imageB.data[pixel] - imageA.data[pixel]
  if (delta !== 0) {
    assert.equal(delta, 14)
    assert.equal(imageB.data[pixel + 1] - imageA.data[pixel + 1], 14)
    assert.equal(imageB.data[pixel + 2] - imageA.data[pixel + 2], 14)
    const x = ((pixel / 3) % imageA.info.width)
    const y = Math.floor(pixel / 3 / imageA.info.width)
    modifiedPixels.add(`${x},${y}`)
  }
}
assert.ok(modifiedPixels.size > 500)
assert.ok(modifiedPixels.size < 600)

console.log("Invariantes de conteúdo, mídia, dicas únicas e metas 10, 20, 25, 28 e 30 conferidos.")

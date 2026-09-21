import { mkdirSync, writeFileSync } from "node:fs"
import { dirname } from "node:path"
import sharp from "sharp"

import { PETALAS_18, QUADRADO_POLIBIO } from "@/lib/canon"

const root = process.cwd()
const sampleRate = 44_100

function save(path: string, data: Uint8Array | string) {
  const target = `${root}/${path}`
  mkdirSync(dirname(target), { recursive: true })
  writeFileSync(target, data)
}

async function raster(path: string, svg: string, width: number, height: number, format: "webp" | "png" = "webp") {
  mkdirSync(dirname(`${root}/${path}`), { recursive: true })
  const image = sharp(Buffer.from(svg)).resize(width, height, { fit: "fill" })
  if (format === "png") await image.png({ compressionLevel: 9 }).toFile(`${root}/${path}`)
  else await image.webp({ quality: 94, effort: 6 }).toFile(`${root}/${path}`)
}

function wav(samples: Float32Array, rate = sampleRate) {
  const pcm = Buffer.alloc(samples.length * 2)
  for (let i = 0; i < samples.length; i++) {
    pcm.writeInt16LE(Math.round(Math.max(-1, Math.min(1, samples[i])) * 32_767), i * 2)
  }
  const header = Buffer.alloc(44)
  header.write("RIFF", 0)
  header.writeUInt32LE(36 + pcm.length, 4)
  header.write("WAVE", 8)
  header.write("fmt ", 12)
  header.writeUInt32LE(16, 16)
  header.writeUInt16LE(1, 20)
  header.writeUInt16LE(1, 22)
  header.writeUInt32LE(rate, 24)
  header.writeUInt32LE(rate * 2, 28)
  header.writeUInt16LE(2, 32)
  header.writeUInt16LE(16, 34)
  header.write("data", 36)
  header.writeUInt32LE(pcm.length, 40)
  return Buffer.concat([header, pcm])
}

const oghamGroups = [
  { side: "cross", count: 1 }, { side: "above", count: 1 }, { side: "right", count: 2 },
  { side: "left", count: 5 }, { side: "above", count: 3 }, { side: "cross", count: 2 },
  { side: "above", count: 1 }, { side: "right", count: 2 }, { side: "above", count: 1 },
]

function oghamSvg() {
  const stem = `<line x1="450" y1="38" x2="450" y2="762" stroke="#c6c0b4" stroke-width="4"/>`
  const groups = oghamGroups.map(({ side, count }, index) => {
    const y = 710 - index * 78
    return Array.from({ length: count }, (_, tick) => {
      const offset = (tick - (count - 1) / 2) * 8
      if (side === "cross") return `<path d="M405 ${y + offset + 9}L495 ${y + offset - 9}"/>`
      if (side === "above") return `<path d="M404 ${y + offset}h92"/>`
      if (side === "right") return `<path d="M450 ${y + offset}h46"/>`
      return `<path d="M404 ${y + offset}h46"/>`
    }).join("")
  }).join("\n")
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 800" role="img" aria-labelledby="t d">
<title id="t">Inscrição antiga em traços junto a uma linha central</title>
<desc id="d">Nove grupos de entalhes em relação a uma aresta vertical: à esquerda, à direita, acima e atravessando na diagonal.</desc>
<g fill="none" stroke="#c6c0b4" stroke-width="5" stroke-linecap="square">${stem}${groups}</g>
</svg>`
}

function roomPlanSvg() {
  const rooms = [
    "B2", "C2", "D2", "E2", "F2", "B3", "C3", "D3", "E3", "F3", "B4", "D4", "E4", "F4",
    "B5", "C5", "D5", "F5", "B6", "C6", "D6", "F6", "F7",
  ]
  const roomCells = rooms.map((id) => {
    const col = id.charCodeAt(0) - 65
    const row = Number(id.slice(1)) - 1
    const x = 150 + col * 74
    const y = 110 + row * 54
    const sealed = id === "F7"
    const door = sealed ? "" : `<path d="M${x + 23} ${y}h28" stroke="#0a0a0b" stroke-width="5"/><path d="M${x + 23} ${y}a28 28 0 0 1 28 28" fill="none" stroke="#69655d" stroke-width="1"/>`
    return `<g id="${id}"><rect x="${x}" y="${y}" width="74" height="54" fill="none" stroke="#ded8ca" stroke-width="2"/>${door}<text x="${x + 4}" y="${y + 50}" fill="#605d56" font-size="7" font-family="monospace">${id}</text></g>`
  }).join("\n")
  const key = QUADRADO_POLIBIO.map((row, rowIndex) => row.map((value, colIndex) => {
    const x = 150 + (colIndex + 1) * 74 + 37
    const y = 110 + (rowIndex + 1) * 54 + 31
    return `<text x="${x}" y="${y}" text-anchor="middle" fill="#8c877d" font-size="11" font-family="monospace">${value}</text>`
  }).join("")).join("")
  const columnLabels = "ABCDEFGHIJ".split("").map((letter, index) => {
    const x = 150 + index * 74 + 37
    const missing = letter === "A"
    const mark = missing
      ? `<g transform="translate(${x} 80)" fill="#c9944f">${Array.from({ length: 8 }, (_, petal) => `<ellipse cx="0" cy="-5" rx="2" ry="3" transform="rotate(${petal * 45})"/>`).join("")}<circle r="1.8"/></g>`
      : `<text x="${x}" y="84" text-anchor="middle" fill="#e9e4d8" font-size="13" font-family="monospace">${letter}</text>`
    return mark
  }).join("")
  const rowLabels = Array.from({ length: 10 }, (_, index) => `<text x="126" y="${143 + index * 54}" text-anchor="middle" fill="#e9e4d8" font-size="13" font-family="monospace">${index + 1}</text>`).join("")
  const backgroundGrid = Array.from({ length: 11 }, (_, index) => {
    const x = 150 + index * 74
    const y = 110 + index * 54
    return `<path d="M${x} 110v540M150 ${y}h740" stroke="#34332f" stroke-width="1"/>`
  }).join("")
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 930 700" role="img" aria-labelledby="t d">
<title id="t">Planta da casa com grade de referência de A a J e de 1 a 10</title>
<desc id="d">Vinte e três cômodos em uma grade de referência, incluindo F7 com paredes contínuas. As letras nas posições B2 a F6 formam uma grade cinco por cinco.</desc>
<rect width="930" height="700" fill="#0a0a0b"/><g>${backgroundGrid}</g><g>${roomCells}</g><g>${key}</g><g>${columnLabels}${rowLabels}</g>
</svg>`
}

function scoreSvg() {
  const notesY = [154, 216, 200, 177, 154]
  const notes = notesY.map((y, index) => {
    const x = 228 + index * 96
    const ledger = index === 1 ? `<line x1="${x - 19}" y1="${y}" x2="${x + 21}" y2="${y}" stroke="#333" stroke-width="2"/>` : ""
    return `${ledger}<ellipse cx="${x}" cy="${y}" rx="16" ry="10" fill="#222" transform="rotate(-20 ${x} ${y})"/>`
  }).join("")
  const lines = [110, 132, 154, 176, 198].map((y) => `<line x1="120" y1="${y}" x2="670" y2="${y}" stroke="#333" stroke-width="2"/>`).join("")
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 300" role="img" aria-labelledby="t d">
<title id="t">Pauta em clave de sol com cinco semibreves</title><desc id="d">Cinco cabeças ovais vazias distribuídas pela pauta; a segunda fica abaixo das linhas, com linha suplementar.</desc>
<rect width="720" height="300" fill="#f0ece2"/><path d="M71 218c-27-9-18-42 2-52 38-20 12-53 12-81m-18 81c28-8 33-39 7-45" fill="none" stroke="#333" stroke-width="5"/>${lines}${notes}</svg>`
}

function crc32(data: Buffer) {
  let crc = 0xffff_ffff
  for (const byte of data) {
    crc ^= byte
    for (let bit = 0; bit < 8; bit++) crc = (crc >>> 1) ^ (crc & 1 ? 0xedb8_8320 : 0)
  }
  return (crc ^ 0xffff_ffff) >>> 0
}

function wavWithZipPayload(baseWav: Buffer, svg: string, targetLength: number) {
  const name = Buffer.from("pauta.svg")
  const localLength = 30 + name.length
  const centralLength = 46 + name.length
  const contentLength = targetLength - baseWav.length - localLength - centralLength - 22
  const initial = Buffer.from(svg)
  if (initial.length > contentLength) throw new Error("pauta.svg excede o tamanho planejado")
  const content = Buffer.concat([initial, Buffer.alloc(contentLength - initial.length, 0x20)])
  const crc = crc32(content)

  const local = Buffer.alloc(localLength)
  local.writeUInt32LE(0x04034b50, 0)
  local.writeUInt16LE(20, 4)
  local.writeUInt32LE(crc, 14)
  local.writeUInt32LE(content.length, 18)
  local.writeUInt32LE(content.length, 22)
  local.writeUInt16LE(name.length, 26)
  name.copy(local, 30)

  const central = Buffer.alloc(centralLength)
  central.writeUInt32LE(0x02014b50, 0)
  central.writeUInt16LE(20, 4)
  central.writeUInt16LE(20, 6)
  central.writeUInt32LE(crc, 16)
  central.writeUInt32LE(content.length, 20)
  central.writeUInt32LE(content.length, 24)
  central.writeUInt16LE(name.length, 28)
  central.writeUInt32LE(baseWav.length, 42)
  name.copy(central, 46)

  const centralOffset = baseWav.length + local.length + content.length
  const eocd = Buffer.alloc(22)
  eocd.writeUInt32LE(0x06054b50, 0)
  eocd.writeUInt16LE(0, 4)
  eocd.writeUInt16LE(0, 6)
  eocd.writeUInt16LE(1, 8)
  eocd.writeUInt16LE(1, 10)
  eocd.writeUInt32LE(central.length, 12)
  eocd.writeUInt32LE(centralOffset, 16)
  eocd.writeUInt16LE(0, 20)
  return Buffer.concat([baseWav, local, content, central, eocd])
}

async function main() {
  const ogham = oghamSvg()
  save("public/r/11/inscricao.svg", ogham)
  const stone = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 900">
<defs><linearGradient id="stone" x2="1" y2="1"><stop stop-color="#85837b"/><stop offset=".45" stop-color="#514f4a"/><stop offset="1" stop-color="#292a29"/></linearGradient><filter id="grain"><feTurbulence baseFrequency=".75" numOctaves="2" seed="3"/><feColorMatrix values=".25 0 0 0 .3 .25 0 0 0 .3 .25 0 0 0 .3 0 0 0 .16 0"/></filter></defs>
<rect width="1200" height="900" fill="#171918"/><path d="M305 820 340 137 522 68 853 127 883 819Z" fill="url(#stone)" stroke="#a6a094" stroke-width="5"/><path d="M340 137 522 68 515 790 305 820Z" fill="#77756e" opacity=".22"/><path d="M518 115 838 164" stroke="#b0aa9d" stroke-width="8" opacity=".28"/><rect x="260" y="60" width="660" height="790" filter="url(#grain)" opacity=".2"/><g transform="translate(450 55) scale(.72 .96)">${ogham.match(/<g fill="none"[\s\S]*?<\/g>/)?.[0] ?? ""}</g></svg>`
  await raster("public/r/11/pedra.webp", stone, 1200, 900)

  const redLines = `<g fill="none" stroke="#fff" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"><path d="M290 105H510L480 300H320Z"/><path d="M320 300H480"/><path d="M400 305v70"/><path d="M388 365q12 20 24 0"/><path d="M300 430H500L470 700H330Z"/><path d="M314 470h18M310 490h22M307 510h25M304 530h29M301 550h33M298 570h38M295 590h42M292 610h46M289 630h50M286 650h54M283 670h58M280 690h62"/><path d="M612 470v115m-40-58h80m-70-41 60 82m0-82-60 82"/><path d="M680 610H756M680 620H756" stroke-width="4"/></g><g fill="#fff" font-family="monospace" font-size="20">${Array.from({ length: 12 }, (_, i) => `<text x="505" y="${478 + i * 18}">${i + 1}</text>`).join("")}</g><path d="M524 418H590" stroke="#fff" stroke-width="5"/>`
  const lineArt = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800"><rect width="800" height="800" fill="#000"/>${redLines}</svg>`
  const mask = await sharp(Buffer.from(lineArt)).resize(800, 800).greyscale().raw().toBuffer()
  const pixels = Buffer.alloc(800 * 800 * 3)
  let seed = 0x12a5_88
  for (let i = 0; i < 800 * 800; i++) {
    seed ^= seed << 13; seed ^= seed >>> 17; seed ^= seed << 5
    const noise = (seed >>> 0) / 0xffff_ffff
    pixels[i * 3] = Math.min(255, Math.floor(mask[i] * 0.94 + 10 + noise * 25))
    pixels[i * 3 + 1] = 30 + ((seed >>> 7) % 150)
    pixels[i * 3 + 2] = 45 + ((seed >>> 16) % 170)
  }
  mkdirSync(`${root}/public/r/12`, { recursive: true })
  await sharp(pixels, { raw: { width: 800, height: 800, channels: 3 } }).png({ compressionLevel: 9 }).toFile(`${root}/public/r/12/vitral.png`)

  const calibration = new Float32Array(sampleRate * 26)
  for (let second = 0; second < 26; second++) {
    if (second === 6) continue
    const frequency = 220 * 2 ** (second / 12)
    const start = second * sampleRate
    for (let n = 0; n < sampleRate; n++) {
      const fade = Math.min(1, n / 500, (sampleRate - n) / 500)
      calibration[start + n] = Math.sin(2 * Math.PI * frequency * n / sampleRate) * 0.23 * fade
    }
  }
  save("public/r/12/calibracao.wav", wav(calibration))

  const score = scoreSvg()
  const chord = new Float32Array(sampleRate * 3)
  for (let n = 0; n < chord.length; n++) {
    const time = n / sampleRate
    const decay = Math.exp(-time * 2.1)
    chord[n] = ([220, 293.66, 329.63, 392, 440].reduce((sum, frequency) => sum + Math.sin(2 * Math.PI * frequency * time) * decay, 0)) / 8
  }
  const baseWav = wav(chord)
  const transmission = wavWithZipPayload(baseWav, score, 2_118_744)
  if (transmission.length !== 2_118_744) throw new Error("tamanho de transmissao.wav divergente")
  save("public/r/14/transmissao.wav", transmission)

  const plan = roomPlanSvg()
  save("public/r/15/planta.svg", plan)

  const hatch = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 850"><defs><linearGradient id="wood" x2="1" y2="1"><stop stop-color="#746b5d"/><stop offset="1" stop-color="#292622"/></linearGradient></defs><rect width="1200" height="850" fill="#171715"/><path d="M260 80H930L865 742H325Z" fill="url(#wood)" stroke="#a69c89" stroke-width="12"/><path d="M325 742 470 160h390l5 582" fill="#090a0b" stroke="#baaf9b" stroke-width="8"/><path d="M470 160h392" stroke="#c0b7a7" stroke-width="8"/><path d="M495 190 810 720M810 190 495 720" stroke="#282725" stroke-width="12"/><circle cx="330" cy="755" r="20" fill="#171715"/><text x="600" y="800" fill="#9d988c" font-size="22" text-anchor="middle" font-family="monospace">o assoalho cedeu uma vez</text></svg>`
  await raster("public/r/16/alcapao.webp", hatch, 1200, 850)

  const frames: string[] = []
  const frameCols = 12
  for (let i = 0; i < 93; i++) {
    const x = 55 + (i % frameCols) * 91
    const y = 90 + Math.floor(i / frameCols) * 84
    const empty = i === 48
    const flower = Array.from({ length: 8 }, (_, petal) => `<ellipse cx="0" cy="-9" rx="5" ry="9" transform="rotate(${petal * 45})"/>`).join("")
    frames.push(`<g transform="translate(${x} ${y})"><rect width="68" height="58" fill="#d4d0c3" fill-opacity=".12" stroke="#b9b3a6" stroke-width="2"/>${empty ? `<text x="34" y="76" fill="#b9b3a6" font-size="8" text-anchor="middle" font-family="monospace">ausente</text>` : `<g transform="translate(34 28)" fill="#e3e0d5" stroke="#e3e0d5">${flower}<circle r="4"/></g><text x="34" y="76" fill="#8f897e" font-size="8" text-anchor="middle" font-family="monospace">${String(1934 + i).slice(-2)}.06.${String(i % 28 + 1).padStart(2, "0")}</text>`}</g>`)
  }
  const shelves = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800"><rect width="1200" height="800" fill="#1b1b18"/><path d="M25 58H1175M25 370H1175M25 682H1175M45 50v650M1155 50v650" stroke="#554d40" stroke-width="20"/><g>${frames.join("")}</g><text x="600" y="764" fill="#9d988c" font-size="16" text-anchor="middle" font-family="monospace">noventa e três molduras · noventa e duas plantas</text></svg>`
  await raster("public/r/16/estante.webp", shelves, 1200, 800)

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  const recta = Array.from({ length: 5 }, (_, row) => {
    const shift = row
    const values = alphabet.slice(shift) + alphabet.slice(0, shift)
    return `<text x="50" y="${145 + row * 27}" font-family="monospace" font-size="17" letter-spacing="6" fill="#171715">${values}</text>`
  }).join("")
  const brass = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 620 300"><rect x="8" y="8" width="604" height="284" rx="5" fill="#8e7854" stroke="#c7b590" stroke-width="8"/><rect x="25" y="25" width="570" height="250" fill="#b4a17b"/><g opacity=".72">${recta}</g><text x="50" y="56" font-size="14" fill="#443b2d" font-family="monospace">A  B  C  D  E · alfabetos deslocados</text><text x="50" y="270" font-size="11" fill="#554a38" font-family="monospace">uma chave abre todas as linhas</text></svg>`
  save("public/r/17/placa.svg", brass)

  const pressSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 470" role="img" aria-labelledby="t d"><title id="t">Armação de madeira com quatro gavetas</title><desc id="d">Uma prensa de duas tábuas, quatro parafusos-borboleta e gavetas no pé da armação. A quarta não tem puxador.</desc><g fill="none" stroke="#9d988c" stroke-width="5"><path d="M62 96H338M62 126H338M85 96V350M315 96V350M85 350H315M62 96 42 75m296 21 20-21M62 126l-20 21m296-21 20 21M50 64v24m300-24v24M50 135v24m300-24v24M110 350v55m60-55v55m60-55v55m60-55v55M96 405h208v35H96z"/><path d="M108 412h38v21h-38zM158 412h38v21h-38zM208 412h38v21h-38z"/></g><g fill="#9d988c"><circle cx="127" cy="422" r="3"/><circle cx="177" cy="422" r="3"/><circle cx="227" cy="422" r="3"/></g><rect x="258" y="412" width="38" height="21" fill="none" stroke="#9d988c"/><g fill="#514a3c" stroke="#c7b590"><circle cx="50" cy="76" r="12"/><circle cx="350" cy="76" r="12"/><circle cx="50" cy="147" r="12"/><circle cx="350" cy="147" r="12"/></g></svg>`
  save("public/r/17/prensa.svg", pressSvg)

  const alphabetic = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  const braille = [[1],[1,2],[1,4],[1,4,5],[1,5],[1,2,4],[1,2,4,5],[1,2,5],[2,4],[2,4,5],[1,3],[1,2,3],[1,3,4],[1,3,4,5],[1,3,5],[1,2,3,4],[1,2,3,4,5],[2,3,4],[2,4,5],[2,3,4,5],[1,3,6],[1,2,3,6],[2,4,5,6],[1,3,4,6],[1,3,4,5,6],[1,3,5,6]]
  const band = alphabetic.split("").map((letter, index) => {
    const x = 8 + index * 19.2
    const dots = index === 17 ? "" : braille[index].map((dot) => {
      const col = dot > 3 ? 1 : 0
      const row = (dot - 1) % 3
      return `<circle cx="${x + 5 + col * 7}" cy="${18 + row * 13}" r="2.4"/>`
    }).join("")
    const flower = index === 17 ? `<g transform="translate(${x + 8.5} 68)" fill="#c9944f">${Array.from({ length: 8 }, (_, petal) => `<ellipse cx="0" cy="-3" rx="1" ry="1.8" transform="rotate(${petal * 45})"/>`).join("")}<circle r="1"/></g>` : ""
    return `<g><rect x="${x}" y="8" width="17" height="52" fill="none" stroke="#68645b"/>${dots}${flower}</g>`
  }).join("")
  save("public/r/17/etiquetas.svg", `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 76" role="img" aria-labelledby="t"><title id="t">Fita de etiquetas em relevo</title><g fill="#e9e4d8">${band}</g></svg>`)

  const testWord = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 300"><rect width="720" height="300" fill="#aaa99f"/><path d="M72 35V255M72 255H690" stroke="#262522" stroke-width="2"/><g fill="#282725" font-family="monospace" font-size="16"><text x="26" y="48">kHz</text><text x="680" y="280">s</text><text x="82" y="286">tempo →</text><text x="18" y="80">alto</text><text x="18" y="242">grave</text></g><text x="255" y="174" fill="#e9e4d8" stroke="#222" stroke-width="3" paint-order="stroke" font-family="serif" font-weight="bold" font-size="84" letter-spacing="5">teste</text></svg>`
  await raster("public/r/18/impressao-exemplo.webp", testWord, 1440, 600)

  const petals = PETALAS_18
  const spectrogramMark = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 280 256"><rect width="280" height="256" fill="#000"/><g transform="translate(140 128)" fill="#fff" stroke="#fff">${petals.map((number, index) => {
    const angle = index * 45
    return `<g transform="rotate(${angle})"><ellipse cx="0" cy="-59" rx="19" ry="36"/><text x="0" y="-57" fill="#111" stroke="none" text-anchor="middle" dominant-baseline="central" font-family="sans-serif" font-weight="bold" font-size="${number > 9 ? 17 : 23}">${number}</text></g>`
  }).join("")}<circle r="24"/></g></svg>`
  const spec = await sharp(Buffer.from(spectrogramMark)).resize(280, 256).greyscale().raw().toBuffer()
  const duration = 40
  const spectrogram = new Float32Array(sampleRate * duration)
  const segmentSamples = sampleRate / 10
  for (let column = 0; column < 280; column++) {
    const rows: Array<{ frequency: number; strength: number }> = []
    for (let row = 0; row < 256; row++) {
      const strength = spec[row * 280 + column] / 255
      if (strength > 0.35) {
        const frequency = 7_000 * (300 / 7_000) ** (row / 255)
        rows.push({ frequency, strength })
      }
    }
    const start = sampleRate * 6 + Math.floor(column * segmentSamples)
    const scale = rows.length ? 0.62 / Math.sqrt(rows.length) : 0
    for (let offset = 0; offset < segmentSamples; offset++) {
      const fade = Math.min(1, offset / 160, (segmentSamples - offset) / 160)
      let sample = Math.sin(2 * Math.PI * 70 * offset / sampleRate) * 0.045
      for (const row of rows) sample += Math.sin(2 * Math.PI * row.frequency * offset / sampleRate) * scale * row.strength
      spectrogram[start + offset] = sample * fade
    }
  }
  save("public/r/18/prensa.wav", wav(spectrogram))

  const doorWindow = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 260 420"><defs><linearGradient id="light" x1="0" x2="1" y1="0" y2="1"><stop stop-color="#e9e4d8" stop-opacity=".36"/><stop offset="1" stop-color="#72aba3" stop-opacity="0"/></linearGradient></defs><path d="M66 32h128v310H66z" fill="none" stroke="#9d988c" stroke-width="4"/><path d="M84 48h92v272H84z" fill="url(#light)" stroke="#57544d"/><path d="M84 160h92M130 48v272" stroke="#57544d" stroke-width="3"/><path d="M130 48 26 388h104z" fill="#e9e4d8" opacity=".045"/></svg>`
  save("public/r/19/janela.svg", doorWindow)

  save("public/r/19/vigia.js", `// A lógica fica à mostra. O que entra nela é que não.\nwindow.vigia = window.vigia || {};\nwindow.vigia.passar = function passar(s) {\n  const letras = [...s.toUpperCase()].filter(c => /[A-Z]/.test(c));\n  const gira = letras.map((c, i) =>\n    String.fromCharCode(65 + ((c.charCodeAt(0) - 65) + (i % 7) + 1) % 26));\n  return gira.reverse().filter((_, i) => (i + 1) % 3 !== 0).join(\"\");\n};\n`)

  save("public/r/15/planta.svg", plan)
  console.log(`Assets 11–19 gerados; a planta tem 23 cômodos e a transmissão tem ${transmission.length.toLocaleString("pt-BR")} bytes.`)
}

await main()

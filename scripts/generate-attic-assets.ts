import { mkdirSync, writeFileSync } from "node:fs"

import sharp from "sharp"

const root = "public/r"

function saveSvg(path: string, svg: string) {
  writeFileSync(path, svg)
}

async function saveWebp(path: string, svg: string) {
  await sharp(Buffer.from(svg)).webp({ quality: 94, effort: 6 }).toFile(path)
}

function frame(width: number, height: number, body: string) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${body}</svg>`
}

async function makeArchiveLabels() {
  mkdirSync(`${root}/22`, { recursive: true })
  const alphabet = "abcdefghijklmnopqrstuvwxyz"
  for (const [index, letter] of [...alphabet].entries()) {
    if (letter === "i") continue
    const hue = (index * 31 + 18) % 360
    const svg = frame(96, 96, `<rect width="96" height="96" fill="#111315"/><rect x="8" y="8" width="80" height="80" rx="2" fill="hsl(${hue},18%,18%)" stroke="#a69d8d"/><path d="M16 24h64M16 72h64" stroke="#544f46"/><text x="48" y="62" fill="#e9e4d8" text-anchor="middle" font-family="serif" font-size="43">${letter}</text>`)
    await sharp(Buffer.from(svg)).png().toFile(`${root}/22/${letter}.png`)
  }

  const drawer = frame(1600, 1000, `
    <defs>
      <linearGradient id="wall" x2="0" y2="1"><stop stop-color="#171513"/><stop offset="1" stop-color="#090a0a"/></linearGradient>
      <linearGradient id="wood" x2="0" y2="1"><stop stop-color="#75573b"/><stop offset=".55" stop-color="#4e3928"/><stop offset="1" stop-color="#2e241c"/></linearGradient>
      <linearGradient id="inside" x2="0" y2="1"><stop stop-color="#171410"/><stop offset="1" stop-color="#33271c"/></linearGradient>
    </defs>
    <rect width="1600" height="1000" fill="url(#wall)"/>
    <path d="M100 170h1370v590H100z" fill="#24201b" stroke="#544438" stroke-width="10"/>
    <path d="M170 244h1220v395H170z" fill="#171411" stroke="#7d6042" stroke-width="16"/>
    <path d="M250 300h1050l-120 270H370z" fill="url(#inside)" stroke="#80603f" stroke-width="10"/>
    <path d="M170 640h1220l160 155H20z" fill="url(#wood)" stroke="#9b7650" stroke-width="12"/>
    <path d="M44 716h1510M100 767h1370" stroke="#34271d" stroke-width="9" opacity=".75"/>
    <path d="M230 333h985M294 398h873M356 462h760" stroke="#5e4934" stroke-width="3" opacity=".5"/>
    <circle cx="1280" cy="690" r="26" fill="#aa8052"/><circle cx="1280" cy="690" r="9" fill="#291e14"/>
    <g transform="translate(185 824) rotate(-4)">
      <rect width="1210" height="74" fill="#d7c9a5" stroke="#392b1c" stroke-width="6"/>
      <path d="M24 0v40m52-40v24m52-24v40m52-40v24m52-24v40m52-40v24m52-24v40m52-40v24m52-24v40m52-40v24m52-24v40m52-40v24m52-24v40m52-40v24m52-24v40m52-40v24m52-24v40m52-40v24m52-24v40m52-40v24m52-24v40m52-40v24m52-24v40" stroke="#352a20" stroke-width="4"/>
      <text x="22" y="64" fill="#2b241b" font-family="monospace" font-size="29">0</text><text x="552" y="64" fill="#2b241b" font-family="monospace" font-size="29">31 cm</text><text x="1080" y="64" fill="#2b241b" font-family="monospace" font-size="29">42 cm</text>
    </g>
    <text x="115" y="120" fill="#aaa394" font-family="serif" font-size="28">gaveta · arquivo</text>
  `)
  await saveWebp(`${root}/22/osaflaf-odnuf.webp`, drawer)
}

async function makeCalendarStrip() {
  mkdirSync(`${root}/23`, { recursive: true })
  const months = [31, 28, 31, 30, 31, 30, 31, 30, 30, 31, 30, 31]
  const names = ["âncora", "vidro", "selo", "cal", "fita", "chumbo", "esmalte", "obturador", "verniz", "estopa", "arame", "gesso"]
  const cells = months.map((value, index) => `<g transform="translate(${54 + index * 114} 0)"><text y="140" text-anchor="middle" fill="#24201a" font-family="monospace" font-size="30">${value}</text><text y="198" text-anchor="middle" fill="#655844" font-family="serif" font-size="18">${index + 1}</text></g>`).join("")
  const items = names.map((value, index) => `<text x="${80 + (index % 4) * 360}" y="${278 + Math.floor(index / 4) * 40}" fill="#30291f" font-family="monospace" font-size="21">${String(index + 1).padStart(2, "0")} · ${value}</text>`).join("")
  await saveWebp(`${root}/23/tira.webp`, frame(1500, 420, `<rect width="1500" height="420" fill="#d7c9a5"/><path d="M0 22h1500M0 228h1500M0 398h1500" stroke="#85775e"/><text x="38" y="75" fill="#605543" font-family="serif" font-size="24">DOZE MESES · 1997</text>${cells}${items}<text x="1390" y="75" fill="#605543" font-family="serif" font-size="18">Z.</text>`))
}

async function makeDifferencePhotos() {
  mkdirSync(`${root}/24`, { recursive: true })
  const width = 1200
  const height = 900
  const channels = 3
  const base = Buffer.alloc(width * height * channels)
  let seed = 240124
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      seed = (seed * 1664525 + 1013904223) >>> 0
      const noise = (seed >>> 29) & 3
      const band = y > 610 && y < 642 ? 4 : 0
      const i = (y * width + x) * channels
      base[i] = 5 + noise + band
      base[i + 1] = 7 + noise + band
      base[i + 2] = 12 + noise + band
    }
  }
  const city = [[75, 632], [124, 616], [193, 630], [244, 604], [311, 625], [380, 611], [468, 631], [540, 600], [621, 625], [720, 613], [812, 633], [904, 606], [1010, 628], [1118, 616]] as const
  for (const [cx, cy] of city) {
    for (let y = cy - 2; y <= cy + 2; y++) for (let x = cx - 2; x <= cx + 2; x++) {
      const i = (y * width + x) * channels
      base[i] = 25; base[i + 1] = 24; base[i + 2] = 19
    }
  }
  const backgroundStars = [[116, 148], [156, 284], [270, 192], [364, 116], [902, 184], [1022, 288], [1114, 154], [841, 130], [522, 242], [667, 174], [735, 112], [356, 285], [1081, 364], [209, 102], [911, 332]] as const
  for (const [cx, cy] of backgroundStars) {
    const i = (cy * width + cx) * channels
    base[i] = 42; base[i + 1] = 45; base[i + 2] = 54
  }

  const targetStars = [[214, 402, 7], [318, 366, 7], [408, 388, 4], [470, 330, 4], [560, 352, 4], [646, 300, 4], [742, 336, 4]] as const
  const changed = Buffer.from(base)
  for (const [cx, cy, radius] of targetStars) {
    for (let y = cy - radius; y <= cy + radius; y++) for (let x = cx - radius; x <= cx + radius; x++) {
      if ((x - cx) ** 2 + (y - cy) ** 2 > radius ** 2) continue
      const i = (y * width + x) * channels
      for (let channel = 0; channel < channels; channel++) changed[i + channel] = Math.min(255, base[i + channel] + 14)
    }
  }
  await sharp(base, { raw: { width, height, channels } }).png({ compressionLevel: 9, adaptiveFiltering: false }).toFile(`${root}/24/a.png`)
  await sharp(changed, { raw: { width, height, channels } }).png({ compressionLevel: 9, adaptiveFiltering: false }).toFile(`${root}/24/b.png`)
}

async function makeManuscript() {
  mkdirSync(`${root}/27`, { recursive: true })
  const lines = [
    "romance de —, publicado em —, em 1881.",
    "o narrador conta a própria vida em capítulos curtíssimos,",
    "alguns de três linhas, e interrompe a história para falar",
    "com quem está lendo. o livro é dedicado ao verme que roeu",
    "as frias carnes do seu cadáver. o narrador só pôde escrever",
    "porque já estava morto: ele morreu primeiro e escreveu depois.",
    "foi copiado nesta casa em 19 noites.",
  ]
  const writing = lines.map((line, index) => `<text x="135" y="${286 + index * 111}" fill="#342d25" font-family="serif" font-style="italic" font-size="39" letter-spacing="1.5">${line}</text>`).join("")
  const svg = frame(1600, 1250, `<rect width="1600" height="1250" fill="#d8ccb0"/><rect x="28" y="28" width="1544" height="1194" fill="none" stroke="#aa9b7c" stroke-width="3"/><path d="M110 150v1000" stroke="#bd8270" stroke-width="2" opacity=".7"/>${Array.from({ length: 10 }, (_, i) => `<path d="M90 ${210 + i * 111}h1430" stroke="#91a6a0" stroke-opacity=".42"/>`).join("")}${writing}<text x="1330" y="1180" fill="#584c3b" font-family="serif" font-size="28">Z. · 19 noites</text>`)
  await saveWebp(`${root}/27/copia.webp`, svg)
}

async function makeBookAndSeals() {
  mkdirSync(`${root}/28`, { recursive: true })
  const pages = Array.from({ length: 9 }, (_, index) => `<text x="${570 + (index % 3) * 195}" y="${330 + Math.floor(index / 3) * 176}" fill="#776d5d" font-family="serif" font-size="20">${index + 1}</text>`).join("")
  const book = frame(2600, 1700, `
    <defs><linearGradient id="paper" x2="0" y2="1"><stop stop-color="#e8dfc9"/><stop offset="1" stop-color="#cbbd9f"/></linearGradient><linearGradient id="cover" x2="1" y2="1"><stop stop-color="#33251d"/><stop offset="1" stop-color="#1c1714"/></linearGradient></defs>
    <rect width="2600" height="1700" fill="#171615"/>
    <rect x="260" y="164" width="2070" height="1380" rx="26" fill="url(#cover)" stroke="#765738" stroke-width="22"/>
    <path d="M480 300h810v1050H480z" fill="url(#paper)" stroke="#a99572" stroke-width="12"/>
    <path d="M1310 300h800v1050h-800z" fill="url(#paper)" stroke="#a99572" stroke-width="12"/>
    <path d="M1290 300v1050" stroke="#49372a" stroke-width="26"/><path d="M1304 320v1010" stroke="#b9a580" stroke-width="4"/>
    ${Array.from({ length: 11 }, (_, i) => `<path d="M540 ${410 + i * 78}h680M1370 ${410 + i * 78}h660" stroke="#91a6a0" stroke-opacity=".5" stroke-width="3"/>`).join("")}
    ${pages}
    <path d="M290 300h135q55 0 55 58v1018q0 58-55 58H290z" fill="#d9ceb7" stroke="#a99572" stroke-width="8"/>
    <path d="M336 370h112" stroke="#9f8f71" stroke-width="4"/><path d="M345 394h92" stroke="#9f8f71" stroke-width="2"/>
    <text x="342" y="1370" fill="#4e473d" font-family="serif" font-style="italic" font-size="36" transform="rotate(-4 342 1370)">guarda — 1968</text>
    <text x="2120" y="1450" fill="#a99572" font-family="monospace" font-size="24">livro de registro</text>
  `)
  await saveWebp(`${root}/28/livro.webp`, book)

  const cells = Array.from({ length: 26 }, (_, index) => {
    const x = 8 + index * 39
    if (index === 0) return `<g><rect x="${x}" y="18" width="32" height="96" fill="none" stroke="#777166" stroke-dasharray="4 3"/>${Array.from({ length: 8 }, (_, petal) => `<ellipse cx="${x + 28}" cy="20" rx="1.6" ry="2.4" fill="#c9944f" transform="rotate(${petal * 45} ${x + 28} 20)"/>`).join("")}</g>`
    const shift = (index * 7) % 4
    return `<g stroke="#e9e4d8" stroke-width="2" fill="none"><rect x="${x}" y="18" width="32" height="96" stroke="#777166"/><path d="M${x + 6} ${36 + shift * 2}h20M${x + 8} ${53 + shift * 2}h16M${x + 7} ${70 + shift * 2}h18"/></g>`
  }).join("")
  saveSvg(`${root}/28/selos.svg`, frame(1040, 150, `<rect width="1040" height="150" fill="#0a0a0b"/>${cells}`))
}

function doorSvg() {
  return frame(400, 700, `<title>a véspera de nada</title><desc>o título desta porta mente; conte as letras dele</desc><path d="M42 662V92Q200 12 358 92v570Z" fill="#171717" stroke="#9d988c" stroke-width="3"/><path d="M78 662V118Q200 58 322 118v544Z" fill="#0a0a0b" stroke="#514f49" stroke-width="2"/><circle cx="291" cy="393" r="9" fill="#c9944f"/><path d="M0 650H400" stroke="#e9e4d8" stroke-opacity=".28" stroke-width="8"/><path d="M22 648H378" stroke="#c9944f" stroke-opacity=".55" stroke-width="2"/>`)
}

function signalFlag(letter: string, x: number, y: number) {
  const blue = "#244986"
  const red = "#b8292f"
  const yellow = "#e8c944"
  const ivory = "#f5f1e8"
  const black = "#171717"
  const box = `<rect width="44" height="33" fill="${ivory}"/>`
  let design = ""

  switch (letter) {
    case "A":
      design = `<path d="M0 0h44v9l-8 7.5 8 7.5v9H0z" fill="${ivory}"/><path d="M22 0h22v9l-8 7.5 8 7.5v9H22z" fill="${blue}"/>`
      break
    case "B":
      design = `<path d="M0 0h44v9l-8 7.5 8 7.5v9H0z" fill="${red}"/>`
      break
    case "C":
      design = [blue, ivory, red, ivory, blue].map((color, index) => `<rect y="${index * 6.6}" width="44" height="6.7" fill="${color}"/>`).join("")
      break
    case "D":
      design = `<rect width="44" height="33" fill="none" stroke="#777166" stroke-dasharray="4 3"/><title>sem bandeira</title>${Array.from({ length: 8 }, (_, petal) => `<ellipse cx="0" cy="-2" rx="1.3" ry="2" fill="#c9944f" transform="translate(39 4) rotate(${petal * 45})"/>`).join("")}<circle cx="39" cy="4" r="1.2" fill="#c9944f"/>`
      break
    case "E":
      design = `<rect width="44" height="16.5" fill="${blue}"/><rect y="16.5" width="44" height="16.5" fill="${red}"/>`
      break
    case "F":
      design = `${box}<path d="M22 3 39 16.5 22 30 5 16.5Z" fill="${red}"/>`
      break
    case "G":
      design = Array.from({ length: 6 }, (_, index) => `<rect x="${index * (44 / 6)}" width="${44 / 6 + 0.2}" height="33" fill="${index % 2 ? blue : yellow}"/>`).join("")
      break
    case "H":
      design = `<rect width="22" height="33" fill="${ivory}"/><rect x="22" width="22" height="33" fill="${red}"/>`
      break
    case "I":
      design = `<rect width="44" height="33" fill="${yellow}"/><circle cx="22" cy="16.5" r="8" fill="${black}"/>`
      break
    case "J":
      design = `<rect width="44" height="11" fill="${blue}"/><rect y="11" width="44" height="11" fill="${ivory}"/><rect y="22" width="44" height="11" fill="${blue}"/><rect x="15" y="9" width="14" height="15" fill="${ivory}"/>`
      break
    case "K":
      design = `<rect width="22" height="33" fill="${yellow}"/><rect x="22" width="22" height="33" fill="${blue}"/>`
      break
    case "L":
      design = `<rect width="22" height="16.5" fill="${yellow}"/><rect x="22" width="22" height="16.5" fill="${black}"/><rect y="16.5" width="22" height="16.5" fill="${black}"/><rect x="22" y="16.5" width="22" height="16.5" fill="${yellow}"/>`
      break
    case "M":
      design = `<rect width="44" height="33" fill="${blue}"/><path d="M0 0 44 33M44 0 0 33" stroke="${ivory}" stroke-width="8"/>`
      break
    case "N":
      design = Array.from({ length: 16 }, (_, index) => `<rect x="${(index % 4) * 11}" y="${Math.floor(index / 4) * 8.25}" width="11" height="8.25" fill="${(index % 4 + Math.floor(index / 4)) % 2 ? blue : ivory}"/>`).join("")
      break
    case "O":
      design = `<path d="M0 0h44L0 33z" fill="${yellow}"/><path d="M44 0v33H0z" fill="${red}"/>`
      break
    case "P":
      design = `<rect width="44" height="33" fill="${blue}"/><rect x="14" y="8" width="16" height="17" fill="${ivory}"/>`
      break
    case "Q":
      design = `<rect width="44" height="33" fill="${yellow}"/>`
      break
    case "R":
      design = `<rect width="44" height="33" fill="${red}"/><path d="M22 0v33M0 16.5h44" stroke="${yellow}" stroke-width="7"/>`
      break
    case "S":
      design = `<rect width="44" height="16.5" fill="${ivory}"/><rect y="16.5" width="44" height="16.5" fill="${blue}"/>`
      break
    case "T":
      design = `<rect width="14.67" height="33" fill="${red}"/><rect x="14.67" width="14.67" height="33" fill="${ivory}"/><rect x="29.34" width="14.66" height="33" fill="${blue}"/>`
      break
    case "U":
      design = `<rect width="22" height="16.5" fill="${red}"/><rect x="22" width="22" height="16.5" fill="${ivory}"/><rect y="16.5" width="22" height="16.5" fill="${ivory}"/><rect x="22" y="16.5" width="22" height="16.5" fill="${red}"/>`
      break
    case "V":
      design = `<rect width="44" height="33" fill="${ivory}"/><path d="M0 0 44 33M44 0 0 33" stroke="${red}" stroke-width="9"/>`
      break
    case "W":
      design = `<rect width="44" height="11" fill="${blue}"/><rect y="11" width="44" height="11" fill="${ivory}"/><rect y="22" width="44" height="11" fill="${red}"/>`
      break
    case "X":
      design = `<rect width="44" height="33" fill="${ivory}"/><path d="M22 0v33M0 16.5h44" stroke="${blue}" stroke-width="8"/>`
      break
    case "Y":
      design = `<path d="M0 0h44L0 33z" fill="${red}"/><path d="M44 0v33H0z" fill="${yellow}"/>`
      break
    case "Z":
      design = `<path d="M0 0h22L0 16.5z" fill="${yellow}"/><path d="M22 0h22L22 16.5z" fill="${black}"/><path d="M44 16.5v16.5H22z" fill="${blue}"/><path d="M22 33H0l22-16.5z" fill="${red}"/>`
      break
  }

  const row = Math.floor((letter.charCodeAt(0) - 65) / 4)
  const column = (letter.charCodeAt(0) - 65) % 4
  const left = x + column * 63
  const top = y + row * 78
  const label = letter === "D" ? "" : `<text x="22" y="48" text-anchor="middle" fill="#9d988c" font-family="monospace" font-size="9">${letter}</text>`
  return `<g transform="translate(${left} ${top})">${design}<rect width="44" height="33" fill="none" stroke="#777166" stroke-width=".7"/>${label}</g>`
}

async function makeDoorAndChart() {
  mkdirSync(`${root}/29`, { recursive: true })
  saveSvg(`${root}/29/arepsev.svg`, doorSvg())
  mkdirSync(`${root}/25`, { recursive: true })
  const x0 = 64
  const y0 = 28
  const size = 47.5
  const grid = Array.from({ length: 17 }, (_, index) => `<path d="M${x0 + index * size} ${y0}v${14 * size}"/>`).join("") + Array.from({ length: 15 }, (_, index) => `<path d="M${x0} ${y0 + index * size}h${16 * size}"/>`).join("")
  const coast = `<path d="M64 170c68-34 112-18 144-45 43-36 90-3 130-19s80-39 126-7 106 3 148 21 116-7 212 35M64 184c68-34 112-18 144-45 43-36 90-3 130-19s80-39 126-7 106 3 148 21 116-7 212 35M64 198c68-34 112-18 144-45 43-36 90-3 130-19s80-39 126-7 106 3 148 21 116-7 212 35"/><path d="M300 326c19-33 62-38 78-8s-13 58-44 55-48-22-34-47Zm8 1c14-23 45-27 57-6s-10 41-34 39-34-16-23-33Z"/><path d="M515 324c20-32 61-37 77-7s-13 57-44 54-47-22-33-47Z"/>`
  const columns = "ABCDEFGHIJKLMNOP".split("").map((letter, index) => `<text x="${x0 + (index + .5) * size}" y="18" text-anchor="middle">${letter}</text><text x="${x0 + (index + .5) * size}" y="710" text-anchor="middle">${letter}</text>`).join("")
  const rows = Array.from({ length: 14 }, (_, index) => `<text x="52" y="${y0 + (index + .5) * size + 4}" text-anchor="middle">${index + 1}</text><text x="836" y="${y0 + (index + .5) * size + 4}" text-anchor="middle">${index + 1}</text>`).join("")
  const depths = Array.from({ length: 32 }, (_, index) => {
    const column = (index * 5 + 2) % 16
    const row = (index * 3 + 1) % 14
    if (column === 7 && row === 7) return ""
    const value = ((index * 7) % 32 + 6) / 10
    return `<text x="${x0 + (column + .5) * size}" y="${y0 + (row + .5) * size + 3}" text-anchor="middle">${value.toFixed(1)}</text>`
  }).join("")
  const anchor = `<g transform="translate(${x0 + 7.5 * size} ${y0 + 7.5 * size})" fill="none" stroke="#e9e4d8" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cy="-12" r="3.2"/><path d="M0-8V8c0 9-8 12-13 5m13-5c0 9 8 12 13 5M-6-7H6M-15 10l2 5 4-2m18-3-2 5-4-2"/></g>`
  const alphabetFlags = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((letter) => signalFlag(letter, 842, 100)).join("")
  const chart = frame(1120, 760, `<title>Carta náutica da baía</title><desc>Grade alfanumérica de A a P e de 1 a 14, costa e linhas de sonda. Na célula H8 há uma marca com aro, haste central e dois braços curvos. Na margem direita, cartela de sinais de A a Z; a quarta moldura está vazia e marcada pela flor.</desc><rect width="1120" height="760" fill="#0b1718"/><rect x="64" y="28" width="760" height="665" fill="#0b1718" stroke="#9d988c" stroke-opacity=".65"/><g stroke="#72aba3" stroke-opacity=".22" fill="none">${grid}${coast}</g><g fill="#72aba3" fill-opacity=".18">${depths}</g><g fill="#9d988c" font-family="monospace" font-size="11">${columns}${rows}<text x="842" y="56" font-size="10">CARTELA DE SINAIS</text></g>${anchor}<g>${alphabetFlags}</g>`)
  saveSvg(`${root}/25/carta.svg`, chart)
}

await makeArchiveLabels()
await makeCalendarStrip()
await makeDifferencePhotos()
await makeManuscript()
await makeBookAndSeals()
await makeDoorAndChart()

console.log("Assets do sótão gerados; i.png permanece ausente por projeto.")

import sharp from "sharp"
import { mkdirSync } from "node:fs"

const noise = Array.from({ length: 280 }, (_, index) => {
  const x = (index * 149 + 37) % 840
  const y = (index * 263 + 91) % 1120
  const radius = ((index * 17) % 10) / 10 + 0.25
  return `<circle cx="${x}" cy="${y}" r="${radius.toFixed(2)}" fill="#605844" opacity=".12"/>`
}).join("")

const rules = Array.from({ length: 38 }, (_, index) => {
  const y = 115 + index * 24
  return `<path d="M76 ${y}H782" stroke="#8196a5" stroke-width="1" opacity=".12"/>`
}).join("")

function pressed(text: string, x: number, y: number, size = 20) {
  return `<text x="${x}" y="${y - 1}" font-family="Georgia, serif" font-size="${size}" fill="#fff4de" opacity=".035">${text}</text>
<text x="${x}" y="${y}" font-family="Georgia, serif" font-size="${size}" fill="#8c8375" opacity=".04">${text}</text>`
}

function page(mark: string, extra: string) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1600" viewBox="0 0 840 1120">
<rect width="840" height="1120" fill="#d6cbb3"/>
<rect width="840" height="1120" fill="#ede4d2" opacity=".18"/>
${noise}
${rules}
<path d="M105 75V1048" stroke="#a77e70" stroke-width="1" opacity=".11"/>
${extra}
<g>${pressed(mark, 138, 300, 19)}</g>
</svg>`
}

const pages = [
  {
    filename: "pagina-01.webp",
    svg: page(
      "capa dura · 95 fls · pautado 8 mm · costurado · 14 × 20",
      `<text x="600" y="930" font-family="monospace" font-size="10" fill="#8c8375" opacity=".025">Z.</text>`,
    ),
  },
  {
    filename: "pagina-02.webp",
    svg: page(
      "eu numero tudo. até isto.",
      `<circle cx="702" cy="925" r="19" fill="none" stroke="#8c8375" stroke-width="1" opacity=".04"/><text x="696" y="932" font-family="Georgia, serif" font-size="18" fill="#8c8375" opacity=".04">9</text>`,
    ),
  },
  {
    filename: "pagina-03.webp",
    svg: page(
      "…e a costura aguentou. 95 folhas. pauta de 8 mm.",
      `<path d="M138 306H560" stroke="#8c8375" stroke-width="1" opacity=".025"/>`,
    ),
  },
]

mkdirSync("public/r/09", { recursive: true })
for (const { filename, svg } of pages) {
  await sharp(Buffer.from(svg)).webp({ lossless: true }).toFile(`public/r/09/${filename}`)
}

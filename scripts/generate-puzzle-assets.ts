import { mkdirSync, writeFileSync } from "node:fs"

const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")
const center = 120
const labelRadius = 100
const missingIndex = 17
const missingAngle = -90 + missingIndex * (360 / letters.length)
const missingX = center + Math.cos((missingAngle * Math.PI) / 180) * 83
const missingY = center + Math.sin((missingAngle * Math.PI) / 180) * 83

const labels = letters
  .filter((_, index) => index !== missingIndex)
  .map((letter) => {
    const index = letters.indexOf(letter)
    const angle = -90 + index * (360 / letters.length)
    const x = center + Math.cos((angle * Math.PI) / 180) * labelRadius
    const y = center + Math.sin((angle * Math.PI) / 180) * labelRadius
    return `<text x="${x.toFixed(2)}" y="${y.toFixed(2)}">${letter}</text>`
  })
  .join("\n  ")

const petals = Array.from({ length: 8 }, (_, index) => {
  return `<ellipse cx="0" cy="-5" rx="2.2" ry="3.4" transform="rotate(${index * 45})"/>`
}).join("")

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240" role="img" aria-labelledby="t d">
<title id="t">Disco de segredo</title>
<desc id="d">Letras claras gravadas em ordem ao redor de um disco escuro.</desc>
<circle cx="120" cy="120" r="91" fill="#111113" stroke="#57544d" stroke-width="1"/>
<circle cx="120" cy="120" r="72" fill="none" stroke="#2b2a28"/>
<g fill="#e9e4d8" font-family="monospace" font-size="11" text-anchor="middle" dominant-baseline="central">
  ${labels}
</g>
<g transform="translate(${missingX.toFixed(2)} ${missingY.toFixed(2)})" fill="#c9944f">
  ${petals}<circle r="1.8"/>
</g>
</svg>
`

mkdirSync("public/r/08", { recursive: true })
writeFileSync("public/r/08/disco.svg", svg)

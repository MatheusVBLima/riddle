import { mkdirSync, writeFileSync } from "node:fs"

const root = "public/dante"
mkdirSync(root, { recursive: true })

const svg = (title: string, body: string) => [
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 460" role="img" aria-labelledby="title desc">',
  '<title id="title">' + title + '</title>',
  '<desc id="desc">Diagrama original criado para o arquivo dantesco.</desc>',
  '<rect width="720" height="460" fill="#101012"/>',
  body,
  '</svg>',
].join("")

writeFileSync(root + "/porta.svg", svg("Porta de três alturas", '<path d="M205 390V120Q205 45 360 45T515 120V390" fill="none" stroke="#c9944f" stroke-width="4"/><path d="M260 390V150Q260 98 360 98T460 150V390" fill="none" stroke="#8d8578" stroke-width="2"/><path d="M315 390V178Q315 150 360 150T405 178V390" fill="none" stroke="#6d685f"/><text x="360" y="425" fill="#aaa394" font-family="monospace" font-size="12" text-anchor="middle">a porta abre para dentro</text>'))
writeFileSync(root + "/montanha.svg", svg("Montanha de nove estações", '<path d="M98 410 Q220 360 292 278 Q340 220 360 60 Q380 220 428 278 Q500 360 622 410Z" fill="#201e1c" stroke="#8d8578" stroke-width="2"/><g stroke="#c9944f" stroke-width="2">' + Array.from({ length: 9 }, (_, i) => '<path d="M' + (180 + i * 20) + ' ' + (398 - i * 39) + 'H' + (540 - i * 20) + '"/>').join("") + '</g>'))
writeFileSync(root + "/esferas.svg", svg("Esferas celestes", Array.from({ length: 9 }, (_, i) => '<circle cx="360" cy="220" r="' + (186 - i * 18) + '" fill="none" stroke="' + (i === 8 ? "#c9944f" : "#6d685f") + '" stroke-width="' + (i === 8 ? "3" : "1") + '"/>').join("") + '<circle cx="360" cy="220" r="7" fill="#e9e4d8"/>'))


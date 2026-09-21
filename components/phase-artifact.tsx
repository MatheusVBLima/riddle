import type { ReactNode } from "react"

import { AudioPuzzle } from "@/components/audio-puzzle"
import { BearingChart } from "@/components/bearing-chart"
import { ChannelPuzzle } from "@/components/channel-puzzle"
import { BookZoom } from "@/components/book-zoom"
import { DifferencePuzzle } from "@/components/difference-puzzle"
import { FinalMetaPuzzle } from "@/components/final-meta-puzzle"
import { FlowerMark } from "@/components/flower-mark"
import { LightRaking } from "@/components/light-raking"
import { MetaTen } from "@/components/meta-ten"
import { PocketPuzzle } from "@/components/pocket-puzzle"
import { PressDrawer } from "@/components/press-drawer"
import { CIFRA_17, ERRATAS, ESPIRAL_20, PETALAS_18, REGRAS_VIGILIA } from "@/lib/canon"

function MapArtifact() {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")

  return (
    <svg
      className="w-full overflow-visible"
      viewBox="0 0 900 640"
      role="img"
      aria-labelledby="map-title map-description"
    >
      <title id="map-title">escala 1:1 000 000</title>
      <desc id="map-description">
        Seis formas claras sobre fundo escuro, linhas paralelas no interior e
        uma régua de letras na borda.
      </desc>

      <g fill="#e9e4d8" stroke="#c8c1b3" strokeWidth="2">
        <path
          id="ilha"
          d="M165 151 196 112 245 98 270 119 262 151 281 177 255 203 236 244 198 251 181 220 153 203Z"
        >
          <title>ilha</title>
        </path>
        <path
          id="baia"
          d="M350 119 399 103 447 121 474 154 460 185 430 176 404 195 371 180 341 157Z"
        >
          <title>baía</title>
        </path>
        <path
          id="istmo"
          d="M546 112 588 124 602 155 585 178 600 205 572 228 539 207 522 178 535 150Z"
        >
          <title>istmo</title>
        </path>
        <path
          id="foz"
          d="M697 116 739 103 777 130 772 161 791 182 765 206 730 195 706 218 680 189 692 158Z"
        >
          <title>foz</title>
        </path>
        <path
          id="cabo"
          d="M294 300 331 281 365 294 383 321 372 348 387 371 358 395 326 381 301 400 277 371 286 342 270 322Z"
        >
          <title>cabo</title>
        </path>
        <path
          id="enseada"
          d="M511 299 554 278 590 299 604 327 587 353 605 380 578 401 545 386 518 403 493 375 504 344 487 321Z"
        >
          <title>enseada</title>
        </path>
      </g>

      <g
        id="curvas-de-nivel"
        fill="none"
        stroke="#aaa394"
        strokeWidth="1.4"
        opacity=".82"
      >
        <path d="M176 169c20-34 66-40 82-7s-16 63-49 58-48-25-33-51Z" />
        <path d="M184 170c15-24 48-28 60-5s-12 44-36 41-35-17-24-36Z" />
        <path d="M192 171c9-14 29-16 36-3s-7 25-22 24-21-10-14-21Z" />
        <path d="M299 326c19-33 62-38 78-8s-13 58-44 55-48-22-34-47Z" />
        <path d="M307 327c14-23 45-27 57-6s-10 41-34 39-34-16-23-33Z" />
        <path d="M515 324c20-32 61-37 77-7s-13 57-44 54-47-22-33-47Z" />
      </g>

      <g
        id="regua-de-escala"
        fill="none"
        stroke="#aaa394"
        strokeWidth="1"
        aria-label="Régua alfabética"
      >
        <rect x="68" y="567" width="764" height="42" />
        {letters.map((letter, index) => {
          const x = 90 + index * 29
          return (
            <g key={letter} transform={`translate(${x} 0)`}>
              <path d="M0 567v8" />
              {letter === "M" ? (
                <g transform="translate(0 589)" aria-label="posição sem letra">
                  {Array.from({ length: 8 }, (_, petal) => (
                    <ellipse
                      key={petal}
                      cx="0"
                      cy="-5"
                      rx="1.7"
                      ry="2.5"
                      fill="#c9944f"
                      stroke="none"
                      transform={`rotate(${petal * 45})`}
                    />
                  ))}
                  <circle r="1.5" fill="#c9944f" stroke="none" />
                </g>
              ) : (
                <text
                  x="0"
                  y="598"
                  textAnchor="middle"
                  fill="#e9e4d8"
                  stroke="none"
                  fontSize="12"
                  fontFamily="monospace"
                >
                  {letter}
                </text>
              )}
            </g>
          )
        })}
      </g>
    </svg>
  )
}

const albumCaptions = [
  "página 1 — o canto de baixo soltou, colei de novo",
  "página 2 — fora de ordem; entrou depois",
  "página 3 — o papel de seda grudou no verso",
  "página 4 — ela de bicicleta, cortada pela metade",
  "página 5 — vazia. era para estar aqui",
  "página 6 — dois cantos, a foto não",
  "página 7 — manchou por causa da fita",
  "página 8 — escrevi por cima e apaguei",
  "página 9 — esta eu tirei e não devolvi",
  "página 10 — a folha ficou marcada com o formato",
  "página 11 — sem canto nenhum, só a cola",
  "página 12 — a última tem um vinco no meio",
]

type PhaseLabel = { index: number; name: string }

function OghamArtifact() {
  return (
    <section className="flex flex-col gap-5">
      {/* Raw puzzle image; the SVG is the lossless enlargement. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/r/11/pedra.webp" width="1200" height="900" alt="Bloco de pedra vertical; ao longo da aresta, nove grupos de traços curtos: alguns à esquerda, alguns à direita e alguns atravessando a aresta na diagonal." className="h-auto w-full" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/r/11/inscricao.svg" width="900" height="800" alt="Nove grupos de entalhes em relação a uma linha-guia vertical: à esquerda, à direita, acima e cruzando na diagonal." className="mx-auto h-auto max-h-[70svh] w-full max-w-md" />
    </section>
  )
}

function CompassArtifact() {
  const labels = Array.from({ length: 8 }, (_, index) => {
    const angle = index * 45 - 90
    const radians = angle * Math.PI / 180
    const x = 240 + Math.cos(radians) * 168
    const y = 240 + Math.sin(radians) * 168
    return <text key={index} x={x} y={y} dominantBaseline="middle" textAnchor="middle">sul</text>
  })

  return (
    <svg viewBox="0 0 480 480" role="img" aria-label="Rosa dos ventos de oito pontas; todas as oito pontas estão rotuladas sul. Um círculo apagado atrás tem vinte e quatro marcas iguais convergindo no centro." className="mx-auto w-full max-w-md">
      <circle cx="240" cy="240" r="192" fill="none" stroke="#9d988c" strokeOpacity=".13" />
      {Array.from({ length: 24 }, (_, index) => {
        const angle = index * Math.PI / 12
        return <line key={index} x1="240" y1="240" x2={240 + Math.cos(angle) * 192} y2={240 + Math.sin(angle) * 192} stroke="#9d988c" strokeOpacity=".13" />
      })}
      <g fill="none" stroke="#e9e4d8" strokeWidth="2">
        {Array.from({ length: 8 }, (_, index) => <path key={index} d="M240 240 240 76" transform={`rotate(${index * 45} 240 240)`} />)}
        <circle cx="240" cy="240" r="18" />
      </g>
      <g fill="#e9e4d8" fontFamily="monospace" fontSize="13">{labels}</g>
    </svg>
  )
}

const inventoryWords = [
  "bacia", "prego", "vidro", "pavio", "pente", "chave", "pano", "linha", "copo", "caixa",
  "fita", "lata", "pasta", "vela", "gancho", "corda", "prato", "colher", "balde", "pá",
  "tampa", "agulha", "botão", "escova", "saco", "rolo", "vaso", "lixa", "funil", "pote",
  "papel", "cesto", "ferro", "bule", "espelho", "trapo", "chaveiro", "cadarço", "pano", "copo",
  "bacia", "prego", "vidro", "pavio", "pente", "chave", "pano", "linha", "copo", "caixa",
  "fita", "lata", "pasta", "vela", "gancho", "corda", "prato", "colher", "balde", "pá",
  "tampa", "agulha", "botão", "escova", "saco", "rolo", "vaso", "lixa", "funil", "pote",
  "papel", "cesto", "ferro", "bule", "espelho", "trapo", "chaveiro", "cadarço", "pano", "copo",
  "bacia", "prego", "vidro", "pavio", "pente", "chave", "pano", "linha", "copo", "caixa",
  "fita", "lata", "pasta", "vela", "gancho", "corda", "prato", "colher", "balde", "pá",
]

function FloorPlanArtifact() {
  const columns = "ABCDEFGHIJ".split("")
  return (
    <section className="flex flex-col gap-5">
      {/* Raw SVG. The file contains the shared 5×5 floor alphabet for record 28. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/r/15/planta.svg" width="930" height="700" alt="Planta baixa técnica com 23 cômodos, grade de referência de A a J e de 1 a 10; no cômodo F7 as quatro paredes são contínuas." className="h-auto w-full" />
      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] border-collapse font-mono text-[11px] text-muted-foreground" aria-label="Inventário da casa por coordenada">
          <caption className="mb-2 text-left text-xs">inventário da casa</caption>
          <thead><tr><th scope="col" className="p-1"></th>{columns.map((column) => <th scope="col" key={column} className="border border-border p-1">{column}</th>)}</tr></thead>
          <tbody>{Array.from({ length: 10 }, (_, row) => (
            <tr key={row}><th scope="row" className="border border-border p-1">{row + 1}</th>{columns.map((column, col) => {
              const coordinate = `${column}${row + 1}`
              const word = coordinate === "F7" ? "alçapão" : coordinate === "B4" ? "VÉS·PE·RA" : inventoryWords[row * 10 + col]
              return <td key={coordinate} aria-label={`${coordinate}: ${word}`} className="border border-border p-1 text-center">{word}</td>
            })}</tr>
          ))}</tbody>
        </table>
      </div>
      <details className="text-sm text-muted-foreground">
        <summary className="w-fit cursor-pointer underline underline-offset-4">ler a planta como lista</summary>
        <p className="mt-3 leading-relaxed">A grade de referência tem dez colunas e dez linhas. Vinte e três cômodos estão desenhados; F7 é o único sem vão de porta.</p>
      </details>
    </section>
  )
}

function MetaTwenty() {
  const grid = ESPIRAL_20
  return (
    <section className="flex flex-col gap-5" aria-label="Folha de errata em grade">
      <p className="font-mono text-xs tracking-[.3em] text-muted-foreground">E R R A T A</p>
      <div className="relative mx-auto grid w-full max-w-xl grid-cols-3 gap-4">
        <svg aria-hidden="true" viewBox="0 0 300 300" className="pointer-events-none absolute inset-0 size-full opacity-[.2]">
          <path d="M30 30H270V270H30V150H150" fill="none" stroke="#e9e4d8" strokeWidth="2" strokeLinecap="round" />
        </svg>
        {grid.flatMap((row, rowIndex) => row.map((record, colIndex) => {
          const [correct] = ERRATAS[String(record) as keyof typeof ERRATAS]
          return (
            <div key={record} className="relative flex min-h-20 flex-col justify-center border border-border bg-background/70 p-3 font-mono">
              <span className="text-[10px] text-muted-foreground">{String(record).padStart(2, "0")}</span>
              <span className="text-sm text-foreground">{correct}</span>
              <span className="sr-only">linha {rowIndex + 1}, coluna {colIndex + 1}</span>
            </div>
          )
        }))}
      </div>
    </section>
  )
}

const printedInventory = [
  ["bacia", "0,42 kg", "11.02.1991"], ["prego", "0,03 kg", "12.02.1991"],
  ["vidro", "0,18 kg", "14.02.1991"], ["pavio", "0,01 kg", "15.02.1991"],
  ["pente", "0,07 kg", "18.02.1991"], ["chave", "0,02 kg", "19.02.1991"],
  ["pano", "0,09 kg", "21.02.1991"], ["linha", "0,01 kg", "23.02.1991"],
  ["copo", "0,21 kg", "25.02.1991"], ["caixa", "1,40 kg", "27.02.1991"],
  ["fita", "0,04 kg", "01.03.1991"], ["lata", "0,12 kg", "04.03.1991"],
  ["pasta", "0,34 kg", "07.03.1991"], ["vela", "0,08 kg", "09.03.1991"],
  ["gancho", "0,05 kg", "12.03.1991"], ["corda", "0,63 kg", "15.03.1991"],
  ["prato", "0,31 kg", "17.03.1991"], ["colher", "0,06 kg", "19.03.1991"],
]

function PrintArtifact() {
  return (
    <section className="print-ledger flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-x-6 gap-y-2 border-y border-border py-4 font-mono text-xs sm:grid-cols-3">
        {printedInventory.map(([object, weight, date]) => <div key={object} className="flex justify-between gap-3 border-b border-border/50 py-1"><span>{object}</span><span className="text-muted-foreground">{weight} · {date}</span></div>)}
      </div>
      <p className="font-serif text-sm leading-relaxed text-muted-foreground">z. não acreditava em nada que estivesse só na tela. ele imprimia antes de assinar. dizia que o papel mostra o que o vidro esconde. na margem da folha impressa ele anotava dois comprimentos e um silêncio.</p>
      <div className="print-margin" aria-hidden="true">··· --- - ·- ---</div>
      <details className="text-sm text-muted-foreground">
        <summary className="w-fit cursor-pointer underline underline-offset-4">ver a versão impressa</summary>
        <div className="mt-3 border-l border-border pl-4 font-mono leading-loose">
          <p>três pontos; três traços; um traço; ponto e traço; três traços.</p>
          <p>dois comprimentos e um silêncio.</p>
        </div>
      </details>
    </section>
  )
}

function ArchivePathArtifact() {
  const letters = "abcdefghijklmnopqrstuvwxyz".split("")
  return (
    <section className="flex flex-col gap-6">
      <div className="grid gap-1" style={{ gridTemplateColumns: "repeat(13, minmax(0, 1fr))" }} aria-label="Etiquetas das gavetas do arquivo">
        {letters.map((letter) => <div key={letter} className="relative flex aspect-square items-center justify-center border border-border bg-background">
          {/* Raw miniatures deliberately include one missing request. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`/r/22/${letter}.png`} alt={letter === "i" ? "etiqueta da nona gaveta" : "miniatura de etiqueta do arquivo"} width="48" height="48" className="h-full w-full object-cover" />
          {letter === "i" && <FlowerMark className="absolute -right-1 -top-1 size-3" />}
        </div>)}
      </div>
      <div role="img" aria-label="Gaveta de madeira aberta; a régua mostra quarenta e dois centímetros por fora e trinta e um por dentro." className="aspect-[3/2] w-full bg-contain bg-center bg-no-repeat" style={{ backgroundImage: 'url("/r/22/osaflaf-odnuf.webp")' }} />
      <p className="font-serif text-sm text-muted-foreground">o que ele escreveu na etiqueta não cabia na etiqueta.<br />a resposta não está no arquivo: está no caminho até ele.</p>
      <details className="text-sm text-muted-foreground">
        <summary className="w-fit cursor-pointer underline underline-offset-4">ver os cabeçalhos desta página</summary>
        <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 font-mono text-xs">
          <dt>asset</dt><dd>/r/22/osaflaf-odnuf.webp</dd>
          <dt>X-Etiqueta</dt><dd className="break-all">ZnVuZG8gZGEgZ2F2ZXRhLCBhbyBjb250csOhcmlv</dd>
        </dl>
      </details>
    </section>
  )
}

function CalendarStrip() {
  const days = [31, 28, 31, 30, 31, 30, 31, 30, 30, 31, 30, 31]
  const objects = ["âncora", "vidro", "selo", "cal", "fita", "chumbo", "esmalte", "obturador", "verniz", "estopa", "arame", "gesso"]
  return (
    <section className="flex flex-col gap-5">
      {/* Raw image is an illustration; the lists below are the playable data. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/r/23/tira.webp" width="1500" height="420" alt="Duas tiras datilografadas com números e nomes de objetos." className="w-full" />
      <div className="grid grid-cols-2 gap-6 border-y border-border py-4 font-mono text-sm tabular-nums">
        <ol className="grid grid-cols-3 gap-x-3 gap-y-2">{days.map((value, index) => <li key={index} className="flex gap-2"><span className="text-muted-foreground">{String(index + 1).padStart(2, "0")}</span>{value}</li>)}</ol>
        <ol className="grid grid-cols-2 gap-x-3 gap-y-2">{objects.map((value, index) => <li key={value} className="flex gap-2"><span className="text-muted-foreground">{index + 1}</span>{value}</li>)}</ol>
      </div>
      <p className="font-serif text-sm text-muted-foreground">doze números, um ano inteiro.<br />eu errei um de propósito, para saber se alguém estava lendo.</p>
    </section>
  )
}

function ReturnComparison() {
  const before = `<html lang="pt-BR">\n<!-- registro 01 -->\n<title>vigília · quarto crescente</title>\n<meta name="description" content="29 dias, 12 horas, 44 minutos.">\n<div class="phase-crescent" aria-label="arco fino, claro, no canto da tela">\n<footer>vigília · registro 01</footer>`
  const after = `<html lang="pt-BR-v">\n<!-- registro 01 e -->\n<title>vigília · quarto minguantes</title>\n<meta name="description" content="29 dias, 12 horas, 44 minutos.t">\n<div class="phase-crescent-i" aria-label="arco fino g, claro, no canto da tela">\n<footer>vigília · labirinto · registro 26 io</footer>`
  return (
    <section className="flex flex-col gap-5">
      <details className="text-sm text-muted-foreground">
        <summary className="w-fit cursor-pointer underline underline-offset-4">ver as duas versões lado a lado</summary>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <pre className="overflow-x-auto border border-border p-3 text-[10px] leading-relaxed">{before}</pre>
          <pre className="overflow-x-auto border border-border p-3 text-[10px] leading-relaxed">{after}</pre>
        </div>
      </details>
    </section>
  )
}

function ManuscriptArtifact() {
  return (
    <section className="flex flex-col gap-5">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/r/27/copia.webp" width="1600" height="1250" alt="Página de papel pautado com escrita à mão, linhas de resumo e nomes substituídos por traços." className="w-full border border-border" />
      <div className="space-y-3 border-y border-border py-5 font-serif text-base leading-relaxed text-foreground/90">
        <p>romance de —, publicado em —, em 1881.</p>
        <p>o narrador conta a própria vida em capítulos curtíssimos, alguns de três linhas, e interrompe a história o tempo todo para falar com quem está lendo.</p>
        <p>o livro é dedicado ao verme que roeu as frias carnes do seu cadáver.</p>
        <p>o narrador só pôde escrever porque já estava morto — e não é metáfora do tempo: ele morreu primeiro e escreveu depois.</p>
        <p>foi copiado nesta casa em 19 noites. escreva o nome de quem narra.</p>
      </div>
      <p className="font-mono text-xs text-muted-foreground">regra 7 · não copiar nome próprio nenhum</p>
    </section>
  )
}

function PageWithoutNumber() {
  return (
    <section className="flex flex-col gap-6">
      {/* Raw image is 2600 px wide; do not route through next/image. */}
      <BookZoom src="/r/28/livro.webp" note="guarda — 1968" />
      <div className="border border-border p-4 font-mono text-xs leading-loose text-muted-foreground">
        <p>localização</p>
        <p>1-3  2-2  2-5  1-3  5-1  2-3  2-3  4-4  4-5  1-3  3-5</p>
        <p>1-3  4-2  1-3  1-1  3-1  3-5  1-3  4-3  1-2  2-3  3-5</p>
        <p>1-3  4-1  4-5  2-3  3-4  3-5  1-2  3-4  2-3  1-4  4-1</p>
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/r/28/selos.svg" width="1040" height="150" alt="Fita horizontal de vinte e seis molduras para selos; a primeira está vazia e tem uma pequena flor ocre ao lado." className="w-full" />
      <p className="font-serif text-sm text-muted-foreground">as gavetas desta casa sempre foram endereço, nunca móvel.<br />cinco por cinco, como no desenho que você já viu.<br />a fita de selos na parede é só o índice; não serve para ler nada.</p>
    </section>
  )
}

function EveArtifact() {
  const inventory = Array.from({ length: 100 }, (_, index) => {
    const row = Math.floor(index / 10) + 1
    const column = "ABCDEFGHIJ"[index % 10]
    if (column === "B" && row === 4) return "VÉS·PE·RA"
    return inventoryWords[index]
  })

  return (
    <section className="flex flex-col gap-6">
      <link rel="preload" as="image" href="/r/29/arepsev.svg" />
      <svg id="porta" viewBox="0 0 400 700" role="img" aria-labelledby="t29 d29" className="mx-auto w-full max-w-xs">
        <title id="t29">a véspera de nada</title>
        <desc id="d29">o título desta porta mente; conte as letras dele</desc>
        <path d="M42 662V92Q200 12 358 92v570Z" fill="#171717" stroke="#9d988c" strokeWidth="3" />
        <path d="M78 662V118Q200 58 322 118v544Z" fill="#0a0a0b" stroke="#514f49" strokeWidth="2" />
        <circle cx="291" cy="393" r="9" fill="#c9944f" />
        <path d="M0 650H400" stroke="#e9e4d8" strokeOpacity=".28" strokeWidth="8" />
        <path d="M22 648H378" stroke="#c9944f" strokeOpacity=".55" strokeWidth="2" />
      </svg>
      <div className="print-margin-29" aria-hidden="true">a terceira sílaba é RA</div>
      <div className="grid grid-cols-4 gap-2">
        {(["I", "II", "III", "IV"] as const).map((step) => <label key={step} className="flex flex-col gap-2 font-mono text-xs text-muted-foreground">
          <span>{step}</span><input aria-label={`Rascunho ${step}`} autoComplete="off" spellCheck={false} className="h-10 min-w-0 border border-input bg-transparent px-2 text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring" />
        </label>)}
      </div>
      <p className="text-xs text-muted-foreground">estes campos são seus; não envio nada.</p>
      <details className="text-sm text-muted-foreground">
        <summary className="w-fit cursor-pointer underline underline-offset-4">consultar a gaveta B4</summary>
        <p className="mt-3 font-mono text-xs">{inventory[31]}</p>
      </details>
    </section>
  )
}

function SpectrogramArtifact() {
  return (
    <section className="flex flex-col gap-5">
      <figure className="border border-border p-3">
        {/* Raw reference graphic; unlike the audio, this is an example, not the target. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/r/18/impressao-exemplo.webp" width="1440" height="600" alt="Imagem em tons de cinza com eixo vertical de frequência e eixo horizontal de tempo; a palavra teste aparece desenhada por faixas de energia." className="h-auto w-full" />
        <figcaption className="mt-2 font-serif text-sm text-muted-foreground">“assim eu guardo as vozes: em papel, o tempo da esquerda para a direita, o grave embaixo e o agudo em cima.”</figcaption>
      </figure>
      <AudioPuzzle
        src="/r/18/prensa.wav"
        summary="zumbido mecânico grave, com uma faixa de chiado acima; o arquivo dura quarenta segundos."
        peaks={[6, 8.8, 11.6, 14.4, 17.2, 20, 22.8, 25.6, 28.4, 31.2, 34]}
        duration={40}
      />
      <ol className="grid gap-1 border-y border-border py-4 font-serif text-sm leading-relaxed text-muted-foreground sm:grid-cols-2">
        {REGRAS_VIGILIA.map((rule, index) => <li key={index}><span className="mr-2 font-mono text-xs">{String(index + 1).padStart(2, " ")}.</span>{rule}</li>)}
      </ol>
      <details className="text-sm text-muted-foreground">
        <summary className="w-fit cursor-pointer underline underline-offset-4">ver como dados</summary>
        <p className="mt-3 leading-relaxed">Desenho com oito lóbulos em círculo em volta de um centro; sobre cada lóbulo, um algarismo. A partir do lóbulo superior, em sentido horário: {PETALAS_18.join(", ")}.</p>
      </details>
    </section>
  )
}

function AlbumPuzzle({
  page,
  hasQuery,
}: {
  page: number | null
  hasQuery: boolean
}) {
  const validPage = page !== null && page >= 1 && page <= 12

  return (
    <section className="flex flex-col gap-7" aria-label="Doze páginas de fotografias">
      <div className="grid grid-cols-3 gap-x-4 gap-y-6 sm:grid-cols-4">
        {albumCaptions.map((caption, index) => {
          const pageNumber = index + 1
          return (
            <a
              key={pageNumber}
              href={`?p=${pageNumber}`}
              aria-label={`Abrir a página ${pageNumber}`}
              className="group flex flex-col gap-2 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
            >
              <span className="aspect-[4/3] bg-[#1a1a1c] transition-colors group-hover:bg-[#222224]" />
              <span className="font-mono text-[11px] leading-tight text-muted-foreground">
                {1993 + pageNumber} · {validPage && page === pageNumber ? caption : "—"}
              </span>
            </a>
          )
        })}
      </div>

      {hasQuery && !validPage && (
        <p className="font-mono text-sm text-muted-foreground">não há página 13.</p>
      )}

      <div className="flex flex-col gap-3 border-t border-border pt-5">
        {/* Puzzle assets stay raw so filenames and bytes remain inspectable. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/r/05/teclas.svg"
          width="360"
          height="118"
          alt="Três fileiras de teclas de máquina de escrever em QWERTY; a tecla na primeira posição da fileira do meio não tem letra, e há uma pequena flor de oito pétalas ocre ao lado."
          className="h-auto w-full max-w-sm"
        />
        <p className="font-mono text-xs text-muted-foreground">
          as legendas foram datilografadas
        </p>
      </div>
    </section>
  )
}

export function PhaseArtifact({
  media,
  page,
  hasQuery = false,
  labels = [],
}: {
  media?: string
  page?: number | null
  hasQuery?: boolean
  labels?: PhaseLabel[]
}): ReactNode {
  if (media === "map") {
    return (
      <figure className="w-full" aria-label="Desenho abstrato de seis formas">
        <MapArtifact />
      </figure>
    )
  }

  if (media === "ogham") return <OghamArtifact />
  if (media === "red-channel") return <ChannelPuzzle />
  if (media === "compass") return <CompassArtifact />

  if (media === "transmission") {
    return (
      <section className="flex flex-col gap-4">
        <AudioPuzzle
          src="/r/14/transmissao.wav"
          summary="um acorde seco de piano com três segundos de duração."
          peaks={[0.15, 0.42, 0.68, 0.94, 1.2, 1.46, 1.72, 1.98, 2.24, 2.5, 2.76]}
          duration={3}
        />
        <p className="font-mono text-xs text-muted-foreground">
          arquivo · transmissao.wav · 2 118 744 bytes
        </p>
        <a href="/r/14/transmissao.wav" className="w-fit text-sm text-foreground underline underline-offset-4 hover:text-muted-foreground">
          abrir transmissao.wav
        </a>
      </section>
    )
  }

  if (media === "floor-plan") return <FloorPlanArtifact />

  if (media === "cellar-entry") {
    return (
      <figure className="flex flex-col gap-3">
        {/* Raw puzzle image. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/r/16/alcapao.webp" width="1200" height="850" alt="Alçapão aberto no assoalho, com degraus que descem e somem no escuro." className="h-auto w-full" />
      </figure>
    )
  }

  if (media === "press") {
    return (
      <section className="flex flex-col gap-5">
        {/* Raw visual plate; the text around it remains available to the player. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/r/17/placa.svg" width="620" height="300" alt="Placa de latão com cinco linhas de alfabetos deslocados, começando pelas letras A, B, C, D e E." className="h-auto w-full" />
        <p className="font-mono text-sm leading-relaxed tracking-[.14em]">{CIFRA_17}</p>
        <p className="text-sm text-muted-foreground">a chave está pendurada na parede desde que a casa ganhou nome.</p>
        <PressDrawer />
        <a href="/r/17/prensa.svg" className="w-fit text-xs text-muted-foreground underline underline-offset-4">prensa.svg</a>
      </section>
    )
  }

  if (media === "spectrogram") return <SpectrogramArtifact />
  if (media === "pocket") return <PocketPuzzle />
  if (media === "meta20") return <MetaTwenty />
  if (media === "print") return <PrintArtifact />
  if (media === "archive-path") return <ArchivePathArtifact />
  if (media === "calendar-strip") return <CalendarStrip />
  if (media === "difference") return <DifferencePuzzle first="/r/24/a.png" second="/r/24/b.png" />
  if (media === "nautical-chart") return <BearingChart assetSrc="/r/25/carta.svg" />
  if (media === "return") return <ReturnComparison />
  if (media === "manuscript") return <ManuscriptArtifact />
  if (media === "page-without-number") return <PageWithoutNumber />
  if (media === "eve") return <EveArtifact />
  if (media === "meta-final") return <FinalMetaPuzzle />

  if (media === "mineral") {
    return (
      <figure className="w-full">
        {/* Puzzle assets stay raw so filenames and bytes remain inspectable. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/r/03/amostra.webp"
          width="1200"
          height="900"
          alt="amostra de mão: cristais cúbicos de faces estriadas, brilho metálico amarelo-latão, risca preto-esverdeada, densidade 5,0, sem clivagem, risca vidro"
          className="h-auto w-full"
        />
      </figure>
    )
  }

  if (media === "audio04") {
    return (
      <AudioPuzzle
        src="/r/04/madrugada.wav"
        summary="ruído contínuo de ambiente, muito baixo; dez impactos curtos e agudos, um a cada 2,4 segundos; o sétimo atrasa 0,7 s"
        peaks={[1.2, 3.6, 6, 8.4, 10.8, 13.2, 16.3, 18.7, 21.1, 23.5]}
        duration={24}
      />
    )
  }
  if (media === "audio06") {
    return (
      <AudioPuzzle
        src="/r/06/oito-vezes.wav"
        summary="em 1×: ronco grave contínuo com duas ondulações. Em 8×: dois impactos metálicos afinados, o segundo mais grave, com 0,32 s de intervalo."
        peaks={[0, 2.56]}
        duration={24}
        canChangeSpeed
      />
    )
  }
  if (media === "last-buzz") {
    return (
      <section className="flex flex-col gap-6" aria-label="Vestígio e gravação">
        {/* Puzzle assets stay raw so filenames and bytes remain inspectable. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/r/06/o-ultimo-barulho.webp"
          width="1200"
          height="900"
          alt="Parede ao lado de uma porta; dois furos de parafuso, um círculo de tinta mais clara do tamanho de uma moeda grande e dois fios finos cortados rente."
          className="h-auto w-full"
        />
        <AudioPuzzle
          src="/r/06/oito-vezes.wav"
          summary="em 1×: ronco grave contínuo com duas ondulações. Em 8×: dois impactos metálicos afinados, o segundo mais grave, com 0,32 s de intervalo."
          peaks={[0, 2.56]}
          duration={24}
          canChangeSpeed
        />
      </section>
    )
  }
  if (media === "album") {
    return <AlbumPuzzle page={page ?? null} hasQuery={hasQuery} />
  }
  if (media === "notebook") return <LightRaking />
  if (media === "meta10") return <MetaTen labels={labels} />
  if (media === "thermometer") {
    return (
      <svg
        viewBox="0 0 420 560"
        role="img"
        aria-label="escala vertical com três marcas rotuladas: menos 38,83 na base, 0 acima dela, 356,73 no topo"
        className="mx-auto h-[min(520px,65svh)] w-full max-w-sm"
      >
        <defs>
          <linearGradient id="escala-temperatura" x1="0" x2="0" y1="1" y2="0">
            <stop offset="0%" stopColor="#1d3a63" />
            <stop offset="30%" stopColor="#3a3f52" />
            <stop offset="70%" stopColor="#6b4a45" />
            <stop offset="100%" stopColor="#8e3a2f" />
          </linearGradient>
        </defs>
        <rect
          x="62"
          y="20"
          width="26"
          height="520"
          fill="url(#escala-temperatura)"
          stroke="#2b2a28"
        />
        <g stroke="#9d988c" strokeWidth="1">
          <path d="M88 20h12M88 488.9h12M88 540h12" />
        </g>
        <g
          fill="#e9e4d8"
          fontFamily="monospace"
          fontSize="14"
          fontVariant="tabular-nums"
        >
          <text x="110" y="25">356,73</text>
          <text x="110" y="494">0</text>
          <text x="110" y="545">−38,83</text>
        </g>
      </svg>
    )
  }
  if (media === "calculator") {
    return (
      <section className="relative flex flex-col gap-8">
        <svg
          viewBox="0 0 150 300"
          role="img"
          aria-label="Visor vertical de sete segmentos mostrando zero"
          className="mx-auto h-56 w-28"
        >
          <g fill="#15161a">
            <path d="M35 24h70l8 8-8 8H35l-8-8z" />
            <path d="M25 45l8-8 8 8v88l-8 8-8-8z" />
            <path d="M99 45l8-8 8 8v88l-8 8-8-8z" />
            <path d="M35 139h70l8 8-8 8H35l-8-8z" />
            <path d="M25 160l8-8 8 8v88l-8 8-8-8z" />
            <path d="M99 160l8-8 8 8v88l-8 8-8-8z" />
            <path d="M35 254h70l8 8-8 8H35l-8-8z" />
          </g>
          <g fill="#e9e4d8">
            <path d="M35 24h70l8 8-8 8H35l-8-8z" />
            <path d="M25 45l8-8 8 8v88l-8 8-8-8z" />
            <path d="M99 45l8-8 8 8v88l-8 8-8-8z" />
            <path d="M25 160l8-8 8 8v88l-8 8-8-8z" />
            <path d="M99 160l8-8 8 8v88l-8 8-8-8z" />
            <path d="M35 254h70l8 8-8 8H35l-8-8z" />
          </g>
          <circle cx="131" cy="264" r="5" fill="#e9e4d8" />
        </svg>

        {/* Puzzle assets stay raw so filenames and bytes remain inspectable. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/r/08/disco.svg"
          width="240"
          height="240"
          alt="Disco escuro com letras claras gravadas ao redor e uma pequena flor ocre na margem."
          className="absolute right-0 top-1/2 size-12 -translate-y-1/2"
        />

        <div hidden aria-hidden="true" className="teclado">
          <button data-t="7">7</button><button data-t="8">8</button>
          <button data-t="9">9</button><button data-op="div">÷</button>
          <button data-t="4">4</button><button data-t="5">5</button>
          <button data-t="6">6</button><button data-op="mul">×</button>
          <button data-t="1">1</button><button data-t="2">2</button>
          <button data-t="3">3</button><button data-op="sub">−</button>
          <button data-t="0" className="larga">0</button>
          <button data-t=",">,</button><button data-op="eq">=</button>
          <button data-op="add" className="alta">+</button>
          <button data-op="clear">C</button><button data-op="mr">MR</button>
          <button data-op="mplus">M+</button><button data-op="pct">%</button>
        </div>
      </section>
    )
  }

  return null
}

export function PhaseFooter({ index, suffix = "" }: { index: number; suffix?: string }) {
  return (
    <footer className="flex items-center justify-between border-t border-border pt-4 font-mono text-xs text-muted-foreground">
      <span>
        vigília · {index >= 11 ? "labirinto · " : ""}registro{" "}
        {String(index).padStart(2, "0")}
        {suffix}
      </span>
      <FlowerMark className="size-[13px]" />
    </footer>
  )
}

export function CrescentMark({ changed = false }: { changed?: boolean }) {
  return <span className={`phase-crescent${changed ? " phase-crescent-i" : ""}`} role="img" aria-label={changed ? "arco fino g, claro, no canto da tela" : "arco fino, claro, no canto da tela"} />
}

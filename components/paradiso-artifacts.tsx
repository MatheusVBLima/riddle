import { MetaAnswers } from "@/components/meta-answers"
import { Plate, PlateHeader } from "@/components/plate"
import {
  CHOIR_TEMPLATE,
  CROSS_MORSE,
  EAGLE_DOCUMENT,
  ENDINGS,
  EXAM_SYMBOLS,
  EXAM_TEMPLATE,
  examPasses,
  LADDER_RUNGS,
  MOON_SPOTS,
  OLD_CHOIR_ORDER,
  ORBIT_GRID,
  ORBIT_PATHS,
  SPHERE_INDICES,
  SPIRAL_ROWS,
} from "@/lib/paradiso-material"

function Caption({ left, right }: { left: string; right?: string }) {
  return (
    <div className="flex flex-wrap justify-between gap-3 border-t border-border pt-3 text-xs text-muted-foreground">
      <span>{left}</span>
      {right && <span>{right}</span>}
    </div>
  )
}

const round = (value: number) => Math.round(value * 10) / 10

/** Fase 21 · seis superfícies da Lua, cada uma com seis lugares possíveis de mancha. */
export function MoonSurfaces() {
  return (
    <Plate label="seis superfícies da Lua com manchas">
      <div className="grid gap-5">
        <PlateHeader title="seis superfícies" mark="manchas" />
        <svg viewBox="0 0 720 170" role="img" className="dante-svg" aria-label={"Seis discos claros. Em cada um, seis lugares em duas colunas de três; manchas escuras em: " + MOON_SPOTS.map((spots) => spots.join("-")).join(", ") + "."}>
          {MOON_SPOTS.map((spots, index) => {
            const cx = 70 + index * 116
            return (
              <g key={index}>
                <circle cx={cx} cy="80" r="48" fill="#e3dcc4" fillOpacity=".12" stroke="currentColor" strokeOpacity=".5" />
                {[1, 2, 3, 4, 5, 6].map((dot) => {
                  const column = dot <= 3 ? -1 : 1
                  const row = (dot - 1) % 3
                  const filled = (spots as readonly number[]).includes(dot)
                  return <circle key={dot} cx={cx + column * 14} cy={52 + row * 28} r="8" fill={filled ? "#0f0e0b" : "none"} stroke={filled ? "#0f0e0b" : "#6d685f"} strokeOpacity={filled ? 1 : 0.35} />
                })}
              </g>
            )
          })}
        </svg>
        <Caption left="as manchas não são defeito" right="seis lugares em cada superfície" />
      </div>
    </Plate>
  )
}

/** Fase 22 · um documento sobre a águia; a chave de leitura ficou na aba. */
export function EagleDocument() {
  return (
    <Plate label="documento sobre o voo da águia">
      <div className="grid gap-5">
        <PlateHeader title="documento II" mark="palavra · letra" />
        <p className="font-serif text-lg leading-relaxed sm:text-xl">{EAGLE_DOCUMENT}</p>
        <Caption left="a chave não está no documento" right="ela conta palavras e letras" />
      </div>
    </Plate>
  )
}

/** Fase 23 · grade de letras cruzada por três trajetórias. */
export function OrbitPaths() {
  const cell = 60
  const origin = 150
  const center = (row: number, column: number) => [origin + column * cell + cell / 2, 20 + row * cell + cell / 2] as const
  return (
    <Plate label="grade de letras com três trajetórias">
      <div className="grid gap-5">
        <PlateHeader title="trajetórias" mark="três rotas" />
        <svg viewBox="0 0 720 460" role="img" className="dante-svg" aria-label="Grade de sete por sete letras, cruzada por três linhas que começam num ponto cheio e terminam num anel.">
          {ORBIT_GRID.map((row, rowIndex) =>
            [...row].map((letter, columnIndex) => {
              const [x, y] = center(rowIndex, columnIndex)
              return <text key={rowIndex + "-" + columnIndex} x={x} y={y + 6} fill="#aaa394" fontFamily="monospace" fontSize="17" textAnchor="middle">{letter}</text>
            })
          )}
          {ORBIT_PATHS.map((path, pathIndex) => {
            const points = path.map(([row, column]) => center(row, column))
            const [startX, startY] = points[0]
            const [endX, endY] = points[points.length - 1]
            return (
              <g key={pathIndex} stroke="currentColor" fill="none" opacity={0.85 - pathIndex * 0.15}>
                <polyline points={points.map(([x, y]) => x + "," + y).join(" ")} strokeWidth="1.5" strokeDasharray={["", "7 5", "2 5"][pathIndex]} />
                <circle cx={startX} cy={startY} r="5" fill="currentColor" />
                <circle cx={endX} cy={endY} r="14" />
              </g>
            )
          })}
        </svg>
        <Caption left="cada rota lê as letras onde começa, muda de rumo e termina" right="do ponto cheio ao anel" />
      </div>
    </Plate>
  )
}

/** Fase 24 · a primeira coroa: doze luzes, a primeira apresenta as outras. */
export function CrownOfLights() {
  return (
    <Plate label="coroa de doze luzes">
      <div className="grid gap-5">
        <PlateHeader title="duas listas" mark="primeira coroa" />
        <svg viewBox="0 0 720 300" role="img" className="dante-svg" aria-label="Doze luzes em círculo. A primeira, no alto, está marcada; a última pisca.">
          {Array.from({ length: 12 }, (_, index) => {
            const angle = -Math.PI / 2 + (index / 12) * Math.PI * 2
            const x = round(360 + Math.cos(angle) * 120)
            const y = round(150 + Math.sin(angle) * 120)
            return (
              <g key={index}>
                <circle cx={x} cy={y} r={index === 0 ? 12 : 9} fill="currentColor" fillOpacity={index === 0 ? 0.9 : 0.45} className={index === 11 ? "dante-blink" : undefined} />
                {index === 0 && <text x={x} y={y - 20} fill="#e9e4d8" fontFamily="monospace" fontSize="11" textAnchor="middle">eu</text>}
              </g>
            )
          })}
        </svg>
        <Caption left="a primeira luz apresenta as outras onze" right="os nomes subiram; ficaram só as iniciais" />
      </div>
    </Plate>
  )
}

/** Posição de cada ponto ou traço ao longo de um braço; pula o cruzamento, se houver. */
function layoutMorse(codes: readonly string[], start: number, skip?: readonly [number, number]) {
  const placed: { mark: string; at: number }[] = []
  let at = start
  codes.forEach((code, letter) => {
    if (letter > 0) at += 10
    for (const mark of code) {
      if (skip && at > skip[0] && at < skip[1]) at = skip[1]
      placed.push({ mark, at })
      at += mark === "." ? 10 : 20
    }
  })
  return placed
}

/** Fase 25 · pontos e traços ao longo dos braços de uma cruz. */
export function CrossMorse() {
  const vertical = layoutMorse(CROSS_MORSE.vertical, 24)
  const horizontal = layoutMorse(CROSS_MORSE.horizontal, 70, [330, 392])
  return (
    <Plate label="cruz de luz com pontos e traços">
      <div className="grid gap-5">
        <PlateHeader title="pontos e traços" mark="de cima · da esquerda" />
        <svg viewBox="0 0 720 360" role="img" className="dante-svg" aria-label={"Uma cruz. No braço de cima, de cima para baixo: " + CROSS_MORSE.vertical.join(" ") + ". No braço horizontal, da esquerda para a direita: " + CROSS_MORSE.horizontal.join(" ") + "."}>
          <path d="M340 10H380V190H700V230H380V350H340V230H20V190H340Z" fill="#1c1a14" stroke="#3a3628" />
          {vertical.map(({ mark, at }) =>
            mark === "." ? <circle key={"v" + at} cx="360" cy={at + 3} r="3" fill="currentColor" /> : <rect key={"v" + at} x="357" y={at} width="6" height="13" fill="currentColor" />
          )}
          {horizontal.map(({ mark, at }) =>
            mark === "." ? <circle key={"h" + at} cx={at + 3} cy="210" r="3" fill="currentColor" /> : <rect key={"h" + at} x={at} y="207" width="13" height="6" fill="currentColor" />
          )}
        </svg>
        <Caption left="o braço de cima fala primeiro" right="entre uma letra e outra, um silêncio maior" />
      </div>
    </Plate>
  )
}

/** Fase 26 · a rota em espiral que termina na casa vazia. */
export function SpiralRoute() {
  return (
    <Plate label="grade de seis por seis com uma casa marcada e uma vazia">
      <div className="grid gap-5">
        <PlateHeader title="a rota" mark="de fora para dentro" />
        <div className="mx-auto grid w-full max-w-sm grid-cols-6 border border-border">
          {SPIRAL_ROWS.flatMap((row, rowIndex) =>
            [...row].map((letter, columnIndex) => {
              const start = rowIndex === 0 && columnIndex === 0
              return (
                <div key={rowIndex + "-" + columnIndex} className={"flex aspect-square items-center justify-center border border-border font-mono text-lg " + (start ? "ring-2 ring-vigil ring-inset" : "")}>
                  {letter === "·" ? <span className="text-muted-foreground">·</span> : letter}
                </div>
              )
            })
          )}
        </div>
        <Caption left="começa na casa marcada e gira no sentido do relógio" right="termina onde não há letra" />
      </div>
    </Plate>
  )
}

/** Fase 27 · a escada de ouro; os degraus que importam são contados na aba. */
export function GoldenLadder() {
  const rungs = [...LADDER_RUNGS]
  return (
    <Plate label="escada de doze degraus com uma letra em cada">
      <div className="grid gap-5">
        <PlateHeader title="colunas" mark="silêncio" />
        <svg viewBox="0 0 720 420" role="img" className="dante-svg" aria-label={"Escada de doze degraus. De baixo para cima: " + rungs.join(", ") + "."}>
          <path d="M300 400V20M420 400V20" stroke="currentColor" strokeWidth="3" />
          {rungs.map((letter, index) => {
            const y = 390 - index * 32
            return (
              <g key={index}>
                <path d={"M300 " + y + "H420"} stroke="currentColor" strokeWidth="2" />
                <text x="360" y={y - 8} fill="#e9e4d8" fontFamily="monospace" fontSize="15" textAnchor="middle">{letter}</text>
              </g>
            )
          })}
        </svg>
        <Caption left="ninguém canta aqui" right="os degraus que importam são contados lá em cima" />
      </div>
    </Plate>
  )
}

/** Fase 28 · três símbolos de virtude e uma banca que responde pela URL. */
export function ExamBoard({ exame }: { exame?: string }) {
  const passed = examPasses(exame)
  return (
    <Plate label="três símbolos de virtude">
      <div className="grid gap-5">
        <PlateHeader title="três símbolos" mark={passed ? "aprovado" : "exame"} />
        <div className="flex justify-center gap-10 py-4 font-serif text-5xl text-vigil sm:text-6xl">
          {EXAM_SYMBOLS.map((symbol) => <span key={symbol}>{symbol}</span>)}
        </div>
        <Caption
          left={EXAM_TEMPLATE}
          right={passed === null ? "a banca espera a inicial de quem pergunta cada uma" : passed ? "aprovado. a última frase não está na página" : "a banca não aprova"}
        />
      </div>
    </Plate>
  )
}

/** Fase 29 · nove círculos em volta de um ponto; ?coro= acende um deles. */
export function AngelRings({ coro }: { coro?: string }) {
  const lit = coro && /^\d$/.test(coro) ? Number(coro) : 0
  return (
    <Plate label="nove círculos em volta de um ponto">
      <div className="grid gap-5">
        <PlateHeader title="nove movimentos" mark={lit >= 1 && lit <= OLD_CHOIR_ORDER.length ? "coro " + lit : "ponto"} />
        <svg viewBox="0 0 720 400" role="img" className="dante-svg" aria-label={"Um ponto de luz com nove círculos em volta" + (lit ? "; o círculo " + lit + " está aceso." : ".")}>
          <circle cx="360" cy="200" r="5" fill="#fff8e0" />
          {OLD_CHOIR_ORDER.map((_, index) => (
            <circle key={index} cx="360" cy="200" r={22 + index * 20} fill="none" stroke="currentColor" strokeOpacity={lit === index + 1 ? 1 : 0.3} strokeWidth={lit === index + 1 ? 3 : 1} />
          ))}
        </svg>
        <Caption left={CHOIR_TEMPLATE} right="cada círculo diz seu nome numa ordem antiga; quem a escreveu riu de si ao ver este céu" />
      </div>
    </Plate>
  )
}

/** Fase 30 · nove esferas com marcas, os três fins de percurso e as respostas já obtidas. */
export function ParadisoSpheres() {
  return (
    <section className="flex flex-col gap-6">
      <Plate label="nove esferas, cada uma com um número de marcas">
        <svg viewBox="0 0 720 460" role="img" className="dante-svg">
          <title>nove esferas</title>
          <desc>{"Da Lua (01, a mais interna) ao Primeiro Móvel (09, a mais externa). Marcas por esfera: " + SPHERE_INDICES.map((count, index) => String(index + 1).padStart(2, "0") + " com " + count).join(", ") + "."}</desc>
          <circle cx="360" cy="230" r="8" fill="#e9e4d8" />
          {SPHERE_INDICES.map((count, index) => {
            const radius = 30 + index * 22
            return (
              <g key={index}>
                <circle cx="360" cy="230" r={radius} fill="none" stroke="currentColor" strokeOpacity=".45" />
                {Array.from({ length: count }, (_, mark) => {
                  const angle = ((-40 + index * 32) * Math.PI) / 180 + (mark * 13) / radius
                  return <circle key={mark} cx={round(360 + Math.cos(angle) * radius)} cy={round(230 + Math.sin(angle) * radius)} r="3" fill="currentColor" />
                })}
                <text x="360" y={230 - radius + 4} fill="#e9e4d8" stroke="#16150f" strokeWidth="5" paintOrder="stroke" fontFamily="monospace" fontSize="10" textAnchor="middle">
                  {String(index + 1).padStart(2, "0")}
                </text>
              </g>
            )
          })}
        </svg>
      </Plate>
      <div className="grid gap-3 sm:grid-cols-3">
        {ENDINGS.map((ending) => (
          <div key={ending.label} className="border border-border p-3">
            <span className="font-mono text-[10px] tracking-[.18em] text-muted-foreground">{ending.label}</span>
            <p className="mt-2 font-serif">{ending.verse}</p>
            <p className="mt-1 font-mono text-xs text-muted-foreground">falta a última palavra</p>
          </div>
        ))}
      </div>
      <MetaAnswers from={21} to={29} />
    </section>
  )
}

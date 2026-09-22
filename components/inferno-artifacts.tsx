import { MetaAnswers } from "@/components/meta-answers"
import { Plate, PlateHeader } from "@/components/plate"
import {
  BROKEN_VOICES,
  CROSSING_STRIP,
  FROZEN_DAYS,
  FROZEN_TEMPLATE,
  MARGIN_VOICE,
  PITCH_WORDS,
  readFrozenGrid,
  RIVER_DEPTHS,
  RIVER_SURFACE,
  RING_INDICES,
  STONE_COLUMNS,
  STONE_READING,
  STONE_ROWS,
  SURFACE_BUBBLES,
  TWO_CHANNELS,
} from "@/lib/inferno-material"

const dots = (count: number) => "·".repeat(count)

/** Fase 1 · quatro vozes com a inicial e o epíteto; a quinta fica na margem. */
export function BrokenVoices() {
  return (
    <Plate label="folha com quatro vozes quebradas e uma quinta na margem">
      <div className="grid gap-5">
        <PlateHeader title="folha sem nomes" mark="cinco posições" />
        <div className="grid gap-6 sm:grid-cols-[1fr_auto]">
          <ol className="grid gap-3">
            {BROKEN_VOICES.map((voice) => (
              <li key={voice.mark} className="grid grid-cols-[3rem_1fr_auto] items-baseline gap-3 border-b border-border/70 pb-3">
                <span className="font-mono text-xs text-muted-foreground">{voice.mark}</span>
                <span className="font-mono text-lg tracking-[.35em] sm:text-xl">{voice.initial + dots(voice.length - 1)}</span>
                <span className="font-serif text-sm italic text-muted-foreground">{voice.epithet}</span>
              </li>
            ))}
          </ol>
          <aside className="flex items-center gap-3 border-t border-border pt-3 sm:flex-col sm:justify-center sm:border-t-0 sm:border-l sm:pt-0 sm:pl-6">
            <span className="font-mono text-[10px] tracking-[.22em] text-muted-foreground">MARGEM</span>
            <span className="font-mono text-lg tracking-[.35em] sm:[writing-mode:vertical-rl] sm:[text-orientation:upright] sm:tracking-[.1em]">{MARGIN_VOICE.initial + dots(MARGIN_VOICE.length - 1)}</span>
          </aside>
        </div>
      </div>
    </Plate>
  )
}

const PITCH_HEIGHT = { 1: 22, 2: 46, 3: 70 } as const

/** Fase 3 · trios de batidas em três alturas, desenhados e tocados. */
export function PitchRecord() {
  const bars: { x: number; level: 1 | 2 | 3 }[] = []
  let x = 40
  PITCH_WORDS.forEach((word, wordIndex) => {
    if (wordIndex > 0) x += 22
    word.forEach((trio, letterIndex) => {
      if (letterIndex > 0) x += 12
      trio.forEach((level) => {
        bars.push({ x, level: level as 1 | 2 | 3 })
        x += 13
      })
    })
  })

  return (
    <Plate label="registro sonoro em batidas de três alturas">
      <div className="grid gap-5">
        <PlateHeader title="registro C" mark="três alturas" />
        <svg viewBox="0 0 720 140" role="img" aria-label={"Trinta e seis batidas em três alturas, agrupadas em trios: " + PITCH_WORDS.map((word) => word.map((trio) => trio.join("")).join(" ")).join(" / ")} className="dante-svg">
          <path d="M24 112H696" stroke="#4d4a45" />
          {[1, 2, 3].map((level) => (
            <path key={level} d={"M24 " + (112 - PITCH_HEIGHT[level as 1 | 2 | 3]) + "H696"} stroke="#4d4a45" strokeDasharray="2 8" opacity=".6" />
          ))}
          {bars.map((bar, index) => (
            <rect key={index} x={bar.x} y={112 - PITCH_HEIGHT[bar.level]} width="6" height={PITCH_HEIGHT[bar.level]} fill="currentColor" />
          ))}
        </svg>
        <audio controls preload="metadata" className="w-full" aria-label="registro C">
          <source src="/dante/registro-c.wav" type="audio/wav" />
        </audio>
        <p className="text-xs leading-relaxed text-muted-foreground">grave · média · aguda</p>
      </div>
    </Plate>
  )
}

/** Fase 4 · uma faixa só, com duas leituras em sentidos opostos. */
export function CrossingStrip() {
  return (
    <Plate label="faixa com duas sequências em sentidos opostos">
      <div className="grid gap-5">
        <PlateHeader title="sinal D" mark="→ ←" />
        <p className="break-all font-mono text-lg leading-loose tracking-[.45em] sm:text-2xl">{CROSSING_STRIP}</p>
        <div className="flex flex-wrap justify-between gap-3 border-t border-border pt-3 text-xs text-muted-foreground">
          <span>duas vozes, um só caminho</span>
          <span>{CROSSING_STRIP.length} marcas</span>
        </div>
      </div>
    </Plate>
  )
}

/**
 * Fase 5 · metade da fala sobe em bolhas; entre elas, as covas de onde a
 * outra metade afundou (essa só aparece no título da aba).
 */
export function MudBubbles() {
  const slots = SURFACE_BUBBLES.length * 2
  const step = 640 / slots
  return (
    <Plate label="pântano com bolhas de letras na superfície">
      <div className="grid gap-5">
        <PlateHeader title="duas margens" mark="superfície" />
        <svg viewBox="0 0 720 220" role="img" className="dante-svg" aria-label={"Superfície escura de um pântano. Sete bolhas com letras, alternadas com sete covas vazias: " + [...SURFACE_BUBBLES].join(", ") + "."}>
          {[0, 1, 2, 3].map((wave) => (
            <path key={wave} d={"M20 " + (150 + wave * 14) + "Q180 " + (140 + wave * 14) + " 360 " + (150 + wave * 14) + "T700 " + (150 + wave * 14)} fill="none" stroke="#3a3833" />
          ))}
          <path d="M20 120H700" stroke="#5e5a52" />
          {Array.from({ length: slots }, (_, slot) => {
            const x = 40 + step * (slot + 0.5)
            if (slot % 2 === 1) {
              return <ellipse key={slot} cx={x} cy="126" rx="12" ry="4" fill="#0e0d0c" stroke="#3a3833" />
            }
            const letter = SURFACE_BUBBLES[slot / 2]
            const lift = [0, 18, 6, 24, 10, 20, 4][slot / 2]
            return (
              <g key={slot}>
                <circle cx={x} cy={96 - lift} r="18" fill="none" stroke="currentColor" strokeOpacity=".7" />
                <text x={x} y={102 - lift} fill="#e9e4d8" fontFamily="monospace" fontSize="17" textAnchor="middle">{letter}</text>
              </g>
            )
          })}
        </svg>
        <div className="flex flex-wrap justify-between gap-3 border-t border-border pt-3 text-xs text-muted-foreground">
          <span>metade da fala subiu</span>
          <span>a outra afundou</span>
        </div>
      </div>
    </Plate>
  )
}

/** Fase 6 · pedra quadriculada e uma leitura por coordenadas. */
export function StoneGrid() {
  return (
    <Plate label="pedra com grade de seis por seis e uma lista de coordenadas">
      <div className="grid gap-5">
        <PlateHeader title="grade E" mark="coluna · linha" />
        <table className="mx-auto border-collapse font-mono text-base sm:text-lg">
          <thead>
            <tr>
              <th className="size-9" />
              {[...STONE_COLUMNS].map((column) => (
                <th key={column} scope="col" className="size-9 text-xs font-normal text-muted-foreground">{column}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {STONE_ROWS.map((row, rowIndex) => (
              <tr key={rowIndex}>
                <th scope="row" className="size-9 text-xs font-normal text-muted-foreground">{rowIndex + 1}</th>
                {[...row].map((letter, columnIndex) => (
                  <td key={columnIndex} className="size-9 border border-border text-center">{letter}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <p className="border-t border-border pt-3 text-center font-mono text-sm tracking-[.18em] text-vigil">
          {STONE_READING.join(" · ")}
        </p>
      </div>
    </Plate>
  )
}

/** Fase 7 · a superfície do rio; as profundidades só respondem pelo endereço. */
export function RiverDepths({ level }: { level: number | null }) {
  const valid = level !== null && level >= 1 && level <= RIVER_DEPTHS.length
  return (
    <Plate label="corte de um rio com três profundidades">
      <div className="grid gap-5">
        <PlateHeader title="limiar F" mark={valid ? "nível " + level : "superfície"} />
        <svg viewBox="0 0 720 220" role="img" className="dante-svg" aria-label={"Corte de um rio em três faixas de profundidade" + (valid ? "; a faixa " + level + " está acesa." : "; nenhuma faixa acesa.")}>
          <path d="M20 40Q180 30 360 40T700 40" fill="none" stroke="#8d8578" />
          {RIVER_DEPTHS.map((_, index) => {
            const top = 52 + index * 52
            const lit = valid && level === index + 1
            return (
              <g key={index}>
                <rect x="40" y={top} width="640" height="44" fill={lit ? "currentColor" : "#1c1a18"} fillOpacity={lit ? 0.22 : 1} stroke={lit ? "currentColor" : "#2f2c28"} />
                <text x="56" y={top + 27} fill={lit ? "currentColor" : "#6d685f"} fontFamily="monospace" fontSize="12">{["I", "II", "III"][index]}</text>
              </g>
            )
          })}
          <text x="360" y="212" fill="#aaa394" fontFamily="monospace" fontSize="11" textAnchor="middle">
            {valid ? "a resposta deste nível não está na placa" : level === null ? RIVER_SURFACE : "o sangue não tem esse fundo"}
          </text>
        </svg>
      </div>
    </Plate>
  )
}

/** Fase 8 · dois canais alternados letra a letra. */
export function TwoChannels() {
  return (
    <Plate label="registro com dois canais alternados">
      <div className="grid gap-5">
        <PlateHeader title="dois canais" mark="I + II" />
        <p className="break-all font-mono text-lg leading-loose tracking-[.45em] sm:text-2xl">{TWO_CHANNELS}</p>
        <div className="flex flex-wrap justify-between gap-3 border-t border-border pt-3 text-xs text-muted-foreground">
          <span>uma rota e um limite</span>
          <span>{TWO_CHANNELS.length} sinais</span>
        </div>
      </div>
    </Plate>
  )
}

/**
 * Fase 9 · só os dias aparecem. A grade completa escrita em ?grade= faz o
 * gelo ceder: os dias deduzidos acendem e as letras vão para a aba.
 */
export function FrozenGrid({ grade }: { grade: string | null }) {
  const solved = readFrozenGrid(grade)
  const status = solved === null ? "o endereço espera a grade inteira, linha por linha" : solved === false ? "a grade não fecha" : "o gelo cedeu, mas não nesta página"
  return (
    <Plate label="grade de três por três com dias incompletos">
      <div className="grid gap-5">
        <PlateHeader title="grade G" mark={solved ? "cedeu" : "imóvel"} />
        <div className="mx-auto grid w-full max-w-xs grid-cols-3 border border-border">
          {FROZEN_DAYS.flatMap((row, rowIndex) =>
            row.map((day, columnIndex) => {
              const shown = day ?? (solved ? solved[rowIndex][columnIndex] : null)
              return (
                <div key={rowIndex + "-" + columnIndex} className="flex aspect-square items-center justify-center border border-border">
                  <span className={"font-serif text-4xl " + (day === null ? "text-vigil" : "text-foreground")}>{shown ?? "·"}</span>
                </div>
              )
            })
          )}
        </div>
        <div className="grid gap-1 border-t border-border pt-3 text-center">
          <span className="font-mono text-sm tracking-[.2em] text-vigil">{FROZEN_TEMPLATE}</span>
          <span className="text-xs text-muted-foreground">{status}</span>
        </div>
      </div>
    </Plate>
  )
}

/** Fase 10 · nove anéis; cada um guarda, em marcas, a posição de uma letra. */
export function InfernoRings() {
  return (
    <section className="flex flex-col gap-6">
      <Plate label="nove anéis concêntricos, cada um com um número de marcas">
        <svg viewBox="0 0 720 520" role="img" className="dante-svg">
          <title>nove anéis da descida</title>
          <desc>
            {"Nove anéis concêntricos, do mais externo (01) ao mais interno (09). Marcas por anel: " + RING_INDICES.map((count, index) => String(index + 1).padStart(2, "0") + " com " + count).join(", ") + "."}
          </desc>
          <path d="M360 39V471M144 255H576" stroke="#615d55" strokeDasharray="3 10" opacity=".45" />
          {RING_INDICES.map((count, index) => {
            const radius = 216 - index * 22
            return (
              <g key={index}>
                <circle cx="360" cy="255" r={radius} fill="none" stroke="#615d55" strokeOpacity=".8" />
                {Array.from({ length: count }, (_, tick) => {
                  // Espaço fixo em pixels, e cada anel começa num ângulo próprio.
                  const angle = ((-60 + index * 25) * Math.PI) / 180 + (tick * 14) / radius
                  const inner = radius - 5
                  const outer = radius + 5
                  return (
                    <path
                      key={tick}
                      d={"M" + round(360 + Math.cos(angle) * inner) + " " + round(255 + Math.sin(angle) * inner) + "L" + round(360 + Math.cos(angle) * outer) + " " + round(255 + Math.sin(angle) * outer)}
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  )
                })}
                <text x="360" y={255 - radius + 4} fill="#e9e4d8" stroke="#161514" strokeWidth="5" paintOrder="stroke" fontFamily="monospace" fontSize="11" textAnchor="middle">
                  {String(index + 1).padStart(2, "0")}
                </text>
              </g>
            )
          })}
          <circle cx="360" cy="255" r="13" fill="currentColor" />
          <text x="360" y="500" fill="#aaa394" fontFamily="monospace" fontSize="11" textAnchor="middle">o centro não é o fim do caminho</text>
        </svg>
      </Plate>
      <MetaAnswers from={1} to={9} />
    </section>
  )
}

function round(value: number) {
  return Math.round(value * 10) / 10
}

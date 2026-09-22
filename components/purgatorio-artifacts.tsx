import { MetaAnswers } from "@/components/meta-answers"
import { Plate, PlateHeader } from "@/components/plate"
import { HiddenTitle, RunningTitle } from "@/components/tab-signals"
import {
  CARVINGS,
  FIRE_LINES,
  FIRE_TEMPLATE,
  fireOpens,
  FRUIT_GROUND,
  FRUIT_SLOPE,
  FRUITS,
  HIDDEN_TITLE,
  MIRRORED_LATIN,
  RUNNING_TITLES,
  SHADOWS,
  SMOKE_LINES,
  smokeLevel,
  STATION_INDICES,
  throughSmoke,
  WATER_TEXT,
  waterState,
} from "@/lib/purgatorio-material"

const ROMAN = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"]

function Caption({ left, right }: { left: string; right?: string }) {
  return (
    <div className="flex flex-wrap justify-between gap-3 border-t border-border pt-3 text-xs text-muted-foreground">
      <span>{left}</span>
      {right && <span>{right}</span>}
    </div>
  )
}

/** Fase 11 · quatro luzes no céu; embaixo do horizonte, só o reflexo. */
export function ShoreReflection() {
  const step = 640 / MIRRORED_LATIN.length
  return (
    <Plate label="horizonte com palavras refletidas na água">
      <div className="grid gap-5">
        <PlateHeader title="horizonte A" mark="reflexo" />
        <svg viewBox="0 0 720 240" role="img" className="dante-svg" aria-label={"Céu com quatro luzes sobre uma linha de horizonte. Abaixo, refletidas de cabeça para baixo: " + MIRRORED_LATIN.join(", ") + "."}>
          {[[250, 40], [300, 70], [350, 36], [300, 22]].map(([cx, cy]) => (
            <circle key={cx + "-" + cy} cx={cx + 110} cy={cy} r="3" fill="currentColor" />
          ))}
          <path d="M20 120H700" stroke="#8d8578" />
          {[0, 1, 2].map((wave) => (
            <path key={wave} d={"M20 " + (200 + wave * 12) + "Q180 " + (194 + wave * 12) + " 360 " + (200 + wave * 12) + "T700 " + (200 + wave * 12)} fill="none" stroke="#2f3a44" />
          ))}
          {MIRRORED_LATIN.map((word, index) => {
            const x = 40 + step * (index + 0.5)
            return (
              <text key={word} x={x} y="-126" transform="matrix(1 0 0 -1 0 0)" fill="#e9e4d8" fillOpacity=".6" fontFamily="serif" fontSize="22" letterSpacing="3" textAnchor="middle">
                {word}
              </text>
            )
          })}
        </svg>
        <Caption left="o céu não tem letras" right="a água fala outra língua" />
      </div>
    </Plate>
  )
}

/** Fase 12 · sete relevos sem nome, cada um com a posição de uma letra. */
export function PavementCarvings() {
  return (
    <Plate label="sete relevos do pavimento, descritos sem nome">
      <div className="grid gap-5">
        <PlateHeader title="sete lacunas" mark="pavimento" />
        <ol className="grid gap-3">
          {CARVINGS.map((carving, index) => (
            <li key={carving.riddle} className="grid grid-cols-[2.5rem_1fr_auto] items-baseline gap-3 border-b border-border/70 pb-3">
              <span className="font-mono text-xs text-muted-foreground">{ROMAN[index + 1]}</span>
              <span className="font-serif text-base sm:text-lg">{carving.riddle}</span>
              <span className="font-mono text-xs text-vigil">letra {carving.position}</span>
            </li>
          ))}
        </ol>
        <Caption left="os nomes vêm em português" right="7 lacunas" />
      </div>
    </Plate>
  )
}

/** Fase 13 · o curso de um rio visto por quem tem os olhos costurados. */
export function RiverBlind() {
  return (
    <Plate label="curso de um rio com quatro margens sem nome">
      <div className="grid gap-5">
        <PlateHeader title="curso do rio" mark="olhos costurados" />
        <svg viewBox="0 0 720 220" role="img" className="dante-svg" aria-label="Um rio nasce numa montanha à esquerda e corre até o mar à direita, passando por quatro marcas sem nome. No canto, dois olhos fechados com pontos de costura.">
          <path d="M30 60L70 20L110 60Z" fill="none" stroke="#8d8578" />
          <path d="M70 60C150 150 230 40 320 120S480 190 560 110S650 90 700 150" fill="none" stroke="currentColor" strokeWidth="2" />
          {[[170, 96], [300, 110], [430, 160], [560, 110]].map(([cx, cy], index) => (
            <g key={index}>
              <circle cx={cx} cy={cy} r="9" fill="#0e0d0c" stroke="#8d8578" />
              <text x={cx} y={cy + 30} fill="#6d685f" fontFamily="monospace" fontSize="11" textAnchor="middle">?</text>
            </g>
          ))}
          <path d="M660 200H700" stroke="#2f3a44" strokeWidth="6" />
          <g stroke="#aaa394" strokeWidth="1.5" fill="none">
            <path d="M600 30Q620 42 640 30M650 30Q670 42 690 30" />
            {[606, 614, 622, 632, 656, 664, 672, 682].map((x) => <path key={x} d={"M" + x + " 30V40"} />)}
          </g>
        </svg>
        <Caption left="de olhos costurados, não se vê quem vive nas margens" right="quem vive nelas ficou fora da página" />
      </div>
    </Plate>
  )
}

/** Fase 14 · a fumaça cobre as falas; ?fumaca= regula a densidade. */
export function SmokeScreen({ fumaca }: { fumaca?: string }) {
  const level = smokeLevel(fumaca)
  // Cada linha continua a contagem de letras da anterior: a névoa não se repete.
  const letterCounts = SMOKE_LINES.map((line) => [...line].filter((char) => /\p{L}/u.test(char)).length)
  const offsets = letterCounts.map((_, index) => letterCounts.slice(0, index).reduce((sum, count) => sum + count, 0))
  return (
    <Plate label="três falas cobertas por fumaça">
      <div className="grid gap-5">
        <PlateHeader title="contraste B" mark={"fumaça " + level + "%"} />
        <div className="grid gap-3 py-2">
          {SMOKE_LINES.map((line, index) => (
            <p key={line} className="font-serif text-lg tracking-[.04em] sm:text-2xl">{throughSmoke(line, level, offsets[index])}</p>
          ))}
        </div>
        <Caption left={"?fumaca=" + level} right={level === 0 ? "o ar ficou limpo" : "a fumaça não é da página"} />
      </div>
    </Plate>
  )
}

/** Fase 15 · pontos que não param; o que dizem passa pelo título da aba. */
export function RunningSouls() {
  return (
    <Plate label="pontos correndo em fila">
      <RunningTitle titles={RUNNING_TITLES} />
      <div className="grid gap-5">
        <PlateHeader title="intervalos C" mark="sem pausa" />
        <div className="relative h-24 overflow-hidden border-y border-border">
          {Array.from({ length: 7 }, (_, index) => (
            <span key={index} className="dante-runner" style={{ animationDelay: index * -0.9 + "s", top: 18 + (index % 3) * 22 + "px" }} />
          ))}
        </div>
        <Caption left="ninguém para aqui para falar" right="o que se diz passa correndo lá em cima" />
      </div>
    </Plate>
  )
}

/** Fase 16 · almas de bruços; a aba só fala a quem desvia o olhar. */
export function ProneSouls() {
  return (
    <Plate label="almas deitadas de bruços">
      <HiddenTitle title={HIDDEN_TITLE} />
      <div className="grid gap-5">
        <PlateHeader title="orientação" mark="de bruços" />
        <svg viewBox="0 0 720 160" role="img" className="dante-svg" aria-label="Figuras deitadas de bruços no chão, com o rosto voltado para a terra.">
          <path d="M20 120H700" stroke="#5e5a52" />
          {[80, 210, 340, 470, 600].map((x) => (
            <g key={x} stroke="#8d8578" strokeWidth="2" fill="none">
              <circle cx={x} cy="110" r="8" />
              <path d={"M" + (x + 8) + " 112H" + (x + 90)} />
              <path d={"M" + (x + 40) + " 112L" + (x + 50) + " 118M" + (x + 60) + " 112L" + (x + 70) + " 118"} />
            </g>
          ))}
        </svg>
        <Caption left="de bruços, ninguém olha a página" right="o recado é para quem desvia o olhar" />
      </div>
    </Plate>
  )
}

/** Fase 17 · frutos com sílabas e sombras numeradas no chão. */
export function FruitShadows() {
  const example = FRUITS[1]
  const exampleShadow = example.x + (FRUIT_GROUND - example.y) * FRUIT_SLOPE
  const sunX = example.x - (example.y - 10) * FRUIT_SLOPE
  return (
    <Plate label="árvore com frutos e sombras numeradas">
      <div className="grid gap-5">
        <PlateHeader title="distâncias D" mark="sol · sombra" />
        <svg viewBox="0 0 720 300" role="img" className="dante-svg" aria-label={"Uma árvore larga no alto e estreita embaixo, com seis frutos: " + FRUITS.map((fruit) => fruit.syllable).join(", ") + ". No chão, seis sombras numeradas. Um raio de sol tracejado liga o sol, um fruto e a sombra dele."}>
          <circle cx={sunX} cy="10" r="8" fill="currentColor" />
          <path d={"M" + sunX + " 10L" + exampleShadow + " " + FRUIT_GROUND} stroke="currentColor" strokeDasharray="4 6" opacity=".7" />
          <path d="M40 40Q300 -10 560 40Q540 180 330 230Q140 180 40 40Z" fill="#141a14" stroke="#3a4a3a" />
          <path d="M330 230V260" stroke="#5e5a52" strokeWidth="4" />
          <path d={"M20 " + FRUIT_GROUND + "H700"} stroke="#5e5a52" />
          {FRUITS.map((fruit) => (
            <g key={fruit.syllable}>
              <circle cx={fruit.x} cy={fruit.y} r="17" fill="#2a2016" stroke="currentColor" strokeOpacity=".6" />
              <text x={fruit.x} y={fruit.y + 4} fill="#e9e4d8" fontFamily="monospace" fontSize="11" textAnchor="middle">{fruit.syllable}</text>
            </g>
          ))}
          {SHADOWS.map((shadow) => (
            <g key={shadow.x}>
              <ellipse cx={shadow.x} cy={FRUIT_GROUND + 4} rx="16" ry="4" fill="#000" fillOpacity=".6" />
              <text x={shadow.x} y={FRUIT_GROUND + 26} fill="#aaa394" fontFamily="monospace" fontSize="12" textAnchor="middle">{shadow.order}</text>
            </g>
          ))}
        </svg>
        <Caption left="o sol está longe: todos os raios correm paralelos ao tracejado" right="ninguém alcança os frutos" />
      </div>
    </Plate>
  )
}

/** Fase 18 · um muro de fogo que só se abre a um nome, escrito no endereço. */
export function FireWall({ muro }: { muro?: string }) {
  const opened = fireOpens(muro)
  return (
    <Plate label="muro de fogo">
      <div className="grid gap-5">
        <PlateHeader title="muro de fogo" mark={opened ? "aberto" : "fogo"} />
        {opened ? (
          <div className="grid gap-3 py-2 font-serif text-lg sm:text-2xl">
            {FIRE_LINES.map((line) => <p key={line}>{line}</p>)}
          </div>
        ) : (
          <svg viewBox="0 0 720 150" role="img" className="dante-svg" aria-label="Um muro de chamas ocupa toda a largura.">
            {Array.from({ length: 24 }, (_, index) => {
              const x = 20 + index * 29
              const height = 60 + ((index * 37) % 50)
              return <path key={index} d={"M" + x + " 140Q" + (x + 8) + " " + (140 - height) + " " + (x + 14) + " " + (140 - height - 10) + "Q" + (x + 20) + " " + (140 - height) + " " + (x + 28) + " 140Z"} fill="currentColor" fillOpacity={0.25 + (index % 3) * 0.15} />
            })}
          </svg>
        )}
        <Caption
          left={FIRE_TEMPLATE}
          right={opened === null ? "entre ela e você há este muro" : opened ? "o resto não cabe na página" : "o fogo não conhece esse nome"}
        />
      </div>
    </Plate>
  )
}

/** Fase 19 · duas águas: ?agua=1 apaga, ?agua=2 devolve. */
export function TwoWaters({ agua }: { agua?: string }) {
  const state = waterState(agua)
  return (
    <Plate label="texto apagado por uma água e devolvido por outra">
      <div className="grid gap-5">
        <PlateHeader title="dois fluxos" mark={state === "remember" ? "segunda água" : state === "forget" ? "primeira água" : "jardim"} />
        <div className="grid gap-3 py-2 font-serif text-lg sm:text-2xl">
          {WATER_TEXT.map((line) => (
            <p key={line}>{state === "remember" ? line : line.replace(/\p{L}/gu, state === "forget" ? " " : "·")}</p>
          ))}
        </div>
        <Caption
          left="?agua=1"
          right={state === "surface" ? "o jardim tem mais de uma água" : state === "forget" ? "tudo o que estava aqui foi esquecido" : state === "remember" ? "a memória voltou" : "não há essa água no jardim"}
        />
      </div>
    </Plate>
  )
}

/** Fase 20 · a montanha com nove estações, cada uma com um algarismo romano. */
export function PurgatorioMountain() {
  return (
    <section className="flex flex-col gap-6">
      <Plate label="montanha com nove estações, cada uma com um algarismo romano">
        <svg viewBox="0 0 720 500" role="img" className="dante-svg">
          <title>nove estações da subida</title>
          <desc>{"Da praia (01) ao jardim (09). Algarismos por estação: " + STATION_INDICES.map((value, index) => String(index + 1).padStart(2, "0") + " " + ROMAN[value]).join(", ") + "."}</desc>
          <path d="M98 422 Q210 380 290 290 Q340 233 360 78 Q382 233 430 290 Q510 380 622 422Z" fill="#161a1f" stroke="#8d8578" strokeWidth="2" />
          {STATION_INDICES.map((value, index) => {
            const y = 422 - index * 40
            const width = 180 - index * 15
            return (
              <g key={index}>
                <path d={"M" + (360 - width) + " " + y + "H" + (360 + width)} stroke="#5e5a52" />
                <text x={360 - width - 12} y={y + 4} fill="#aaa394" fontFamily="monospace" fontSize="11" textAnchor="end">{String(index + 1).padStart(2, "0")}</text>
                <text x={360 + width + 12} y={y + 4} fill="currentColor" fontFamily="serif" fontSize="15">{ROMAN[value]}</text>
              </g>
            )
          })}
          <text x="360" y="474" fill="#aaa394" fontFamily="monospace" fontSize="11" textAnchor="middle">a subida apaga uma marca por vez</text>
        </svg>
      </Plate>
      <MetaAnswers from={11} to={19} />
    </section>
  )
}

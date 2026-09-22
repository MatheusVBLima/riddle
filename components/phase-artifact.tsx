import type { ReactNode } from "react"

import { FinalMetaPuzzle } from "@/components/final-meta-puzzle"
import { FlowerMark } from "@/components/flower-mark"
import type { ArtifactKind } from "@/lib/phases"

function Plate({ children, label }: { children: ReactNode; label: string }) {
  return (
    <figure className="dante-plate" aria-label={label}>
      {children}
    </figure>
  )
}

function RingMap({ highlight, label }: { highlight?: number; label: string }) {
  return (
    <Plate label={label}>
      <svg viewBox="0 0 720 520" role="img" aria-labelledby="rings-title rings-desc" className="dante-svg">
        <title id="rings-title">mapa concêntrico da descida</title>
        <desc id="rings-desc">{label}</desc>
        <rect width="720" height="520" fill="#101012" />
        {Array.from({ length: 9 }, (_, index) => {
          const radius = 216 - index * 22
          const active = highlight === index
          return (
            <circle
              key={index}
              cx="360"
              cy="255"
              r={radius}
              fill={active ? "rgba(201,148,79,.12)" : "none"}
              stroke={active ? "#c9944f" : "#615d55"}
              strokeWidth={active ? "3" : "1"}
              strokeOpacity={active ? "1" : ".7"}
            />
          )
        })}
        <circle cx="360" cy="255" r="13" fill="#c9944f" />
        <path d="M360 39V471M144 255H576" stroke="#615d55" strokeDasharray="3 10" opacity=".45" />
        <g fill="#e9e4d8" fontFamily="monospace" fontSize="12" textAnchor="middle">
          {Array.from({ length: 9 }, (_, index) => {
            const angle = (index / 9) * Math.PI * 2 - Math.PI / 2
            const radius = 216 - index * 22
            const x = 360 + Math.cos(angle) * radius
            const y = 255 + Math.sin(angle) * radius
            return <text key={index} x={x} y={y - 8}>{String(index + 1).padStart(2, "0")}</text>
          })}
        </g>
        <text x="360" y="493" fill="#aaa394" fontFamily="monospace" fontSize="11" textAnchor="middle">a ordem importa mais que a distância</text>
      </svg>
    </Plate>
  )
}

function CharacterCard({ symbol, title, lines }: { symbol: string; title: string; lines: string[] }) {
  return (
    <Plate label={title}>
      <div className="grid gap-6 sm:grid-cols-[9rem_1fr]">
        <div className="flex min-h-36 items-center justify-center border border-border bg-background">
          <span className="font-serif text-7xl text-amber-200/80" aria-hidden="true">{symbol}</span>
        </div>
        <div className="flex flex-col justify-center gap-3">
          <h2 className="font-serif text-2xl">{title}</h2>
          <ul className="dante-ledger">
            {lines.map((line) => <li key={line}>{line}</li>)}
          </ul>
        </div>
      </div>
    </Plate>
  )
}

function SentencePlate({ title, lines, marks = 3 }: { title: string; lines: string[]; marks?: number }) {
  return (
    <Plate label={title}>
      <div className="grid gap-5">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <span className="font-mono text-xs tracking-[.22em] text-muted-foreground">{title}</span>
          <span className="dante-rule" aria-hidden="true">{Array.from({ length: marks }, (_, index) => <i key={index} />)}</span>
        </div>
        <div className="grid gap-3 font-serif text-lg leading-relaxed text-foreground/90">
          {lines.map((line) => <p key={line}>{line}</p>)}
        </div>
      </div>
    </Plate>
  )
}

function Mountain({ highlight }: { highlight: number }) {
  return (
    <Plate label="montanha do purgatório com nove estações">
      <svg viewBox="0 0 720 500" role="img" className="dante-svg" aria-label="Montanha do purgatório; nove pontos marcam a praia, os sete terraços e o jardim no topo.">
        <rect width="720" height="500" fill="#101012" />
        <path d="M98 422 Q210 380 290 290 Q340 233 360 78 Q382 233 430 290 Q510 380 622 422Z" fill="#201e1c" stroke="#8d8578" strokeWidth="2" />
        {Array.from({ length: 9 }, (_, index) => {
          const y = 422 - index * 42
          const width = 180 - index * 13
          const active = index === highlight
          return <g key={index}>
            <path d={"M" + (360 - width) + " " + y + "H" + (360 + width)} stroke={active ? "#c9944f" : "#5e5a52"} strokeWidth={active ? "5" : "1"} />
            <text x={360 - width - 12} y={y + 4} fill={active ? "#c9944f" : "#aaa394"} fontFamily="monospace" fontSize="11" textAnchor="end">{String(index + 1).padStart(2, "0")}</text>
          </g>
        })}
        <circle cx="360" cy="78" r="8" fill="#c9944f" />
        <text x="360" y="474" fill="#aaa394" fontFamily="monospace" fontSize="11" textAnchor="middle">a subida apaga uma marca por vez</text>
      </svg>
    </Plate>
  )
}

function Sphere({ highlight, title }: { highlight: number; title: string }) {
  return (
    <Plate label={title}>
      <svg viewBox="0 0 720 460" role="img" className="dante-svg">
        <title>{title}</title>
        <desc>Nove esferas celestes concêntricas, com uma delas destacada e um ponto imóvel além de todas.</desc>
        <rect width="720" height="460" fill="#101012" />
        {Array.from({ length: 9 }, (_, index) => {
          const radius = 184 - index * 18
          const active = index === highlight
          return <circle key={index} cx="360" cy="220" r={radius} fill="none" stroke={active ? "#c9944f" : "#6d685f"} strokeWidth={active ? "4" : "1"} opacity={active ? "1" : ".62"} />
        })}
        <circle cx="360" cy="220" r="8" fill="#e9e4d8" />
        <circle cx="360" cy="220" r="201" fill="none" stroke="#c9944f" strokeDasharray="1 9" strokeWidth="2" opacity=".55" />
        <text x="360" y="35" fill="#aaa394" fontFamily="monospace" fontSize="11" textAnchor="middle">movimento · ordem · visão</text>
        <text x="360" y="420" fill="#aaa394" fontFamily="monospace" fontSize="11" textAnchor="middle">a nona esfera não é o fim do espaço</text>
      </svg>
    </Plate>
  )
}

function SymbolArtifact({ media }: { media: ArtifactKind }) {
  switch (media) {
    case "limbo":
      return <CharacterCard symbol="V" title="um castelo sem tormento" lines={["quatro nomes da antiguidade", "uma quinta voz latina", "nenhuma chama, nenhum batismo"]} />
    case "wind":
      return <SentencePlate title="a corrente" lines={["não há chão para os pés.", "dois nomes ficam unidos pelo movimento.", "a testemunha fala no feminino."]} />
    case "rain":
      return <SentencePlate title="chuva sem margem" lines={["três bocas.", "um nome de cidadão.", "o céu nunca se abre."]} marks={3} />
    case "weights":
      return <SentencePlate title="peso contra peso" lines={["duas procissões.", "uma palavra grega para riqueza.", "a roda não chega a lugar algum."]} marks={4} />
    case "river":
      return <SentencePlate title="água escura" lines={["lama na superfície.", "um rosto de Argenti.", "a ira não deixa a margem."]} marks={5} />
    case "tombs":
      return <CharacterCard symbol="X" title="uma pedra em fogo" lines={["tumbas levantadas", "visão do futuro", "Florença ainda é uma disputa"]} />
    case "blood":
      return <SentencePlate title="nível do rio" lines={["o sangue sobe conforme a culpa.", "um corpo híbrido guarda a passagem.", "a flecha mede a distância."]} marks={6} />
    case "flame":
      return (
        <Plate label="chama dupla">
          <div className="grid gap-4">
            <audio controls preload="metadata" src="/dante/chama.wav" className="w-full" aria-label="gravação de uma chama com duas vozes sobrepostas" />
            <div className="grid grid-cols-2 gap-3 font-mono text-xs text-muted-foreground">
              <span>uma luz</span><span>duas vozes</span><span>uma rota</span><span>nenhuma autorização</span>
            </div>
          </div>
        </Plate>
      )
    case "ice":
      return <SentencePlate title="cocito" lines={["o centro é imóvel.", "a boca trabalha sem fome.", "a história começa numa torre."]} marks={9} />
    case "shore":
      return <SentencePlate title="a praia" lines={["o guardião não é um anjo.", "a espada fica baixa.", "liberdade antes da subida."]} marks={2} />
    case "marble":
      return <Mountain highlight={1} />
    case "eyes":
      return <SentencePlate title="sem olhar" lines={["o fio fecha os olhos.", "a roupa tem uma cor.", "o pedido vem de uma voz invisível."]} marks={2} />
    case "smoke":
      return <SentencePlate title="fumaça" lines={["a montanha desaparece.", "a conversa continua.", "liberdade contra os astros."]} marks={3} />
    case "race":
      return <SentencePlate title="movimento" lines={["a demora virou corrida.", "ninguém termina antes dos outros.", "o amor deveria ter começado antes."]} marks={4} />
    case "earth":
      return <Mountain highlight={5} />
    case "fruit":
      return <SentencePlate title="árvore" lines={["água perto.", "fruto fora do alcance.", "fome que não é só do corpo."]} marks={6} />
    case "fire":
      return <SentencePlate title="parede" lines={["a passagem arde.", "a forma antiga fica para trás.", "uma voz estrangeira espera do outro lado."]} marks={7} />
    case "garden":
      return <CharacterCard symbol="B" title="o jardim no alto" lines={["duas águas", "uma mulher entre árvores", "um guia muda de rosto"]} />
    case "moon":
      return <Sphere highlight={0} title="a primeira esfera" />
    case "mercury":
      return <Sphere highlight={1} title="a segunda esfera" />
    case "venus":
      return <Sphere highlight={2} title="a terceira esfera" />
    case "sun":
      return <Sphere highlight={3} title="a quarta esfera" />
    case "cross":
      return (
        <Plate label="cruz de luz na esfera de Marte">
          <svg viewBox="0 0 720 460" role="img" className="dante-svg">
            <rect width="720" height="460" fill="#101012" />
            <path d="M360 60V390M175 225H545" stroke="#c9944f" strokeWidth="10" />
            {Array.from({ length: 18 }, (_, index) => <circle key={index} cx={200 + (index % 9) * 40} cy={130 + Math.floor(index / 9) * 190} r="4" fill="#e9e4d8" />)}
            <text x="360" y="35" fill="#aaa394" fontFamily="monospace" fontSize="11" textAnchor="middle">um ancestral aguarda no braço direito</text>
          </svg>
        </Plate>
      )
    case "eagle":
      return <CharacterCard symbol="A" title="muitas vozes, um corpo" lines={["letras que formam uma sentença", "justiça como figura", "um bico aponta para o centro"]} />
    case "ladder":
      return (
        <Plate label="escada dourada entre esferas">
          <svg viewBox="0 0 720 460" role="img" className="dante-svg">
            <rect width="720" height="460" fill="#101012" />
            <path d="M222 386L400 70M310 386L488 70" stroke="#c9944f" strokeWidth="4" />
            {Array.from({ length: 10 }, (_, index) => {
              const y = 370 - index * 31
              const left = 231 + index * 17.7
              return <path key={index} d={"M" + left + " " + y + "H" + (left + 88)} stroke="#e9e4d8" strokeWidth="2" />
            })}
            <text x="360" y="425" fill="#aaa394" fontFamily="monospace" fontSize="11" textAnchor="middle">o silêncio também pode ser um guia</text>
          </svg>
        </Plate>
      )
    case "virtues":
      return <SentencePlate title="três exames" lines={["acreditar", "esperar", "amar"]} marks={3} />
    case "angels":
      return <Sphere highlight={8} title="o movimento de tudo" />
    case "gate":
      return (
        <Plate label="porta de entrada da viagem">
          <svg viewBox="0 0 720 420" role="img" className="dante-svg">
            <rect width="720" height="420" fill="#101012" />
            <path d="M205 365V112Q205 44 360 44T515 112V365" fill="none" stroke="#c9944f" strokeWidth="4" />
            <path d="M258 365V144Q258 97 360 97T462 144V365" fill="none" stroke="#6d685f" strokeWidth="2" />
            <path d="M311 365V170Q311 150 360 150T409 170V365" fill="none" stroke="#6d685f" />
            <text x="360" y="395" fill="#aaa394" fontFamily="monospace" fontSize="11" textAnchor="middle">uma porta não é a mesma coisa que um caminho</text>
          </svg>
        </Plate>
      )
    case "inferno-meta":
      return <RingMap highlight={4} label="nove círculos concêntricos; a quarta marca está acesa para indicar que a ordem é estrutural." />
    case "purgatorio-meta":
      return <Mountain highlight={8} />
    case "paradiso-meta":
      return (
        <section className="flex flex-col gap-6">
          <Sphere highlight={8} title="nove esferas e um ponto além delas" />
          <div className="grid gap-3 border-y border-border py-4 font-serif text-lg leading-relaxed">
            <p>o primeiro caminho termina olhando para as estrelas.</p>
            <p>o segundo sobe até as estrelas.</p>
            <p>o terceiro move o sol e as estrelas.</p>
          </div>
          <FinalMetaPuzzle />
        </section>
      )
    default:
      return <SymbolArtifact media="gate" />
  }
}

export function PhaseArtifact({ media }: { media?: ArtifactKind }) {
  return <section className="flex flex-col gap-6">{media ? <SymbolArtifact media={media} /> : <SymbolArtifact media="gate" />}</section>
}

export function PhaseFooter({ index, cantica, unit }: { index: number; cantica: string; unit: string }) {
  return (
    <footer className="flex items-center justify-between border-t border-border pt-4 text-xs text-muted-foreground">
      <div className="flex items-center gap-2">
        <FlowerMark className="size-4" />
        <span>vigília · {cantica} · {unit}</span>
      </div>
      <span className="font-mono tabular-nums">{String(index).padStart(2, "0")}/30</span>
    </footer>
  )
}

export function CanticaMark({ cantica, unit }: { cantica: string; unit: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border pb-4 text-xs text-muted-foreground">
      <span className="font-mono uppercase tracking-[.18em]">{cantica}</span>
      <span className="font-serif italic">{unit}</span>
    </div>
  )
}

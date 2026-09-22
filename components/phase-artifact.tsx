import { FlowerMark } from "@/components/flower-mark"
import {
  BrokenVoices,
  CrossingStrip,
  FrozenGrid,
  InfernoRings,
  MudBubbles,
  PitchRecord,
  RiverDepths,
  StoneGrid,
  TwoChannels,
} from "@/components/inferno-artifacts"
import {
  AngelRings,
  CrossMorse,
  CrownOfLights,
  EagleDocument,
  ExamBoard,
  GoldenLadder,
  MoonSurfaces,
  OrbitPaths,
  ParadisoSpheres,
  SpiralRoute,
} from "@/components/paradiso-artifacts"
import { Plate } from "@/components/plate"
import {
  FireWall,
  FruitShadows,
  PavementCarvings,
  ProneSouls,
  PurgatorioMountain,
  RiverBlind,
  RunningSouls,
  ShoreReflection,
  SmokeScreen,
  TwoWaters,
} from "@/components/purgatorio-artifacts"
import { levelFrom } from "@/lib/inferno-material"
import type { ArtifactKind } from "@/lib/phases"

/** Parâmetros da URL que algumas fases leem (primeiro valor de cada chave). */
export type PhaseQuery = Record<string, string | undefined>

function CipherPlate() {
  return (
    <Plate label="folha deslocada">
      <div className="grid gap-5">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <span className="font-mono text-xs tracking-[.22em] text-muted-foreground">folha sem origem</span>
          <span className="font-mono text-xs text-vigil/80">III</span>
        </div>
        <p className="break-words font-mono text-lg leading-relaxed tracking-[.08em] text-foreground sm:text-xl">
          ULPLQL / GRLV QRPHV / XP OLYUR / YHQWR
        </p>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-3 text-xs text-muted-foreground">
          <span>margem: III</span>
          <span>cada letra conserva a distância</span>
        </div>
      </div>
    </Plate>
  )
}

function LicensedReading({ src, title, source }: { src: string; title: string; source: string }) {
  return (
    <Plate label={title}>
      <div className="grid gap-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <span className="font-mono text-xs tracking-[.22em] text-muted-foreground">pista sonora</span>
          <span className="font-mono text-xs text-muted-foreground">registro {title.slice(-1)}</span>
        </div>
        <audio controls preload="metadata" src={src} className="w-full" aria-label={title} />
        <details className="text-xs leading-relaxed text-muted-foreground">
          <summary className="cursor-pointer underline underline-offset-4">créditos do registro</summary>
          <p className="mt-2">
            leitura em italiano por Alessandro Sorrentino · <a className="underline underline-offset-4" href={source} target="_blank" rel="noreferrer">Wikimedia Commons</a> · CC BY-SA 2.5.
          </p>
        </details>
      </div>
    </Plate>
  )
}

function SymbolArtifact({ media, query }: { media: ArtifactKind; query: PhaseQuery }) {
  switch (media) {
    case "castle":
      return (
        <section className="flex flex-col gap-6">
          <BrokenVoices />
          <LicensedReading src="/dante/registro-a.ogg" title="registro vocal A" source="https://commons.wikimedia.org/wiki/File:AlessandroSorrentinoIII_InfernoDante.ogg" />
        </section>
      )
    case "wind":
      return <CipherPlate />
    case "rain":
      return <PitchRecord />
    case "weights":
      return <CrossingStrip />
    case "river":
      return <MudBubbles />
    case "tombs":
      return <StoneGrid />
    case "blood":
      return <RiverDepths level={levelFrom(query)} />
    case "flame":
      return <TwoChannels />
    case "ice":
      return <FrozenGrid grade={query.grade ?? null} />
    case "inferno-meta":
      return <InfernoRings />
    case "shore":
      return <ShoreReflection />
    case "marble":
      return <PavementCarvings />
    case "eyes":
      return <RiverBlind />
    case "smoke":
      return <SmokeScreen fumaca={query.fumaca ?? query["fumaça"]} />
    case "race":
      return <RunningSouls />
    case "earth":
      return <ProneSouls />
    case "fruit":
      return <FruitShadows />
    case "fire":
      return <FireWall muro={query.muro} />
    case "garden":
      return <TwoWaters agua={query.agua ?? query["água"]} />
    case "purgatorio-meta":
      return <PurgatorioMountain />
    case "moon":
      return <MoonSurfaces />
    case "mercury":
      return <EagleDocument />
    case "orbits":
      return <OrbitPaths />
    case "sun":
      return <CrownOfLights />
    case "cross":
      return <CrossMorse />
    case "eagle":
      return <SpiralRoute />
    case "ladder":
      return <GoldenLadder />
    case "virtues":
      return <ExamBoard exame={query.exame} />
    case "angels":
      return <AngelRings coro={query.coro} />
    case "paradiso-meta":
      return <ParadisoSpheres />
  }
}

export function PhaseArtifact({ media, query = {} }: { media: ArtifactKind; query?: PhaseQuery }) {
  return <section className="flex flex-col gap-6"><SymbolArtifact media={media} query={query} /></section>
}

const CANTICA_NAMES: Record<string, string> = { inferno: "inferno", purgatorio: "purgatório", paradiso: "paraíso" }

export function PhaseFooter({ index, cantica }: { index: number; cantica: string }) {
  return (
    <footer className="flex items-center justify-between border-t border-border pt-4 text-xs text-muted-foreground">
      <div className="flex items-center gap-2">
        <FlowerMark className="size-4" />
        <span>vigília · {CANTICA_NAMES[cantica] ?? cantica}</span>
      </div>
      <span className="font-mono tabular-nums">{String(index).padStart(2, "0")}/30</span>
    </footer>
  )
}

export function CanticaMark({ cantica }: { cantica: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border pb-4 text-xs text-muted-foreground">
      <span className="font-mono uppercase tracking-[.18em]">{CANTICA_NAMES[cantica] ?? cantica}</span>
      <span className="font-serif italic">registro incompleto</span>
    </div>
  )
}

import type { Metadata } from "next"

import { FlowerMark } from "@/components/flower-mark"

export const metadata: Metadata = {
  title: "vigília · porão",
}

export default function CellarPage() {
  return (
    <main className="mx-auto flex min-h-svh w-full max-w-4xl flex-col justify-center gap-8 px-6 py-16">
      {/* Raw puzzle photograph. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/r/16/estante.webp"
        width="1200"
        height="800"
        alt="Duas estantes com dezenas de folhas prensadas entre vidros em molduras finas, etiquetadas por data. Na segunda prateleira há uma moldura vazia com a etiqueta ausente."
        className="h-auto w-full"
      />
      <p className="font-serif text-lg text-muted-foreground">
        noventa e três molduras. noventa e duas plantas.
      </p>
      <footer className="flex items-center justify-between border-t border-border pt-4 font-mono text-xs text-muted-foreground">
        <span>vigília · labirinto · porão</span>
        <FlowerMark className="size-[13px]" />
      </footer>
    </main>
  )
}

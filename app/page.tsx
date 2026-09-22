import Link from "next/link"

import { ProgressRings } from "@/components/progress-rings"
import { ResumeLink } from "@/components/resume-link"
import { Button } from "@/components/ui/button"

export default function Page() {
  return (
    <main className="dante-home mx-auto flex min-h-svh w-full max-w-4xl flex-col justify-between gap-12 px-4 py-8 sm:gap-16 sm:px-8 sm:py-12">
      <header className="flex items-center justify-between border-b border-border pb-5">
        <span className="font-mono text-xs tracking-[.22em] text-muted-foreground">ARQUIVO · 1300</span>
        <span className="font-mono text-xs text-muted-foreground">VIGÍLIA / 30</span>
      </header>

      <section className="grid items-end gap-8 lg:grid-cols-[1.15fr_.85fr] lg:gap-10">
        <div className="flex flex-col gap-8">
          <h1 className="max-w-3xl font-serif text-5xl leading-[.92] tracking-[-.03em] sm:text-7xl">
            uma viagem<br />em três alturas
          </h1>
          <p className="max-w-xl font-serif text-lg leading-relaxed text-foreground/80 sm:text-xl">
            Um arquivo dantesco em trinta fases. Pesquise os sinais, atravesse as estruturas e descubra o que se repete quando o mundo muda de forma.
          </p>
          <div className="flex flex-wrap items-center gap-5">
            <Button
              nativeButton={false}
              render={<Link href="/f/1" />}
              size="lg"
              className="h-11 px-5 font-mono text-xs font-medium tracking-[.16em] uppercase shadow-lg shadow-black/20"
            >
              abrir o arquivo
            </Button>
            <ResumeLink />
          </div>
        </div>

        <div className="dante-home-diagram">
          <ProgressRings labels={["INFERNO", "PURGATÓRIO", "PARAÍSO"]} />
        </div>
      </section>

      <footer className="flex items-center justify-between border-t border-border pt-5 text-xs text-muted-foreground">
        <span>texto, imagem, aba e endereço fazem parte da pista</span>
        <span className="font-mono">01—30</span>
      </footer>
    </main>
  )
}

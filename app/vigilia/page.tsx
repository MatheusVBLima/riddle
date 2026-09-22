import type { Metadata } from "next"
import { redirect } from "next/navigation"

import { solvedUpTo } from "@/lib/session"

export const metadata: Metadata = {
  title: { absolute: "vigília · depois das estrelas" },
  description: "O arquivo se fecha depois da viagem.",
}

export default async function EpiloguePage() {
  const solved = await solvedUpTo()
  if (solved < 30) redirect("/f/" + (solved + 1))

  return (
    <main className="dante-page mx-auto flex min-h-svh w-full max-w-3xl flex-col justify-center gap-10 px-6 py-16 sm:px-10">
      <div className="flex items-center gap-3 border-b border-border pb-5 text-xs text-muted-foreground">
        <span className="font-mono tracking-[.2em]">EPÍLOGO</span>
        <span>o arquivo termina onde o movimento começa</span>
      </div>
      <article className="max-w-2xl font-serif text-xl leading-relaxed text-foreground/90 sm:text-2xl">
        <p>você chegou ao ponto imóvel.</p>
        <p className="mt-6">não há uma porta para abrir depois dele, apenas a lembrança de que a viagem foi escrita por alguém que precisou inventar um caminho para voltar a ver o céu.</p>
        <p className="mt-6">dante chamou esse movimento de amor.</p>
      </article>
      <p className="max-w-xl border-l-2 border-vigil/60 pl-4 text-sm leading-relaxed text-muted-foreground">
        o jogo usa a obra como mapa. as respostas são suas; as fontes continuam abertas para a próxima leitura.
      </p>
    </main>
  )
}

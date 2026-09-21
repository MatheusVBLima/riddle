import Link from "next/link"

import { ResumeLink } from "@/components/resume-link"

export default function Page() {
  return (
    <main className="mx-auto flex min-h-svh w-full max-w-xl flex-col justify-center gap-10 px-6 py-16">
      <h1 className="font-mono text-4xl lowercase tracking-[0.2em]">riddle</h1>

      <div className="flex flex-col gap-4 leading-relaxed">
        <p>
          Trinta páginas. Cada uma sabe a resposta que leva à seguinte, e nenhuma
          vai dizer onde guardou.
        </p>
        <p className="text-muted-foreground">
          Nada aqui é decoração por acidente. O texto, o endereço, o título da
          aba, o que veio junto e não apareceu — tudo já é parte do enigma.
        </p>
      </div>

      <div className="flex items-baseline gap-4">
        <Link
          href="/f/1"
          className="underline underline-offset-4 hover:text-muted-foreground"
        >
          Começar
        </Link>
        <ResumeLink />
      </div>
    </main>
  )
}

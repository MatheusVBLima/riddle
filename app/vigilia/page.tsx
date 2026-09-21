import type { Metadata } from "next"

export const metadata: Metadata = {
  title: { absolute: "vigília · obrigado" },
  description: "O arquivo se fecha.",
}

export default function EpiloguePage() {
  return (
    <main className="mx-auto flex min-h-svh w-full max-w-xl flex-col justify-center gap-8 px-6 py-16">
      <p className="font-serif text-base leading-relaxed text-foreground/90">
        ela se chamava margarida e eu era o zelador da casa dela.
      </p>
      <div className="space-y-5 font-serif text-base leading-relaxed text-foreground/90">
        <p>quando ela morreu eu cataloguei tudo, porque catalogar é a única coisa que eu sei fazer com as mãos ocupadas e a cabeça vazia.</p>
        <p>aí cheguei no nome. não consegui escrever o nome.</p>
        <p>tirei uma letra da régua do mapa. uma da máquina de escrever. uma do disco da gaveta.</p>
        <p>nove pedaços, nove objetos que eu uso todo dia, para não perder nenhum.</p>
        <p>funcionou: eu passei vinte e nove anos sem ler aquilo inteiro, nem sem querer.</p>
        <p>e funcionou bem demais.</p>
        <p>obrigado por vir. escreva o nome dela uma vez, aqui embaixo.</p>
        <p>não precisa apertar nada. eu não vou ler.</p>
      </div>
      <label htmlFor="epilogue-name" className="sr-only">Escreva o nome dela</label>
      <textarea id="epilogue-name" rows={1} autoComplete="off" className="resize-none border-0 border-b border-border bg-transparent px-0 py-2 font-mono text-xl outline-none focus-visible:border-ring" />
    </main>
  )
}

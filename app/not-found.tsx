import Link from "next/link"

/**
 * O brief trata a 404 como superfície de enigma, então ela tem identidade
 * própria em vez da tela padrão do Next. Continua sendo uma 404 honesta: quem
 * chegou aqui por engano tem como voltar.
 */
export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-svh w-full max-w-xl flex-col justify-center gap-8 px-6 py-16">
      <span
        className="font-mono text-6xl leading-none text-muted-foreground/40 tabular-nums"
        aria-hidden="true"
      >
        404
      </span>

      <div className="flex flex-col gap-4 leading-relaxed">
        <h1 className="text-xl font-medium">Não existe registro desta página</h1>
        <p className="text-muted-foreground">
          O que não foi escrito também não foi escondido. Se você veio de um
          endereço que montou sozinho, o endereço é que está errado.
        </p>
      </div>

      <Link
        href="/"
        className="underline underline-offset-4 hover:text-muted-foreground"
      >
        Voltar ao começo
      </Link>
    </main>
  )
}

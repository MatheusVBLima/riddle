"use client"

import * as React from "react"

import { stampPocketCookie } from "@/app/actions"

declare global {
  interface Window {
    vigia?: { passar: (value: string) => string }
  }
}

export function PocketPuzzle() {
  const [fallback, setFallback] = React.useState<string | null>(null)

  React.useEffect(() => {
    const script = document.createElement("script")
    script.src = "/r/19/vigia.js"
    script.async = true
    document.body.append(script)
    let mounted = true
    void stampPocketCookie().then(({ fallbackValue }) => {
      window.setTimeout(() => {
        if (mounted && !document.cookie.split("; ").some((item) => item.startsWith("vigilia_bolso="))) {
          setFallback(fallbackValue)
        }
      }, 0)
    })
    return () => {
      mounted = false
      script.remove()
    }
  }, [])

  return (
    <section className="grid gap-6 md:grid-cols-[1fr_1.2fr]" aria-label="Bilhete no bolso">
      {/* Raw SVG asset; its filename is part of the record's trail. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/r/19/janela.svg" width="260" height="420" alt="Janela alta e estreita, com luz entrando de cima." className="mx-auto h-[min(420px,55svh)] w-full max-w-[220px]" />
      <div className="flex flex-col gap-4">
        <pre className="overflow-x-auto whitespace-pre-wrap rounded-sm border border-border bg-card p-4 font-mono text-xs leading-relaxed text-muted-foreground">
{`// vigia.js — a lógica fica à mostra. o que entra nela é que não.
export function passar(s) {
  const letras = [...s.toUpperCase()].filter(c => /[A-Z]/.test(c));
  const gira = letras.map((c, i) =>
    String.fromCharCode(65 + ((c.charCodeAt(0) - 65) + (i % 7) + 1) % 26));
  return gira.reverse().filter((_, i) => (i + 1) % 3 !== 0).join("");
}`}
        </pre>
        {fallback && (
          <aside className="border-l border-border pl-3 font-mono text-xs text-muted-foreground">
            bolso: {fallback} — seu navegador não aceitou o bilhete; ele está aqui.
          </aside>
        )}
        <p className="text-xs text-muted-foreground">A função fica disponível como <code>window.vigia.passar</code>.</p>
      </div>
    </section>
  )
}

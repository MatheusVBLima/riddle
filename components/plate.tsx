import type { ReactNode } from "react"

export function Plate({ children, label }: { children: ReactNode; label: string }) {
  return (
    <figure className="dante-plate" aria-label={label}>
      {children}
    </figure>
  )
}

/** Cabeçalho padrão das placas: rótulo à esquerda, marca à direita. */
export function PlateHeader({ title, mark }: { title: string; mark?: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border pb-3">
      <span className="font-mono text-xs tracking-[.22em] text-muted-foreground">{title}</span>
      {mark && <span className="font-mono text-xs text-vigil/80">{mark}</span>}
    </div>
  )
}

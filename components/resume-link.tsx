"use client"

import Link from "next/link"
import * as React from "react"

import { furthestReached } from "@/lib/progress"

// localStorage é um store externo ao React, e o progresso não muda enquanto
// esta tela está aberta — não há a que se inscrever.
const subscribe = () => () => {}

// No servidor não há progresso, então a home renderiza sem o atalho e o
// cliente o acrescenta se houver. Mantém o HTML dos dois lados igual.
const getServerSnapshot = () => 1

export function ResumeLink() {
  const reached = React.useSyncExternalStore(
    subscribe,
    furthestReached,
    getServerSnapshot
  )

  if (reached <= 1) return null

  return (
    <Link
      href={`/f/${reached}`}
      className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
    >
      Voltar para a {reached}ª
    </Link>
  )
}

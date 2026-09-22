"use client"

import * as React from "react"

// O <title> da rota pode chegar depois da montagem (metadata em streaming), então
// o título original é lido no momento da troca, nunca no efeito de montagem.

/**
 * Fase 15 · o título da aba passa correndo por uma sequência de frases, como
 * as almas que não param. Devolve o título original ao sair da página.
 */
export function RunningTitle({ titles, interval = 1100 }: { titles: readonly string[]; interval?: number }) {
  React.useEffect(() => {
    let original: string | null = null
    let step = 0
    const timer = window.setInterval(() => {
      original ??= document.title
      document.title = "vigília · " + titles[step % titles.length]
      step++
    }, interval)
    return () => {
      window.clearInterval(timer)
      if (original !== null) document.title = original
    }
  }, [titles, interval])

  return null
}

/**
 * Fase 16 · a aba só fala enquanto a página está escondida: quem olha para
 * outra aba vê o recado no título desta.
 */
export function HiddenTitle({ title }: { title: string }) {
  React.useEffect(() => {
    let original: string | null = null
    const sync = () => {
      if (document.visibilityState === "hidden") {
        original = document.title
        document.title = title
      } else if (original !== null) {
        document.title = original
        original = null
      }
    }
    document.addEventListener("visibilitychange", sync)
    return () => {
      document.removeEventListener("visibilitychange", sync)
      if (original !== null) document.title = original
    }
  }, [title])

  return null
}

"use client"

/**
 * Progresso do jogador.
 *
 * Fica em localStorage de propósito: o brief prevê que o próprio localStorage
 * criado pelo jogo possa virar pista, e não há contas de usuário. Toda leitura
 * é defensiva — em aba anônima ou com storage bloqueado o acesso lança, e o
 * jogo tem que continuar jogável.
 */

const KEY = "riddle.solved"

function read(): number[] {
  try {
    const raw = window.localStorage.getItem(KEY)
    if (!raw) return []

    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []

    return parsed.filter((n): n is number => Number.isInteger(n))
  } catch {
    return []
  }
}

export function solvedPhases(): number[] {
  return read().sort((a, b) => a - b)
}

export function markSolved(index: number): void {
  try {
    const solved = read()
    if (solved.includes(index)) return

    window.localStorage.setItem(KEY, JSON.stringify([...solved, index]))
  } catch {
    // Storage indisponível: o jogador perde o histórico, não a partida.
  }
}

export function furthestReached(): number {
  const solved = solvedPhases()
  return solved.length ? Math.max(...solved) + 1 : 1
}

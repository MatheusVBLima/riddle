import "server-only"

import { createHmac, timingSafeEqual } from "node:crypto"
import { cookies } from "next/headers"

/**
 * Estado de servidor do jogador, guardado em cookies assinados.
 *
 * O localStorage continua sendo o histórico que a interface mostra, mas quem
 * decide o que está aberto é o servidor: sem isso, qualquer registro abre pela
 * URL e a solução de qualquer fase sai de uma chamada direta à Server Action.
 */

const PROGRESS_COOKIE = "vigilia_progresso"
const HINTS_COOKIE = "vigilia_dicas"
const ONE_YEAR = 60 * 60 * 24 * 365

/** Tempo entre abrir a dica e poder abrir a solução da mesma fase. */
export const SOLUTION_DELAY_MS = 10 * 60 * 1000

let warned = false

function secret(): string {
  const configured = process.env.VIGILIA_SECRET
  if (configured) return configured
  if (process.env.NODE_ENV === "production" && !warned) {
    warned = true
    console.warn("VIGILIA_SECRET não configurado: os cookies de progresso usam a chave de desenvolvimento.")
  }
  return "vigilia-dev-secret"
}

function sign(payload: string): string {
  return createHmac("sha256", secret()).update(payload).digest("base64url")
}

function seal(payload: string): string {
  return payload + "." + sign(payload)
}

function open(raw: string | undefined): string | null {
  if (!raw) return null
  const dot = raw.lastIndexOf(".")
  if (dot < 0) return null
  const payload = raw.slice(0, dot)
  const given = Buffer.from(raw.slice(dot + 1))
  const expected = Buffer.from(sign(payload))
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) return null
  return payload
}

const cookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: ONE_YEAR,
}

/** Maior fase resolvida (0 quando nenhuma). */
export async function solvedUpTo(): Promise<number> {
  if (process.env.VIGILIA_UNLOCK_ALL === "1") return 30
  const payload = open((await cookies()).get(PROGRESS_COOKIE)?.value)
  const value = payload === null ? 0 : Number.parseInt(payload, 10)
  return Number.isInteger(value) && value >= 0 && value <= 30 ? value : 0
}

/** Uma fase está aberta quando todas as anteriores foram resolvidas. */
export async function isUnlocked(index: number): Promise<boolean> {
  return index <= (await solvedUpTo()) + 1
}

/** Só pode ser chamado de Server Actions. */
export async function recordSolved(index: number): Promise<void> {
  if (index <= (await solvedUpTo())) return
  ;(await cookies()).set(PROGRESS_COOKIE, seal(String(index)), cookieOptions)
}

async function hintTimes(): Promise<Record<string, number>> {
  const payload = open((await cookies()).get(HINTS_COOKIE)?.value)
  if (!payload) return {}
  try {
    const parsed: unknown = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"))
    return parsed && typeof parsed === "object" ? (parsed as Record<string, number>) : {}
  } catch {
    return {}
  }
}

/** Registra a primeira abertura da dica. Só pode ser chamado de Server Actions. */
export async function recordHint(index: number): Promise<void> {
  const times = await hintTimes()
  if (typeof times[index] === "number") return
  times[index] = Date.now()
  const payload = Buffer.from(JSON.stringify(times)).toString("base64url")
  ;(await cookies()).set(HINTS_COOKIE, seal(payload), cookieOptions)
}

/** Milissegundos até a solução abrir; null quando a dica ainda não foi pedida. */
export async function solutionWait(index: number): Promise<number | null> {
  const openedAt = (await hintTimes())[index]
  if (typeof openedAt !== "number") return null
  return Math.max(0, openedAt + SOLUTION_DELAY_MS - Date.now())
}

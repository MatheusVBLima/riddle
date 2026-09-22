"use server"

import { randomUUID } from "node:crypto"
import { cookies } from "next/headers"

import { getPhase, intermediateFor, isCorrect, PHASE_COUNT } from "@/lib/phases"
import { isUnlocked, recordHint, recordSolved, solutionWait } from "@/lib/session"

export type SolutionResult =
  | { status: "open"; text: string }
  | { status: "waiting"; minutes: number }
  | { status: "locked" }

export type AnswerResult =
  | { status: "correct"; next: number | null; answer: string }
  | { status: "wrong" }
  | { status: "rejected"; message: string }
  | { status: "rate-limited" }
  | { status: "empty" }

const attempts = new Map<string, number[]>()
const sessionCookie = "vigilia_sessao"

async function canAttempt(index: number): Promise<boolean> {
  const jar = await cookies()
  let session = jar.get(sessionCookie)?.value
  if (!session) {
    session = randomUUID()
    jar.set(sessionCookie, session, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    })
  }

  const key = session + ":" + index
  const now = Date.now()
  const previous = attempts.get(key) ?? []
  const recent = previous.filter((time) => now - time < 60 * 60 * 1000)

  if (
    recent.length >= 200 ||
    recent.filter((time) => now - time < 60 * 1000).length >= 20 ||
    (recent.length > 0 && now - recent[recent.length - 1] < 1000)
  ) {
    attempts.set(key, recent)
    return false
  }

  recent.push(now)
  attempts.set(key, recent)
  return true
}

export async function submitAnswer(index: number, submitted: string): Promise<AnswerResult> {
  if (!submitted.trim()) return { status: "empty" }
  if (!getPhase(index) || !(await isUnlocked(index))) return { status: "wrong" }
  if (!(await canAttempt(index))) return { status: "rate-limited" }

  if (!isCorrect(index, submitted)) {
    const message = intermediateFor(index, submitted)
    return message ? { status: "rejected", message } : { status: "wrong" }
  }

  const phase = getPhase(index)
  if (!phase) return { status: "wrong" }

  await recordSolved(index)
  const next = index < PHASE_COUNT ? index + 1 : null
  return { status: "correct", next, answer: phase.answer }
}

export async function revealHint(index: number): Promise<string | null> {
  const phase = getPhase(index)
  if (!phase || !(await isUnlocked(index))) return null
  await recordHint(index)
  return phase.hint
}

/**
 * A solução só abre um tempo depois da dica: quem pediu um empurrão tem a
 * chance de usá-lo, e ninguém esvazia o arquivo chamando a action em série.
 */
export async function revealSolution(index: number): Promise<SolutionResult> {
  const phase = getPhase(index)
  if (!phase || !(await isUnlocked(index))) return { status: "locked" }
  const wait = await solutionWait(index)
  if (wait === null) return { status: "locked" }
  if (wait > 0) return { status: "waiting", minutes: Math.ceil(wait / 60000) }
  return { status: "open", text: phase.solution }
}

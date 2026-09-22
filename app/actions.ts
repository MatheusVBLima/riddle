"use server"

import { randomUUID } from "node:crypto"
import { cookies } from "next/headers"

import { FINAL_LETTERS } from "@/lib/canon"
import {
  getPhase,
  isCorrect,
  isFinalAnswer,
  PHASE_COUNT,
  verifyFinalReconstruction,
} from "@/lib/phases"

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
  if (index === 30 || !getPhase(index)) return { status: "wrong" }
  if (!(await canAttempt(index))) return { status: "rate-limited" }

  if (!isCorrect(index, submitted)) return { status: "wrong" }

  const phase = getPhase(index)
  if (!phase) return { status: "wrong" }

  const next = index < PHASE_COUNT ? index + 1 : null
  return { status: "correct", next, answer: phase.answer }
}

export async function submitFinalName(
  letters: string[],
  submitted: string
): Promise<AnswerResult> {
  if (!submitted.trim()) return { status: "empty" }
  if (!(await canAttempt(30))) return { status: "rate-limited" }

  const normalizedLetters = letters.map((letter) => letter.trim().toUpperCase())
  if (
    normalizedLetters.length !== FINAL_LETTERS.length ||
    !verifyFinalReconstruction(normalizedLetters) ||
    !isFinalAnswer(submitted)
  ) {
    return { status: "wrong" }
  }

  const phase = getPhase(30)
  return phase
    ? { status: "correct", next: null, answer: phase.answer }
    : { status: "wrong" }
}

export async function revealHint(index: number): Promise<string | null> {
  return getPhase(index)?.hint ?? null
}

export async function revealSolution(index: number): Promise<string | null> {
  return getPhase(index)?.solution ?? null
}

/** Compatibilidade para o componente de bolso mantido no arquivo histórico. */
export async function stampPocketCookie(): Promise<{ fallbackValue: string }> {
  const jar = await cookies()
  const value = "ZAFKAVTAPXAGW"
  jar.set("vigilia_bolso", value, { httpOnly: false, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 30 })
  return { fallbackValue: value }
}

/** Compatibilidade para o componente de gaveta mantido no arquivo histórico. */
export async function revealDrawer(): Promise<string> {
  return "prensa de herbário · 30 × 45 · quatro parafusos"
}

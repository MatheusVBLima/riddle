import { writeFileSync } from "node:fs"

import { PITCH_WORDS } from "@/lib/inferno-material"

/**
 * Gera public/dante/registro-c.wav a partir de PITCH_WORDS: cada batida é um
 * tom curto numa de três alturas; trios ficam colados, letras e palavras são
 * separadas por silêncios maiores. O som e o desenho da fase 3 saem da mesma
 * fonte e não podem divergir.
 */

const SAMPLE_RATE = 22050
const PITCHES = { 1: 220, 2: 330, 3: 495 } as const
const TONE = 0.2
const BEAT_GAP = 0.09
const LETTER_GAP = 0.45
const WORD_GAP = 1.1

const samples: number[] = []

function silence(seconds: number) {
  for (let i = 0; i < Math.round(seconds * SAMPLE_RATE); i++) samples.push(0)
}

function tone(frequency: number, seconds: number) {
  const total = Math.round(seconds * SAMPLE_RATE)
  const fade = Math.round(0.012 * SAMPLE_RATE)
  for (let i = 0; i < total; i++) {
    const envelope = Math.min(1, i / fade, (total - i) / fade)
    samples.push(Math.sin((2 * Math.PI * frequency * i) / SAMPLE_RATE) * 0.45 * envelope)
  }
}

silence(0.4)
PITCH_WORDS.forEach((word, wordIndex) => {
  if (wordIndex > 0) silence(WORD_GAP)
  word.forEach((trio, letterIndex) => {
    if (letterIndex > 0) silence(LETTER_GAP)
    trio.forEach((level, beat) => {
      if (beat > 0) silence(BEAT_GAP)
      tone(PITCHES[level as 1 | 2 | 3], TONE)
    })
  })
})
silence(0.6)

const data = Buffer.alloc(samples.length * 2)
samples.forEach((sample, index) => data.writeInt16LE(Math.round(sample * 32767), index * 2))

const header = Buffer.alloc(44)
header.write("RIFF", 0)
header.writeUInt32LE(36 + data.length, 4)
header.write("WAVE", 8)
header.write("fmt ", 12)
header.writeUInt32LE(16, 16)
header.writeUInt16LE(1, 20)
header.writeUInt16LE(1, 22)
header.writeUInt32LE(SAMPLE_RATE, 24)
header.writeUInt32LE(SAMPLE_RATE * 2, 28)
header.writeUInt16LE(2, 32)
header.writeUInt16LE(16, 34)
header.write("data", 36)
header.writeUInt32LE(data.length, 40)

writeFileSync("public/dante/registro-c.wav", Buffer.concat([header, data]))
console.log("registro-c.wav: " + (samples.length / SAMPLE_RATE).toFixed(1) + " s")

import { mkdirSync, writeFileSync } from "node:fs"
import { dirname, resolve } from "node:path"

const sampleRate = 44_100
const seconds = 24

function encodeWav(samples: Float32Array) {
  const pcm = Buffer.alloc(samples.length * 2)
  for (let i = 0; i < samples.length; i++) {
    const value = Math.max(-1, Math.min(1, samples[i]))
    pcm.writeInt16LE(Math.round(value * 32_767), i * 2)
  }

  const header = Buffer.alloc(44)
  header.write("RIFF", 0)
  header.writeUInt32LE(36 + pcm.length, 4)
  header.write("WAVE", 8)
  header.write("fmt ", 12)
  header.writeUInt32LE(16, 16)
  header.writeUInt16LE(1, 20)
  header.writeUInt16LE(1, 22)
  header.writeUInt32LE(sampleRate, 24)
  header.writeUInt32LE(sampleRate * 2, 28)
  header.writeUInt16LE(2, 32)
  header.writeUInt16LE(16, 34)
  header.write("data", 36)
  header.writeUInt32LE(pcm.length, 40)
  return Buffer.concat([header, pcm])
}

function save(path: string, samples: Float32Array) {
  const target = resolve(path)
  mkdirSync(dirname(target), { recursive: true })
  writeFileSync(target, encodeWav(samples))
}

function seededNoise(length: number) {
  let state = 412
  const noise = new Float32Array(length)
  let walk = 0
  for (let i = 0; i < length; i++) {
    state ^= state << 13
    state ^= state >>> 17
    state ^= state << 5
    const white = (state >>> 0) / 0xffff_ffff * 2 - 1
    walk = walk * 0.999 + white * 0.001
    noise[i] = walk
  }
  let peak = 0
  for (const sample of noise) peak = Math.max(peak, Math.abs(sample))
  for (let i = 0; i < noise.length; i++) noise[i] = (noise[i] / peak) * 0.012
  return noise
}

function drop(samples: Float32Array, startSeconds: number) {
  const start = Math.floor(startSeconds * sampleRate)
  const length = Math.floor(0.09 * sampleRate)
  for (let i = 0; i < length; i++) {
    const t = i / sampleRate
    const envelope = Math.exp(-t * 55)
    const frequency = 2_100 * Math.exp(-t * 9) + 380
    const tone = Math.sin(2 * Math.PI * frequency * t)
    samples[start + i] += tone * envelope * 0.42
  }
}

function makePhase04() {
  const samples = seededNoise(sampleRate * seconds)
  const times = [1.2, 3.6, 6.0, 8.4, 10.8, 13.2, 16.3, 18.7, 21.1, 23.5]
  for (const time of times) drop(samples, time)
  save("public/r/04/madrugada.wav", samples)
}

function addSlowBell(samples: Float32Array, frequency: number, atSeconds: number) {
  const start = Math.floor(atSeconds * sampleRate)
  const length = Math.floor(19.2 * sampleRate)
  const partials = [1, 2.76, 5.4, 8.93]
  const amplitudes = [1, 0.4, 0.18, 0.08]
  for (let i = 0; i < length && start + i < samples.length; i++) {
    const t = i / sampleRate
    let tone = 0
    for (let p = 0; p < partials.length; p++) {
      tone += Math.sin(2 * Math.PI * frequency * partials[p] * t) * amplitudes[p]
    }
    samples[start + i] += tone * Math.exp(-t * (3.2 / 8)) * 0.08
  }
}

function makePhase06() {
  const samples = new Float32Array(sampleRate * seconds)
  for (let i = 0; i < samples.length; i++) {
    const t = i / sampleRate
    samples[i] = Math.sin(2 * Math.PI * 34 * t) * 0.008
  }
  addSlowBell(samples, 2_300 / 8, 0)
  addSlowBell(samples, 1_840 / 8, 0.32 * 8)
  let peak = 0
  for (const sample of samples) peak = Math.max(peak, Math.abs(sample))
  for (let i = 0; i < samples.length; i++) samples[i] *= 0.72 / peak
  save("public/r/06/oito-vezes.wav", samples)
}

makePhase04()
makePhase06()

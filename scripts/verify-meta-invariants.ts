import assert from "node:assert/strict"
import { existsSync, readFileSync } from "node:fs"

import {
  CANTICAS,
  FINAL_LETTERS,
  INFERNO_CIRCLES,
  META_TRANSITIONS,
  PARADISO_SPHERES,
  PURGATORIO_STATIONS,
} from "@/lib/canon"
import { getPhase, PHASE_COUNT, verifyFinalReconstruction } from "@/lib/phases"

assert.equal(PHASE_COUNT, 30)
assert.deepEqual(CANTICAS, ["inferno", "purgatorio", "paradiso"])
assert.deepEqual(INFERNO_CIRCLES, ["limbo", "luxúria", "gula", "avareza", "ira", "heresia", "violência", "fraude", "traição"])
assert.equal(PURGATORIO_STATIONS.length, 9)
assert.equal(PARADISO_SPHERES.length, 9)

for (let index = 1; index <= PHASE_COUNT; index++) {
  const phase = getPhase(index)
  assert.ok(phase, "fase " + index + " existe")
  assert.ok(phase.hint.trim(), "fase " + index + " tem uma dica")
  assert.ok(phase.solution.trim(), "fase " + index + " tem solução")
  assert.ok(phase.researchTerms.length >= 2, "fase " + index + " tem âncoras de pesquisa")
  assert.ok(phase.reference.trim(), "fase " + index + " tem referência editorial")
  assert.equal(phase.unidadeEstrutural, phase.unit, "fase " + index + " expõe a unidade estrutural")
  assert.deepEqual(phase.temaDePesquisa, phase.researchTerms, "fase " + index + " expõe o tema de pesquisa")
  assert.deepEqual(phase.variantesAceitas, phase.accepts ?? [], "fase " + index + " expõe as variantes aceitas")
  assert.equal(phase.referenciasVerificacao, phase.reference, "fase " + index + " mantém a referência no servidor")
  assert.equal("hints" in phase, false, "fase " + index + " não declara dicas em camadas")
}

const groups = [
  { name: "inferno", from: 1, to: 10 },
  { name: "purgatorio", from: 11, to: 20 },
  { name: "paradiso", from: 21, to: 30 },
] as const

for (const group of groups) {
  for (let index = group.from; index <= group.to; index++) {
    assert.equal(getPhase(index)?.cantica, group.name, "fase " + index + " está na cântica errada")
  }
}

assert.equal(getPhase(10)?.answer, META_TRANSITIONS[10])
assert.equal(getPhase(20)?.answer, META_TRANSITIONS[20])
assert.equal(getPhase(30)?.answer, META_TRANSITIONS[30])
assert.equal(verifyFinalReconstruction([...FINAL_LETTERS]), true)
assert.equal(verifyFinalReconstruction(["S", "T", "E", "L", "L", "X"]), false)

assert.equal(existsSync("public/dante/porta.svg"), true)
assert.equal(existsSync("public/dante/montanha.svg"), true)
assert.equal(existsSync("public/dante/esferas.svg"), true)
assert.equal(existsSync("public/dante/chama.wav"), true)
assert.ok(readFileSync("public/dante/porta.svg", "utf8").includes("Porta de três alturas"))

console.log("Invariantes dantescos, três cânticas, metas, dicas únicas e assets conferidos.")

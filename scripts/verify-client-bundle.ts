import assert from "node:assert/strict"
import { readFileSync, readdirSync } from "node:fs"
import { join } from "node:path"

import { getPhase, PHASE_COUNT } from "@/lib/phases"

function walk(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name)
    return entry.isDirectory() ? walk(path) : [path]
  })
}

function fold(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase()
}

const files = walk(".next/static/chunks").filter((path) => path.endsWith(".js"))
assert.ok(files.length > 0, "rode bun run build antes de verificar os bundles")
const bundle = fold(files.map((path) => readFileSync(path, "utf8")).join("\n"))
function includesPhrase(phrase: string) {
  const tokens = fold(phrase).split(/[^A-Z0-9]+/).filter(Boolean)
  const expression = tokens.join("[^A-Z0-9]+")
  const matcher = new RegExp(`(?:^|[^A-Z0-9])${expression}(?:$|[^A-Z0-9])`)
  return matcher.test(bundle)
}

for (let index = 1; index <= PHASE_COUNT; index++) {
  const phase = getPhase(index)
  assert.ok(phase, `fase ${index} precisa existir`)

  for (const secret of [phase.answer, ...(phase.accepts ?? [])]) {
    assert.ok(fold(secret).replace(/[^A-Z0-9]/g, "").length >= 3)
    assert.equal(includesPhrase(secret), false, `resposta ${JSON.stringify(secret)} da fase ${index} encontrada no bundle do cliente`)
  }

  for (const secret of [phase.hint, phase.solution]) {
    assert.equal(includesPhrase(secret), false, `dica/solução da fase ${index} encontrada no bundle do cliente`)
  }
}

console.log(`Bundles do cliente sem respostas, dicas ou soluções (fases 1–${PHASE_COUNT}).`)

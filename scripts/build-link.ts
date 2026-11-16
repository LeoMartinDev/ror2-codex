/**
 * Turns a build written as readable JSON into a share link (/builds/view#<code>), so an agent or a
 * person can make a build without the editor. Items and survivors are named in French or English.
 *
 * Usage:
 *   bun run build-link build.json            # prints the link
 *   bun run build-link build.json --open     # also opens it (a Kero browser pane, or the default browser)
 *   cat build.json | bun run build-link -     # read the JSON from stdin
 *   --base https://my.site                   # site to link to (default: $ROR2_CODEX_URL or http://localhost:3000)
 *
 * The input format is described in src/lib/buildInput.ts (the same one the site's /api/builds reads).
 */
import { spawnSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { decodeBuild, encodeBuild } from '../src/lib/builds'
import { parseBuildInput } from '../src/lib/buildInput'

const args = process.argv.slice(2)
const flag = (name: string) => {
  const i = args.indexOf(name)
  if (i < 0) return undefined
  const v = args[i + 1]
  args.splice(i, 2)
  return v
}
const open = args.includes('--open')
if (open) args.splice(args.indexOf('--open'), 1)
const base = (flag('--base') ?? process.env.ROR2_CODEX_URL ?? 'http://localhost:3000').replace(/\/+$/, '')
const file = args[0]
if (!file) {
  console.error('Usage: bun run build-link <build.json | -> [--open] [--base <url>]')
  process.exit(2)
}

let input: unknown
try {
  input = JSON.parse(file === '-' ? readFileSync(0, 'utf8') : readFileSync(file, 'utf8'))
} catch (e) {
  console.error(`Cannot read the build: ${(e as Error).message}`)
  process.exit(2)
}

const { build, errors } = parseBuildInput(input)
if (errors.length || !build) {
  console.error(`The build has ${errors.length} problem(s):\n${errors.map((e) => `  - ${e}`).join('\n')}`)
  process.exit(1)
}

const code = await encodeBuild(build)
if (!(await decodeBuild(code))) {
  console.error('The link could not be read back (a field is probably too long).')
  process.exit(1)
}
const url = `${base}/builds/view#${code}`
console.log(url)

if (open) {
  const kero = process.env.KERO_PANE && spawnSync('kero', ['split', '--url', url], { stdio: 'inherit' })
  if (!kero || kero.status !== 0) {
    const [cmd, ...rest] =
      process.platform === 'win32' ? ['cmd', '/c', 'start', '""', url] : [process.platform === 'darwin' ? 'open' : 'xdg-open', url]
    spawnSync(cmd, rest, { stdio: 'ignore' })
  }
}

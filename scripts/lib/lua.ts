// Minimal parser for the Lua data modules of the RoR2 wiki (Module:Items/Data, Module:Equipment/Data).
// Supports the subset they use: string/number/bool literals, tables, `x["key"] = value` assignments.

export type LuaValue = string | number | boolean | null | LuaTable
export type LuaTable = { [key: string]: LuaValue } & { __array?: LuaValue[] }

type Token = { t: 'str' | 'num' | 'id' | 'sym'; v: string }

function tokenize(src: string): Token[] {
  const out: Token[] = []
  let i = 0
  while (i < src.length) {
    const c = src[i]
    if (c === '-' && src[i + 1] === '-') {
      if (src.startsWith('--[[', i)) {
        const end = src.indexOf(']]', i)
        i = end === -1 ? src.length : end + 2
      } else {
        const end = src.indexOf('\n', i)
        i = end === -1 ? src.length : end + 1
      }
      continue
    }
    if (/\s/.test(c)) { i++; continue }
    if (c === '"' || c === "'") {
      let s = ''
      i++
      while (i < src.length && src[i] !== c) {
        if (src[i] === '\\') {
          const n = src[i + 1]
          s += n === 'n' ? '\n' : n === 'r' ? '\r' : n === 't' ? '\t' : n
          i += 2
        } else s += src[i++]
      }
      i++
      out.push({ t: 'str', v: s })
      continue
    }
    if (/[0-9]/.test(c) || (c === '.' && /[0-9]/.test(src[i + 1]))) {
      const m = /^[0-9]*\.?[0-9]+(e[+-]?[0-9]+)?/i.exec(src.slice(i))!
      out.push({ t: 'num', v: m[0] })
      i += m[0].length
      continue
    }
    if (/[A-Za-z_]/.test(c)) {
      const m = /^[A-Za-z_][A-Za-z0-9_]*/.exec(src.slice(i))!
      out.push({ t: 'id', v: m[0] })
      i += m[0].length
      continue
    }
    out.push({ t: 'sym', v: c })
    i++
  }
  return out
}

/** Returns every `<tableName>["Key"] = { ... }` assignment found in the module. */
export function parseLuaAssignments(src: string, tableName: string): Record<string, LuaTable> {
  const toks = tokenize(src)
  let p = 0
  const peek = () => toks[p]
  const next = () => toks[p++]
  const expect = (v: string) => {
    const t = next()
    if (!t || t.v !== v) throw new Error(`Lua parse: expected "${v}" got "${t?.v}" at token ${p}`)
  }

  function value(): LuaValue {
    const t = next()
    if (t.t === 'str') {
      // string concatenation "a" .. "b"
      let s = t.v
      while (peek()?.v === '.' && toks[p + 1]?.v === '.') {
        p += 2
        const n = next()
        s += n.v
      }
      return s
    }
    if (t.t === 'num') return Number(t.v)
    if (t.t === 'sym' && t.v === '-' && peek()?.t === 'num') return -Number(next().v)
    if (t.t === 'id') {
      if (t.v === 'true') return true
      if (t.v === 'false') return false
      if (t.v === 'nil') return null
      return null // identifier reference: not needed for our data
    }
    if (t.v === '{') return table()
    throw new Error(`Lua parse: unexpected token "${t.v}" at ${p}`)
  }

  function table(): LuaTable {
    const obj: LuaTable = {}
    const arr: LuaValue[] = []
    while (peek() && peek().v !== '}') {
      const t = peek()
      if (t.t === 'id' && toks[p + 1]?.v === '=') {
        p += 2
        obj[t.v] = value()
      } else if (t.v === '[') {
        p++
        const k = value()
        expect(']')
        expect('=')
        obj[String(k)] = value()
      } else {
        arr.push(value())
      }
      if (peek()?.v === ',' || peek()?.v === ';') p++
    }
    expect('}')
    if (arr.length) obj.__array = arr
    return obj
  }

  const result: Record<string, LuaTable> = {}
  while (p < toks.length) {
    const t = next()
    if (t.t === 'id' && t.v === tableName && peek()?.v === '[') {
      p++
      const key = value()
      expect(']')
      expect('=')
      const v = value()
      if (v && typeof v === 'object') result[String(key)] = v
    }
  }
  return result
}

export const luaArray = (v: LuaValue | undefined): LuaValue[] =>
  v && typeof v === 'object' ? (v.__array ?? []) : []

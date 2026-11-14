import { Fragment, type ReactNode } from 'react'

type Node = { tag: 'style' | 'color' | 'root'; value: string; children: (Node | string)[] }

/** Parses the game's <style=cX>…</style> / <color=#…>…</color> markup into a tree. */
function parse(input: string): Node {
  const root: Node = { tag: 'root', value: '', children: [] }
  const stack: Node[] = [root]
  const re = /<(\/?)(style|color)(?:=([^>]*))?>/g
  let last = 0
  let m: RegExpExecArray | null
  while ((m = re.exec(input))) {
    if (m.index > last) stack[stack.length - 1].children.push(input.slice(last, m.index))
    last = re.lastIndex
    if (m[1]) {
      // Closing tag: the game sometimes mismatches </style> and </color>, so just pop.
      if (stack.length > 1) stack.pop()
    } else {
      const node: Node = { tag: m[2] as 'style' | 'color', value: m[3] ?? '', children: [] }
      stack[stack.length - 1].children.push(node)
      stack.push(node)
    }
  }
  if (last < input.length) stack[stack.length - 1].children.push(input.slice(last))
  return root
}

function render(node: Node | string, key: number): ReactNode {
  if (typeof node === 'string') {
    const lines = node.replace(/<\/?[a-z]+[^>]*>/gi, '').split('\n')
    return (
      <Fragment key={key}>
        {lines.map((l, i) => (
          <Fragment key={i}>
            {i > 0 && <br />}
            {l}
          </Fragment>
        ))}
      </Fragment>
    )
  }
  const kids = node.children.map(render)
  if (node.tag === 'style') return <span key={key} className={`rt-${node.value}`}>{kids}</span>
  if (node.tag === 'color')
    return (
      <span key={key} style={{ color: node.value }}>
        {kids}
      </span>
    )
  return <Fragment key={key}>{kids}</Fragment>
}

export function RichText({ text, className }: { text: string; className?: string }) {
  return <span className={className}>{render(parse(text), 0)}</span>
}

export function plainText(text: string): string {
  return text.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()
}

import { Dictionary } from 'justypes'

export function parseHeaders(headers: string[]): Dictionary<string> {
  return Object.fromEntries(headers.map(x => x.split(/:\s+/)))
}

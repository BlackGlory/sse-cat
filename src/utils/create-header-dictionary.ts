import { Dictionary } from 'justypes'

export function createHeaderDictionary(headers: string[]): Dictionary<string> {
  return Object.fromEntries(headers.map(x => x.split(/:\s+/)))
}

import { Dictionary } from 'justypes'

export function createHeaderDictionary(headers?: string[]): Dictionary<string> {
  if (headers) {
    return Object.fromEntries(headers.map(x => x.split(/:\s+/)))
  } else {
    return {}
  }
}

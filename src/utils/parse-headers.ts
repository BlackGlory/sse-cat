import { assert } from '@blackglory/prelude'
import { Dictionary } from 'justypes'

export function parseHeaders(headers: string[]): Dictionary<string> {
  return Object.fromEntries(
    headers.map(header => {
      const result = header.split(/:\s+/)
      assert(result.length === 2, `Invalid header ${JSON.stringify(header)}`)

      return result
    })
  )
}

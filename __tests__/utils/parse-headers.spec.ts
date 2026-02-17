import { parseHeaders } from '@utils/parse-headers.js'
import { getError } from 'return-style'

describe('parseHeaders', () => {
  test('empty', () => {
    const headers: string[] = []

    const result = parseHeaders(headers)

    expect(result).toStrictEqual({})
  })

  test('non-empty', () => {
    const headers = ['User-Agent: foo']

    const result = parseHeaders(headers)

    expect(result).toStrictEqual({
      'User-Agent': 'foo'
    })
  })

  test('edge: header value includes `:`', () => {
    const headers = ['User-Agent: foo:bar']

    const result = parseHeaders(headers)

    expect(result).toStrictEqual({
      'User-Agent': 'foo:bar'
    })
  })

  test('edge: invalid header', () => {
    const headers = ['foo']

    const error = getError(() => parseHeaders(headers))

    expect(error).toBeInstanceOf(Error)
  })
})

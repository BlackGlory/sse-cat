import { parseHeaders } from '@utils/parse-headers.js'

describe('parseHeaders', () => {
  test('empty', () => {
    const headers: string[] = []

    const result = parseHeaders(headers)

    expect(result).toStrictEqual({})
  })

  test('non-empty', () => {
    const headers = ['User-Agent: sse-cat']

    const result = parseHeaders(headers)

    expect(result).toStrictEqual({
      'User-Agent': 'sse-cat'
    })
  })
})

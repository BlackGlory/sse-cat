import { createHeaderDictionary } from '@utils/create-header-dictionary'

describe('createHeaderDictionary(headers: string[])', () => {
  it('returns Dictionary<string>', () => {
    const headers = ['User-Agent: sse-cat']

    const result = createHeaderDictionary(headers)

    expect(result).toStrictEqual({
      'User-Agent': 'sse-cat'
    })
  })
})

import { subscribeMessages } from '@src/subscribe-events.js'
import { server } from './subscribe-events.mock.js'
import { takeAsync, toArrayAsync } from 'iterable-operator'
import { getErrorPromise } from 'return-style'
import { NotFound } from '@blackglory/http-status'
import { jest } from '@jest/globals'
import { delay } from 'extra-promise'

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
beforeEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('subscribeEvents', () => {
  test('200', async () => {
    const iter = subscribeMessages('http://localhost/200', {
      events: ['message']
    , headers: { 'data': 'foo' }
    })

    const result = await toArrayAsync(takeAsync(iter, 2))

    expect(result).toStrictEqual([
      'foo'
    , 'foo'
    ])
  })

  test('302', async () => {
    const iter = subscribeMessages('http://localhost/302', {
      events: ['message']
    , headers: { 'data': 'foo' }
    })

    const result = await toArrayAsync(takeAsync(iter, 2))

    expect(result).toStrictEqual([
      'foo'
    , 'foo'
    ])
  })

  test('404', async () => {
    const iter = subscribeMessages('http://localhost/404', {
      events: ['message']
    , headers: { 'data': 'foo' }
    })

    const err = await getErrorPromise(toArrayAsync(iter))

    expect(err).toBeInstanceOf(NotFound)
  })

  test('500', async () => {
    const iter = subscribeMessages('http://localhost/500-try-again', {
      events: ['message']
    , headers: {}
    })

    const result = await toArrayAsync(takeAsync(iter, 2))

    expect(result).toStrictEqual([
      'data'
    , 'data'
    ])
  })

  // 此处的心跳检测测试通过客户端超时来模拟服务器超时, 这是因为msw不支持模拟服务器超时.
  describe('heartbeat', () => {
    afterEach(() => {
      jest.restoreAllMocks()
    })

    test('timeout', async () => {
      const error = jest.spyOn(console, 'error')
      const iter = subscribeMessages('http://localhost/heartbeat', {
        events: ['message']
      , headers: {}
      , heartbeat: {
          event: 'heartbeat'
        , timeout: 500
        }
      })

      const results: string[] = []
      for await (const message of iter) {
        results.push(message)
        if (results.length === 2) break
        await delay(600)
      }

      expect(results).toStrictEqual([
        'data'
      , 'data'
      ])
      expect(error).toBeCalledWith('heartbeat timeout')
    })

    test('no timeout', async () => {
      const error = jest.spyOn(console, 'error')
      const iter = subscribeMessages('http://localhost/heartbeat', {
        events: ['message']
      , headers: {}
      , heartbeat: {
          event: 'heartbeat'
        , timeout: 500
        }
      })

      const results: string[] = []
      for await (const message of iter) {
        results.push(message)
        if (results.length === 2) break
        await delay(400)
      }

      expect(results).toStrictEqual([
        'data'
      , 'data'
      ])
      expect(error).not.toBeCalled()
    })
  })
})

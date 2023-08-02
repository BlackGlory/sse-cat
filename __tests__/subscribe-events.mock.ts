import { setupServer } from 'msw/node'
import { DefaultBodyType, PathParams, ResponseComposition, RestContext, RestRequest, rest } from 'msw'
import { stringifyEvent } from 'extra-sse'
import { assert, isntNull, go } from '@blackglory/prelude'
import { toArray, concat } from 'iterable-operator'

export const server = setupServer(
  rest.get('http://localhost/200', (req, res, ctx) => {
    const data = req.headers.get('data')
    assert(isntNull(data))

    return res(
      ctx.status(200)
    , ctx.set('Connection', 'keep-alive')
    , ctx.set('Content-Type', 'text/event-stream')
    , ctx.body(toArray(stringifyEvent({ data })).join(''))
    )
  })

, rest.get('http://localhost/302', (req, res, ctx) => {
    return res(
      ctx.status(302)
    , ctx.set('Location', 'http://localhost/200')
    )
  })

, rest.get('http://localhost/404', (req, res, ctx) => {
    return res(ctx.status(404))
  })

, rest.get('http://localhost/500-try-again', go(() => {
    let first = true

    return (
      req: RestRequest<never, PathParams<string>>
    , res: ResponseComposition<DefaultBodyType>
    , ctx: RestContext
    ) => {
      if (first) {
        first = false
        return res(ctx.status(500))
      } else {
        return res(
          ctx.status(200)
        , ctx.set('Connection', 'keep-alive')
        , ctx.set('Content-Type', 'text/event-stream')
        , ctx.body(toArray(stringifyEvent({
            comment: 'comment'
          , data: 'data'
          })).join(''))
        )
      }
    }
  }))

, rest.get('http://localhost/no-heartbeat', (req, res, ctx) => {
    return res(
      ctx.status(200)
    , ctx.set('Connection', 'keep-alive')
    , ctx.set('Content-Type', 'text/event-stream')
    , ctx.body(toArray(stringifyEvent({ data: 'data' })).join(''))
    )
  })

, rest.get('http://localhost/heartbeat', (req, res, ctx) => {
    return res(
      ctx.status(200)
    , ctx.set('Connection', 'keep-alive')
    , ctx.set('Content-Type', 'text/event-stream')
    , ctx.body(toArray(concat(
        stringifyEvent({ data: 'data' })
      , stringifyEvent({ event: 'heartbeat' })
      )).join(''))
    )
  })
)

import { Dictionary } from 'justypes'
import { setTimeout } from 'extra-timers'
import { fetchEvents } from 'extra-sse'
import { Request } from 'extra-fetch'
import { isntUndefined } from '@blackglory/prelude'
import { AbortController, AbortError } from 'extra-abort'

export interface IHeartbeatOptions {
  event: string
  timeout: number
}

export async function* subscribeMessages(
  url: string
, { events, headers, heartbeat }: {
    events: string[]
    headers: Dictionary<string>
    heartbeat?: IHeartbeatOptions
  }
): AsyncIterableIterator<string> {
  let cancelHeartbeatTimeout: (() => void) | undefined = undefined
  let lastEventId: string | undefined = undefined

  while (true) {
    try {
      const controller = new AbortController()
      for await (
        const {
          event = 'message'
        , data
        , id
        } of fetchEvents(
          () => new Request(url, { headers, signal: controller.signal })
        , { lastEventId }
        )
      ) {
        if (isntUndefined(lastEventId)) {
          lastEventId = id
        }

        if (heartbeat) {
          if (cancelHeartbeatTimeout) {
            if (heartbeat.event === event) {
              cancelHeartbeatTimeout()
              cancelHeartbeatTimeout = setTimeout(heartbeat.timeout, () => {
                controller.abort()
              })
            }
          } else {
            cancelHeartbeatTimeout = setTimeout(heartbeat.timeout, () => {
              controller.abort()
            })
          }
        }

        if (events.includes(event)) {
          if (isntUndefined(data)) {
            yield data
          }
        }
      }
    } catch (e) {
      if (e instanceof AbortError) {
        console.error('heartbeat timeout')
      } else {
        throw e
      }
    } finally {
      cancelHeartbeatTimeout?.()
    }
  }
}

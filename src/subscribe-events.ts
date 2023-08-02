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
  let cancelHeartbeatTimeout: (() => void) | undefined
  let lastEventId: string | undefined

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
        , {
            lastEventId
          , onOpen(): void {
              if (heartbeat) {
                resetHeartbeatTimeout(controller, heartbeat.timeout)
              }
            }
          }
        )
      ) {
        if (isntUndefined(lastEventId)) {
          lastEventId = id
        }

        if (heartbeat && event === heartbeat.event) {
          resetHeartbeatTimeout(controller, heartbeat.timeout)
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

  function resetHeartbeatTimeout(controller: AbortController, timeout: number): void {
    cancelHeartbeatTimeout?.()
    cancelHeartbeatTimeout = setTimeout(timeout, () => controller.abort())
  }
}

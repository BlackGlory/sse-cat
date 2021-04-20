import EventSource from 'eventsource'
import { Observable } from 'rxjs'
import { Dictionary } from 'hotypes'
import { IHeartbeatOptions } from './types'
import { CustomError } from '@blackglory/errors'
import { setTimeout } from 'extra-timers'

export function fromServerSentEvent(
  url: string
, { events, headers, heartbeat }: {
    events: string[]
    headers: Dictionary<string>
    heartbeat?: IHeartbeatOptions
  }
): Observable<string> {
  return new Observable(observer => {
    const es = new EventSource(url, { headers })
    es.addEventListener('error', (evt: Event) => {
      const err = evt as ErrorEvent
      if (err.message) {
        console.error(err.message)
      }
    })

    events.forEach(event => {
      es.addEventListener(event, (evt: Event) => {
        const { data } = evt as MessageEvent<string>
        observer.next(data)
      })
    })

    let cancelHeartbeatTimeout: (() => void) | null = null
    if (heartbeat) {
      const { timeout, event } = heartbeat

      es.addEventListener('open', () => {
        updateTimeout()

        es.addEventListener(event, updateTimeout)
      })

      function updateTimeout() {
        if (cancelHeartbeatTimeout) cancelHeartbeatTimeout()
        cancelHeartbeatTimeout = setTimeout(timeout, heartbeatTimeout)
      }
    }

    return close

    function close() {
      if (cancelHeartbeatTimeout) cancelHeartbeatTimeout()
      es.close()
    }

    function heartbeatTimeout() {
      close()
      observer.error(new HeartbeatTimeoutError())
    }
  })
}

export class HeartbeatTimeoutError extends CustomError {}

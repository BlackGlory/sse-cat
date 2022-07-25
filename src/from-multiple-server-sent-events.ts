import { Observable, throwError, merge } from 'rxjs'
import { catchError, retry } from 'rxjs/operators'
import { fromServerSentEvent } from './from-server-sent-event'
import { Dictionary } from 'justypes'
import { IHeartbeatOptions } from './types'

export function fromMultipleServerSentEvents(
  urls: string[]
, { events, headers, heartbeat }: {
    events: string[]
    headers: Dictionary<string>
    heartbeat?: IHeartbeatOptions
  }
): Observable<string> {
  const observables = urls.map(url => {
    return fromServerSentEvent(url, {
      events
    , headers
    , heartbeat
    }).pipe(
      catchError(err => {
        console.error(`${err}`)
        return throwError(() => err)
      })
    , retry()
    )
  })

  return merge(...observables)
}

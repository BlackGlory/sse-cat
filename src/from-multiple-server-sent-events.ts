import { Observable, merge } from 'rxjs'
import { fromServerSentEvent } from './from-server-sent-event'
import { Dictionary } from 'hotypes'
import { IHeartbeatOptions } from './types'
import { retryWhen, tap } from 'rxjs/operators'

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
      retryWhen(errors => errors.pipe(
        tap(error => console.error(`${error}`))
      ))
    )
  })

  return merge(...observables)

}

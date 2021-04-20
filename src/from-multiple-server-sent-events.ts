import { Observable, merge } from 'rxjs'
import { fromServerSentEvent } from './from-server-sent-event'
import { Dictionary } from 'hotypes'

export function fromMultipleServerSentEvents(
  urls: string[]
, { events, headers }: { events: string[]; headers: Dictionary<string> }
): Observable<string> {
  const observables = urls.map(url => fromServerSentEvent(url, { events, headers }))
  return merge(...observables)
}

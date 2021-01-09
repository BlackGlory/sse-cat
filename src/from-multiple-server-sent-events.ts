import { Observable, merge } from 'rxjs'
import { fromServerSentEvent } from './from-server-sent-event'

export function fromMultipleServerSentEvents(urls: string[], { events, headers }: { events: string[], headers: Headers }): Observable<string> {
  const observables = urls.map(url => fromServerSentEvent(url, { events, headers }))
  return merge(...observables)
}

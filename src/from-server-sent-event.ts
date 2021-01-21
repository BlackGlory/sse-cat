import EventSource = require('eventsource')
import { Observable } from 'rxjs'

export function fromServerSentEvent(url: string, { events, headers }: { events: string[], headers: Headers }): Observable<string> {
  return new Observable(observer => {
    const sse = new EventSource(url, { headers })
    // @ts-ignore
    events.forEach(event => sse.addEventListener(event, messageListener))
      // @ts-ignore
    sse.addEventListener('error', errorListener)

    return () => {
      // @ts-ignore
      events.forEach(event => sse.removeEventListener(event, messageListener))
      // @ts-ignore
      sse.removeEventListener('error', errorListener)
      sse.close()
    }

    function messageListener(evt: MessageEvent<string>) {
      observer.next(evt.data)
    }

    function errorListener(err: ErrorEvent) {
      if (err.message) console.error(err.message)
    }
  })
}

import EventSource = require('eventsource')
import { Observable } from 'rxjs'

export function fromServerSentEvent(url: string, { events, headers }: { events: string[], headers: Headers }): Observable<string> {
  return new Observable(observer => {
    const sse = new EventSource(url, { headers })
    // @ts-ignore
    events.forEach(event => sse.addEventListener(event, messageListener))
    sse.addEventListener('error', errorListener)

    return () => {
      // @ts-ignore
      events.forEach(event => sse.removeEventListener(event, messageListener))
      sse.removeEventListener('error', errorListener)
      sse.close()
    }

    function messageListener(evt: MessageEvent<string>) {
      observer.next(evt.data)
    }

    function errorListener(err: any) {
      observer.error(err)
    }
  })
}

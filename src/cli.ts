#!/usr/bin/env node
import { program } from 'commander'
import { fromMultipleServerSentEvents } from './from-multiple-server-sent-events'

program
  .name('sse-cat')
  .version(require('../package.json').version)
  .description(require('../package.json').description)
  .option('-h, --header <header>', 'Pass custom header(s) to server', collect, [])
  .option('-e, --event <event>', 'Pass custom event(s) that need to be captured', collect, [])
  .arguments('<url...>')
  .action((urls: string[]) => {
    const opts = program.opts()
    const headers: Headers = createHeaders(opts.header)
    const events: string[] = (opts.event as string[]).length === 0
                             ? ['message']
                             : opts.event
    fromMultipleServerSentEvents(urls, { headers, events })
      .subscribe(
        message => console.log(message)
      , error => console.error(error)
      )
  })
  .parse()

function collect(value: string, previous: string[]) {
  return previous.concat([value])
}

function createHeaders(headers: string[]): Headers {
  return Object.fromEntries(headers.map(x => x.split(':')))
}

#!/usr/bin/env node
import { program } from 'commander'
import { fromMultipleServerSentEvents } from './from-multiple-server-sent-events'
import { createHeaderDictionary } from '@utils/create-header-dictionary'
import { Dictionary } from 'hotypes'
import { isUndefined, isntNull } from '@blackglory/types'
import { IHeartbeatOptions } from './types'
import { go } from '@blackglory/go'
import { assert } from '@blackglory/errors'

program
  .name('sse-cat')
  .version(require('../package.json').version)
  .description(require('../package.json').description)
  .option('-h, --header <header>', 'Pass custom header(s) to server', collect, [])
  .option(
    '-e, --event <name>'
  , 'Pass custom event(s) that need to be captured'
  , collect
  , []
  )
  .option('--heartbeat-event <name>')
  .option('--heartbeat-timeout <ms>')
  .arguments('<url...>')
  .action((urls: string[]) => {
    const opts = program.opts()
    const headers: Dictionary<string> = createHeaderDictionary(opts.header)
    const events: string[] = createEvents(opts.event)
    const heartbeatEvent: string | null = opts.heartbeatEvent ?? null
    const heartbeatTimeout: number | null = go(() => {
      if (isUndefined(opts.heartbeatTimeout)) return null

      assert(
        isNumberString(opts.heartbeatTimeout)
      , 'The parameter heartbeat-timeout must be an integer'
      )

      const timeout = Number.parseInt(opts.heartbeatTimeout, 10)
      assert(timeout > 0, 'timeout must greater than zero')
      return timeout
    })
    const heartbeatOptions: IHeartbeatOptions | undefined = go(() => {
      if (isntNull(heartbeatEvent) && isntNull(heartbeatTimeout)) {
        return {
          event: heartbeatEvent
        , timeout: heartbeatTimeout
        }
      } else {
        return undefined
      }
    })

    fromMultipleServerSentEvents(urls, {
      headers
    , events
    , heartbeat: heartbeatOptions
    }).subscribe({
      next(message) {
        console.log(message)
      }
    })
  })
  .parse()

function collect(value: string, previous: string[]) {
  return previous.concat([value])
}

function createEvents(events: string[]): string[] {
  if (events.length === 0) {
    return ['message']
  } else {
    return events
  }
}

function isNumberString(str: string): boolean {
  return /^\d+$/.test(str)
}

#!/usr/bin/env node
import { program } from 'commander'
import { fromMultipleServerSentEvents } from './from-multiple-server-sent-events'
import { createHeaderDictionary } from '@utils/create-header-dictionary'
import { isUndefined, isntNull } from '@blackglory/types'
import { IHeartbeatOptions } from './types'
import { go } from '@blackglory/go'
import { assert } from '@blackglory/errors'

program
  .name('sse-cat')
  .version(require('../package.json').version)
  .description(require('../package.json').description)
  .option('--header [header]', 'Pass custom header(s) to server')
  .option('--event [name]', 'Pass custom event(s) that need to be captured')
  .option('--heartbeat-event [name]')
  .option('--heartbeat-timeout [ms]')
  .arguments('<url...>')
  .action((urls: string[]) => {
    const opts = program.opts<{
      header?: string[]
      event?: string[]
      heartbeatEvent?: string
      heartbeatTimeout?: string
    }>()
    const headers = createHeaderDictionary(opts.header)
    const events = createEvents(opts.event)
    const heartbeatEvent = opts.heartbeatEvent ?? null
    const heartbeatTimeout = go(() => {
      if (isUndefined(opts.heartbeatTimeout)) return null

      assert(
        isNumberString(opts.heartbeatTimeout)
      , 'The parameter heartbeat-timeout must be an integer'
      )

      const timeout = Number.parseInt(opts.heartbeatTimeout, 10)
      assert(timeout > 0, 'timeout must greater than zero')
      return timeout
    })
    const heartbeatOptions = go(() => {
      if (isntNull(heartbeatEvent) && isntNull(heartbeatTimeout)) {
        const options: IHeartbeatOptions = {
          event: heartbeatEvent
        , timeout: heartbeatTimeout
        }
        return options
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

function createEvents(events?: string[]): string[] {
  if (events && events.length > 0) {
    return events
  }
  return ['message']
}

function isNumberString(str: string): boolean {
  return /^\d+$/.test(str)
}

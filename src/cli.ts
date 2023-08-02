#!/usr/bin/env node
import { program } from 'commander'
import { subscribeMessages, IHeartbeatOptions } from './subscribe-events.js'
import { parseHeaders } from '@utils/parse-headers.js'
import { assert, isUndefined, isntUndefined } from '@blackglory/prelude'
import { Dictionary } from 'justypes'
import { version, description } from '@utils/package.js'

interface IOptions {
  header?: string[]
  event?: string[]
  heartbeatEvent?: string
  heartbeatTimeout?: string
}

const name = 'sse-cat'
process.title = name

program
  .name(name)
  .version(version)
  .description(description)
  .option('--header <header...>', 'Pass custom header(s) to server')
  .option('--event <name...>', 'Pass custom event(s) that need to be captured')
  .option('--heartbeat-event <name>')
  .option('--heartbeat-timeout <milliseconds>')
  .arguments('<url...>')
  .action((urls: string[]) => {
    const options = program.opts<IOptions>()
    const headers = getHeaders(options)
    const events = getEvents(options)
    const heartbeatOptions = getHeartbeatOptions(options)

    urls.forEach(async url => {
      for await (
        const message of subscribeMessages(url, {
          headers
        , events
        , heartbeat: heartbeatOptions
        })
      ) {
        console.log(message)
      }
    })
  })
  .parse()

function getHeartbeatOptions(options: IOptions): IHeartbeatOptions | undefined {
  const heartbeatEvent = getHeartbeatEvent(options)
  const heartbeatTimeout = getHeartbeatTimeout(options)

  if (isntUndefined(heartbeatEvent) && isntUndefined(heartbeatTimeout)) {
    const options: IHeartbeatOptions = {
      event: heartbeatEvent
    , timeout: heartbeatTimeout
    }
    return options
  } else {
    return undefined
  }
}

function getHeartbeatTimeout(options: IOptions): number | undefined {
  if (isUndefined(options.heartbeatTimeout)) {
    return undefined
  } else {
    assert(
      isNumberString(options.heartbeatTimeout)
    , 'The parameter heartbeat-timeout must be an integer'
    )

    const timeout = Number.parseInt(options.heartbeatTimeout, 10)
    assert(timeout > 0, 'timeout must greater than zero')

    return timeout
  }
}

function getHeartbeatEvent(options: IOptions): string | undefined {
  return options.heartbeatEvent
}

function getHeaders(options: IOptions): Dictionary<string> {
  return parseHeaders(options.header ?? [])
}

function getEvents(options: IOptions): string[] {
  return createEvents(options.event)
}

function createEvents(events?: string[]): string[] {
  if (events && events.length > 0) {
    return events
  } else {
    return ['message']
  }
}

function isNumberString(str: string): boolean {
  return /^\d+$/.test(str)
}

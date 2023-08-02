#!/usr/bin/env node
import { program } from 'commander'
import { fromMultipleServerSentEvents } from './from-multiple-server-sent-events'
import { parseHeaders } from '@utils/parse-headers'
import { isUndefined, isntUndefined } from '@blackglory/types'
import { IHeartbeatOptions } from './types'
import { assert } from '@blackglory/errors'
import { Dictionary } from 'justypes'

interface IOptions {
  header?: string[]
  event?: string[]
  heartbeatEvent?: string
  heartbeatTimeout?: string
}

const name = 'sse-cat'
const { version, description } = require('../package.json')
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

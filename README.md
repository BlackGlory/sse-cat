# sse-cat
Command-line client for Server-Sent Events(SSE).

## Install
```sh
npm install --global sse-cat
# or
yarn global add sse-cat
```

### Install from source
```sh
yarn install
yarn build
yarn global add "file:$(pwd)"
```

## Usage
```sh
Usage: sse-cat [options] <url...>

Command-line client for Server-Sent Events(SSE).

Options:
  -V, --version                       output the version number
  --header <header...>                Pass custom header(s) to server
  --event <name...>                   Pass custom event(s) that need to be captured
  --heartbeat-event <name>
  --heartbeat-timeout <milliseconds>
  -h, --help                          display help for command
```

### Single SSE
```sh
sse-cat 'http://localhost:8080/sse'
```

### Multiple SSE
```sh
sse-cat \
  'http://localhost:8080/sse/1' \
  'http://localhost:8080/sse/2'
```

### Headers
```sh
sse-cat \
  --header 'User-Agent: sse-cat' \
  --header "Authorization: Bearer $TOKEN" \
  -- 'http://localhost:8080/sse'
```

### Custom events
```sh
sse-cat \
  --event 'message' \
  --event 'custom-event' \
  -- 'http://localhost:8080/sse'
```

### Heartbeat
The heartbeat checker will only be enabled when all heartbeat options are set.

```sh
sse-cat \
  --heartbeat-event heartbeat \
  --heartbeat-timeout 60000 \
  'http://localhost:8080/sse'
```

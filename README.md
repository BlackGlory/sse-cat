# sse-cat
Command-line client for Server-Sent Events(SSE).

```sh
Usage: sse-cat [options] <url...>

Options:
  -h, --header <header>  Pass custom header(s) to server (default: [])
  -e, --event <event>    Pass custom event(s) that need to be captured (default: [])
  --help                 display help for command
```

## Install

```sh
npm install -g sse-cat
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
  'http://localhost:8080/sse'
```

### Custom events

```sh
sse-cat \
  --event 'message'
  --event 'custom-event'
  'http://localhost:8080/sse'
```

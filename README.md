# commection

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/narumincho/commection)

## Deno Example

```sh
deno run --allow-net=:8000 ./deno/example/main.ts
```

## Editor build command

```sh
deno run -A ./deno/editor/build.ts
```

## Handle request

```mermaid
graph TB
Request(Request)
SimpleRequest(SimpleRequest)
CommectionRequest(CommectionRequest)
CommectionResponse(CommectionResponse)
SimpleResponse(SimpleResponse)
Response(Response)

Request -->|requestToSimpleRequest| SimpleRequest -->|simpleRequestToCommectionRequest| CommectionRequest -->|handleRequest| CommectionResponse -->|commectionResponseToSimpleResponse| SimpleResponse --> |simepleResponseToResponse|Response
```

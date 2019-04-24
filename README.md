# electron-easy-ipc

简单易用的 electron ipc 通信实现。

## Install

```bash
$ yarn add @icepy/electron-easy-ipc
```

## Usage

数据结构返回：

```json
{
  code: number;
  message: any;
}
```

由 `renderer` 单向通信：

```js
// main
const { simpleOn, OK } = require("../lib/index");
simpleOn("simple-on", (options) => {
  const response = {
    code: OK,
    message: options
  }
  return Promise.resolve(response);
});
```

```js
// renderer
const { longSend } = require("../lib/index");
const simples = {
  simple: "simple"
}

simpleSend("simple-on", simples).then((response) => {
  console.log(response);
});
```

`long` 双向通信：

```js
// main
const { longOn } = require("../lib/index");
longOn("long-on", (options, server) => {
  // open
    server.onMessage = (message) => {
      console.log(message);
      // renderer send message to main
      // handler and use sendMessage send result message
      // server.sendMessage("main to renderer icepy");
    }
  //
  return () => {
    // disconnect
  }
});
```

```js
// renderer
const { longSend } = require("../lib/index");
const initLongs = {
  long: "long"
}

const longClient = longSend("long-on", initLongs);
longClient.sendMessage("init renderer");
longClient.onMessage = (message) => {
  // longClient.sendMessage()
  longClient.sendMessage("renderer to main message");
}
```

## LICENSE

MIT License Copyright (c) 2019 子曰五溪
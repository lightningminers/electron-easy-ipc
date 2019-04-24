const { simpleSend, longSend } = require("../lib/index");

const simples = {
  simple: "simple"
}

simpleSend("simple-on", simples).then((response) => {
  console.log(response);
});

const initLongs = {
  long: "long"
}

const longClient = longSend("long-on", initLongs);
longClient.sendMessage("init renderer");

longClient.onMessage = (message) => {
  // longClient.sendMessage()
  longClient.sendMessage("renderer to main message");
}

// longClient.disconnect();
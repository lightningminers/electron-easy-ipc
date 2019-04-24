const { app, BrowserWindow } = require("electron");
const { simpleOn, OK, longOn } = require("../lib/index");

simpleOn("simple-on", (options) => {
  const response = {
    code: OK,
    message: options
  }
  return Promise.resolve(response);
});

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

let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })
  mainWindow.loadFile('index.html')
  mainWindow.on('closed', function () {
    mainWindow = null
  })
}
app.on('ready', createWindow)
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
});

app.on('activate', function () {
  if (mainWindow === null) createWindow()
});
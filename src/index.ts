import { ipcMain, ipcRenderer } from "electron";
import createUUID from "usedjs/lib/createUUID";
import ChannelServer from "./ChannelServer";
import ChannelClient from "./ChannelClient";

export const OK = 0;
export const ERROR = 1;

export interface IResponse<T = any> {
  code: number;
  message: T;
}

export interface IRequest<T = any> {
  uuid: string;
  options: T;
}

type SimpleListener = (options: any) => Promise<IResponse>;

export const simpleOn = (channel: string, listener: SimpleListener) => {
  ipcMain.on(channel, async (e: any, request: IRequest) => {
    const { uuid, options } = request;
    let response = Object.create(null) as IResponse;
    try {
      response = await listener(options);
    } catch(e) {
      response.code = e.code || ERROR;
      response.message = `Error Message: [${e.message}]`;
    }
    e.sender.send(`${channel}-${uuid}`, response);
  });
}

export const simpleSend = (channel: string, options: any): Promise<IResponse> => {
  const uuid = createUUID();
  const ev = `${channel}-${uuid}`;
  return new Promise((resolve) => {
    ipcRenderer.once(ev, (e: any, response: IResponse) => {
      resolve(response);
    });
    ipcRenderer.send(channel, { uuid, options });
  });
}

type LongOpenHandler = (options: any, server: ChannelServer) => void | Function;

export const longOn = (channel: string, longOpenHandler: LongOpenHandler)=> {
  ipcMain.on(channel, (e: any, request: IRequest) => {
    const { uuid, options } = request;
    const channelServer = new ChannelServer(channel, uuid, e.sender);
    const onDisconnect = longOpenHandler(options, channelServer);
    const disconnectKey = channelServer.getChannelName("disconnect");
    const messageKey = channelServer.getChannelName("message");
    if (channelServer.onMessage) {
      ipcMain.on(messageKey, (e: any, message: any) => {
        channelServer.onMessage!({
          code: OK,
          message
        });
      });
    }
    if (typeof onDisconnect === "function") {
      ipcMain.on(disconnectKey, () => {
        onDisconnect!();
        [messageKey, disconnectKey].forEach((v) => {
          ipcMain.removeAllListeners(channelServer.getChannelName(v));
        });
      });
    }
  });
}

export const longSend = (channel: string, options: any) => {
  const channelClient = new ChannelClient(channel, options);
  channelClient.on("message", (e: any, message: any) => {
    if (channelClient.onMessage) {
      channelClient.onMessage!({
        code: OK,
        message
      });
    }
  });
  channelClient.connect();
  return channelClient;
}
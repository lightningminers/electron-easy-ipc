import { ipcMain } from "electron";
import { IResponse } from ".";

type MessageFunction = (response: IResponse) => void;

class ChannelServer {
  public channel: string;
  public uuid: string;
  public sender: any;
  public onMessage?: MessageFunction;

  constructor(channel: string, uuid: string, sender: any){
    this.channel = channel;
    this.uuid = uuid;
    this.sender = sender;
  }

  getChannelName(ev: string){
    return `${this.channel}-${this.uuid}-${ev}`;
  }

  on(channel: string, listener: Function) {
    ipcMain.on(this.getChannelName(channel), listener);
  }

  sendMessage(...args: any[]){
    this.send("message", ...args);
  }

  private send(ev: string, ...args: any[]){
    this.sender.send(this.getChannelName(ev), ...args);
  }
}

export default ChannelServer;
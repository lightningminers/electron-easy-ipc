import { ipcRenderer } from "electron";
import createUUID from "usedjs/lib/createUUID";
import { IResponse } from ".";

type MessageFunction = (response: IResponse) => void;

class ChannelClient {
  public channel: string;
  public uuid: string;
  public options: any;
  public onMessage?: MessageFunction;

  constructor(channel: string, options: any){
    this.channel = channel;
    this.uuid = createUUID();
    this.options = options;
  }

  getChannelName(ev: string) {
    return `${this.channel}-${this.uuid}-${ev}`;
  }

  connect(){
    ipcRenderer.send(this.channel, { uuid: this.uuid, options: this.options});
  }

  disconnect(){
    this.send("disconnect");
  }

  sendMessage(...args: any[]){
    this.send("message", ...args);
  }

  private send(ev: string, ...args: any[]){
    ipcRenderer.send(this.getChannelName(ev), ...args);
  }

  on(channel: string, listener: Function) {
    ipcRenderer.on(this.getChannelName(channel), listener);
  }
  
  remove(channel: string, listener: Function){
    ipcRenderer.removeListener(this.getChannelName(channel), listener);
  }

  removeAll(channel: string) {
    ipcRenderer.removeAllListeners(this.getChannelName(channel));
  }
}

export default ChannelClient;
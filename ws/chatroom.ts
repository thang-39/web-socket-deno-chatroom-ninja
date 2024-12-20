import { WebSocket, isWebSocketCloseEvent } from "https://deno.land/std@0.52.0/ws/mod.ts";
import { v4 } from "https://deno.land/std@0.52.0/uuid/mod.ts";

let sockets = new Map<string, WebSocket>();


interface BroadcastObj {
  name: string,
  mssg: string
}

// broadcast events to all clients
const broadcastEvent = (obj: BroadcastObj) => {
  sockets.forEach((ws: WebSocket) => {
    ws.send(JSON.stringify(obj));
  })
}

const chatConnection = async (ws: WebSocket) => {
  // add new ws connection to map
  const uid = v4.generate();
  sockets.set(uid, ws);

  for await (const ev of ws) {
    console.log('event', ev);

    // delete socket if connection closed
    if (isWebSocketCloseEvent(ev)) {
      sockets.delete(uid);
    }
    
    // create event object if event is string
    if (typeof ev === 'string') {
      let evObj = JSON.parse(ev);
      broadcastEvent(evObj)
      
    }
  }
  
}

export { chatConnection };
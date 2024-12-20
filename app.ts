import { serve } from "https://deno.land/std@0.52.0/http/server.ts";
import { acceptWebSocket, acceptable } from "https://deno.land/std@0.52.0/ws/mod.ts"
import { chatConnection } from "./ws/chatroom.ts";

// server setup
const server = serve({ port: 3000 });
console.log("http://localhost:3000/");

for await (const req of server) {
  
  // serve index page
  if (req.url === '/') {
    // Respond with the file as an async iterable
    req.respond({
      status: 200,
      body: await Deno.open('./public/index.html')
    });
  }

  // accept websocket connection
  if (req.url === '/ws') {
    if (acceptable(req)) {
      acceptWebSocket({
        conn: req.conn,
        bufReader: req.r,
        bufWriter: req.w,
        headers: req.headers
      }).then(chatConnection)
    }
  }
}
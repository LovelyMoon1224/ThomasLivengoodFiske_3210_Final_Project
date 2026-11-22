const { WebSocketServer } = require('ws');
let nextId = 0; //counts # of players online
const clients = new Map(); // id -> ws
const wss = new WebSocketServer({ port: 8080, host: '0.0.0.0' });
console.log('Server listening on port 8080');

wss.on('connection', (ws) => {
  const id = nextId++;
  clients.set(id,ws);
  console.log(`Player ${id} connected`);

  ws.send(JSON.stringify({type: 'init', id: id}));

  ws.on('message', (data) => {
    const out = JSON.stringify({ type: 'msg', id: id, data: data.toString() });

    for (const [otherId, otherWs] of clients) {
      if (otherId !== id && otherWs.readyState === 1) {
        otherWs.send(out);
      }
    }
  });

  ws.on('close', () => {
    clients.delete(id);
    console.log(`Player ${id} disconnected`);
  })
});
import { WebSocketServer, WebSocket } from "ws";
import type { Server } from "http";

interface Client {
  ws: WebSocket;
  id: string;
  name: string;
  color: string;
  position: [number, number, number];
}

const clients = new Map<string, Client>();

function generateColor(): string {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
    '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B739', '#52B788'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

function generateUserId(): string {
  return `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function broadcastUsers() {
  const userList = Array.from(clients.values()).map(client => ({
    id: client.id,
    name: client.name,
    color: client.color,
    position: client.position,
  }));

  const message = JSON.stringify({
    type: 'users',
    users: userList,
  });

  clients.forEach(client => {
    if (client.ws.readyState === WebSocket.OPEN) {
      client.ws.send(message);
    }
  });
}

export function setupWebSocket(server: Server) {
  const wss = new WebSocketServer({ 
    server,
    path: '/ws'
  });

  wss.on('connection', (ws: WebSocket) => {
    const userId = generateUserId();
    const userName = `User ${clients.size + 1}`;
    const userColor = generateColor();

    const client: Client = {
      ws,
      id: userId,
      name: userName,
      color: userColor,
      position: [0, 0, 0],
    };

    clients.set(userId, client);
    console.log(`WebSocket client connected: ${userId} (${userName})`);

    ws.send(JSON.stringify({
      type: 'welcome',
      userId,
      userName,
      userColor,
    }));

    broadcastUsers();

    ws.on('message', (data: Buffer) => {
      try {
        const message = JSON.parse(data.toString());

        switch (message.type) {
          case 'position':
            if (clients.has(userId)) {
              clients.get(userId)!.position = message.position;
              broadcastUsers();
            }
            break;

          case 'process':
            const processMessage = JSON.stringify({
              type: 'process',
              process: message.process,
              fromUserId: userId,
            });
            clients.forEach(c => {
              if (c.id !== userId && c.ws.readyState === WebSocket.OPEN) {
                c.ws.send(processMessage);
              }
            });
            break;

          default:
            console.log('Unknown message type:', message.type);
        }
      } catch (error) {
        console.error('Error processing WebSocket message:', error);
      }
    });

    ws.on('close', () => {
      console.log(`WebSocket client disconnected: ${userId}`);
      clients.delete(userId);
      broadcastUsers();
    });

    ws.on('error', (error) => {
      console.error(`WebSocket error for ${userId}:`, error);
    });
  });

  console.log('WebSocket server initialized on path /ws');
  return wss;
}

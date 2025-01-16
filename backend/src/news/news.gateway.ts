import { WebSocketGateway, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import * as WebSocket from 'ws';

@WebSocketGateway({
    path: '/news',
    cors: true,
})
export class NewsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private clients: Set<WebSocket> = new Set();

    handleConnection(client: WebSocket) {
        this.clients.add(client);
        console.log('Client connected to WebSocket');
    }

    handleDisconnect(client: WebSocket) {
        this.clients.delete(client);
    }

    broadcastNewItem(newsItem: any) {
        const message = JSON.stringify(newsItem);
        for (const client of this.clients) {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        }
    }
}
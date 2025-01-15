import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: true })
export class NewsGateway {
    @WebSocketServer()
    server: Server;

    // We can trigger this method from the news service or externally
    public broadcastNewItem(newsItem: any) {
        this.server.emit('newsItem', newsItem);
    }
}

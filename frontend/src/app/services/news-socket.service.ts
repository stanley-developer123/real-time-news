import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface NewsItem {
  title: string;
  content: string;
  category: string;
  timestamp: string;
  keywords: string[];
}


@Injectable({
  providedIn: 'root'
})
export class NewsSocketService {
  private socket: Socket;

  constructor() {
    // Connect to NestJS backend's Socket.IO endpoint
    this.socket = io(environment.socketUrl, {
      transports: ['websocket', 'polling']
    });
  }

  onNewItem(): Observable<NewsItem> {
    return new Observable((subscriber) => {
      this.socket.on('newsItem', (data: NewsItem) => {
        subscriber.next(data);
      });
    });
  }
}

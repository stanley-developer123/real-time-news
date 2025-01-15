// src/app/core/services/news-socket.service.ts

import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { NewsItem } from '../../types';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class NewsSocketService {
  private socket: Socket;
  private latestNews: NewsItem[] = [];

  constructor() {
    // Connect to your Socket.IO server (NestJS or otherwise)
    this.socket = io(environment.socketUrl, {
      transports: ['websocket', 'polling'],
    });

    // 1) Upon connecting, request the initial 'latest news'
    this.socket.on('connect', () => {
      // Option A: ask the server explicitly
      this.socket.emit('requestLatestNews');

      // Option B: maybe your server automatically emits 'latestNews'
      // in which case you might not need this 'emit'.
    });

    // 2) Listen for the full 'latest news' array
    //    which the server should send in response to 'requestLatestNews'
    //    or automatically upon connection.
    this.socket.on('latestNews', (data: NewsItem[]) => {
      this.latestNews = data;
    });
  }

  /**
   * Returns an Observable that will emit **new** items
   * whenever the server broadcasts a `newsItem` event.
   */
  onNewItem(): Observable<NewsItem> {
    return new Observable((subscriber) => {
      this.socket.on('newsItem', (item: NewsItem) => {
        subscriber.next(item);
      });
    });
  }

  /**
   * Returns the most recent "latest news" snapshot that
   * was previously emitted by the server and stored here.
   * (This is typically the last 20 items, or however many
   * the server decides to send on connection.)
   */
  getLatestNewsSnapshot(): NewsItem[] {
    // Return a copy so external code doesn't mutate our array
    return [...this.latestNews];
  }
}

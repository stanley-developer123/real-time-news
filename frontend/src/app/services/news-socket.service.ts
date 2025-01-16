// news.service.ts
import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { Observable, BehaviorSubject, retry, share } from 'rxjs';
import { NewsItem } from '../../types';

@Injectable({
  providedIn: 'root'
})
export class NewsWebSocketService {
  // We use BehaviorSubject to maintain the latest state of our news items
  private newsItems = new BehaviorSubject<NewsItem[]>([]);

  // Our WebSocket connection
  private socket$: WebSocketSubject<any>;

  constructor() {
    // Initialize the WebSocket connection
    this.socket$ = webSocket({
      url: 'ws://localhost:3000/news',
      // Automatically reconnect if connection is lost
      openObserver: {
        next: () => {
          console.log('WebSocket connected');
          this.loadInitialData();
        }
      }
    });

    // Subscribe to incoming messages
    this.socket$
      .pipe(
        // Retry connection if it fails
        retry({ delay: 1000 }),
        // Share the connection across multiple subscribers
        share()
      )
      .subscribe({
        next: (message) => this.handleMessage(message),
        error: (err) => console.error('WebSocket error:', err),
        complete: () => console.log('WebSocket connection closed')
      });
  }

  // Load initial data when connection is established
  private async loadInitialData() {
    try {
      const response = await fetch('http://localhost:3000/api/news');
      const initialNews = await response.json();
      this.newsItems.next(initialNews);
    } catch (error) {
      console.error('Failed to load initial news:', error);
    }
  }

  private handleMessage(message: NewsItem) {
    // Update our BehaviorSubject with the new item
    const currentNews = this.newsItems.getValue();
    this.newsItems.next([message, ...currentNews].slice(0, 20));
  }

  // Public method to get the Observable stream of news items
  getNewsStream(): Observable<NewsItem[]> {
    return this.newsItems.asObservable();
  }
}

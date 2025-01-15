import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NewsSocketService } from './services/news-socket.service';
import { NewsItem } from '../types';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  newsItems: NewsItem[] = [];

  constructor(
    private newsSocketService: NewsSocketService,
  ) { }

  ngOnInit(): void {
    // 1) Load existing news from backend (optional)
    this.loadExistingNews();

    // 2) Subscribe to real-time updates (Socket.IO)
    this.newsSocketService.onNewItem().subscribe((item: NewsItem) => {
      this.newsItems.push(item);
      // Example: keep only the last 20 items
      if (this.newsItems.length > 20) {
        this.newsItems.shift();
      }
    });
  }

  loadExistingNews(): void {
    this.newsItems = this.newsSocketService.getLatestNewsSnapshot();
  }

  // Utility function to display "time since publication"
  timeSince(timestamp: string): string {
    const now = new Date().getTime();
    const published = new Date(timestamp).getTime();
    const diffInSeconds = Math.floor((now - published) / 1000);

    if (diffInSeconds < 60) {
      return `${diffInSeconds} seconds ago`;
    }
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    }
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    }
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} days ago`;
  }
}

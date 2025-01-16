import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NewsItem } from '../types';
import { CommonModule } from '@angular/common';
import { ChartComponent } from './components/chart/chart.component';
import { NewsWebSocketService } from './services/news-socket.service';

@Component({
  selector: 'app-root',
  imports: [CommonModule, ChartComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  newsItems: NewsItem[] = [];

  constructor(
    private newsSocketService: NewsWebSocketService,
  ) { }

  ngOnInit(): void {
    // 1) Load existing news from backend (optional)
    this.loadExistingNews();

    // 2) Subscribe to real-time updates (Socket.IO)
    this.newsSocketService.getNewsStream().subscribe({
      next: (items: NewsItem[]) => {

        this.newsItems = items

      }

    });
  }

  loadExistingNews(): void {
    this.newsItems = []
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

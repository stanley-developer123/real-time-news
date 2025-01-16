import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NEWS_CATEGORIES, NewsCategory, NewsItem } from '../../../types';
import { NewsService } from '../../services/news.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-news-feed',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './news-feed.component.html',
  styleUrl: './news-feed.component.css'
})
export class NewsFeedComponent implements OnInit {
  [x: string]: any;

  categories: NewsCategory[] = NEWS_CATEGORIES;
  newsItems: NewsItem[] = [];
  activeTab = 'all';

  constructor(
    private newsSocketService: NewsService,
    private cdr: ChangeDetectorRef
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

  get uniqueCategories(): string[] {
    return [...new Set(this.newsItems.map(item => item.category))];
  }

  get filteredNewsItems(): any[] {
    if (this.activeTab === 'all') {
      return this.newsItems;
    }
    return this.newsItems.filter(item => item.category === this.activeTab);
  }

  setActiveTab(category: string): void {
    this.activeTab = category;
    this.cdr.markForCheck();
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

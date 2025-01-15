// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { ChartComponent } from './components/chart/chart.component';
import { NewsFeedComponent } from './components/news-feed/news-feed.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'charts',
    component: ChartComponent
  },
  {
    path: 'news',
    component: NewsFeedComponent
  },
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];

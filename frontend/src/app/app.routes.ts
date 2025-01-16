import { Routes } from '@angular/router';
import { AppComponent } from './app.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/news',
    pathMatch: 'full'
  },
  {
    path: 'news',
    component: AppComponent
  },
  {
    path: '**',
    redirectTo: '/news'
  }
];

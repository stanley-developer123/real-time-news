import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartComponent } from './components/chart/chart.component';
import { NewsFeedComponent } from "./components/news-feed/news-feed.component";

@Component({
  selector: 'app-root',
  imports: [CommonModule, ChartComponent, NewsFeedComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {



}

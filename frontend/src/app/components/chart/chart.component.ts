import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BaseChartDirective } from 'ng2-charts';
import {
  Chart,
  BarController,
  CategoryScale,
  LinearScale,
  BarElement
} from 'chart.js';

Chart.register(
  BarController,
  CategoryScale,
  LinearScale,
  BarElement
);
@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  standalone: true,
  imports: [CommonModule, BaseChartDirective]
})
export class ChartComponent implements OnInit {
  public chartLabels: string[] = [];
  public chartData: number[] = [];
  public chartType: string = 'bar';

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.loadStats();
  }

  loadStats() {
    this.http.get<any>('http://localhost:3000/api/news/stats').subscribe(
      (stats) => {
        this.chartLabels = Object.keys(stats);
        this.chartData = Object.values(stats);
      },
      (err) => console.error(err)
    );
  }
}

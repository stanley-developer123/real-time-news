import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import {
  Chart,
  BarController,
  CategoryScale,
  LinearScale,
  BarElement,
  LineController,
  PointElement,
  LineElement,
  ChartConfiguration
} from 'chart.js';
import { NewsItem } from '../../../types';
import { NewsService } from '../../services/news.service';

Chart.register(
  BarController,
  CategoryScale,
  LinearScale,
  BarElement,
  LineController,
  PointElement,
  LineElement
);

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  standalone: true,
  imports: [CommonModule, BaseChartDirective]
})
export class ChartComponent implements OnInit {
  @ViewChild(BaseChartDirective) categoryChart?: BaseChartDirective;
  @ViewChild('keywordChart') keywordChart?: BaseChartDirective;

  newsItems: NewsItem[] = [];

  chartData: ChartConfiguration['data'] = {
    labels: [],
    datasets: [{
      data: [],
      label: 'News Items by Category',
      backgroundColor: 'rgba(54, 162, 235, 0.5)',
      borderColor: 'rgb(54, 162, 235)',
      borderWidth: 1
    }]
  };



  chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      }
    }
  };

  constructor(private newsService: NewsService, private cdr: ChangeDetectorRef) {
    this.newsService.getNewsStream().subscribe(items => {
      this.newsItems = items;
      this.processDataForChart();
      setTimeout(() => {
        this.categoryChart?.chart?.update();
        this.keywordChart?.chart?.update();
      }, 0);
    });
  }
  ngOnInit() {
    // Initial process
    this.processDataForChart();

    // Subscribe to updates
    this.newsService.getNewsStream().subscribe({
      next: (items: NewsItem[]) => {
        this.newsItems = items;
        this.processDataForChart();
        this.cdr.markForCheck();
      }
    });
  }

  processDataForChart() {
    const categoryCount = this.newsItems.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    this.chartData.labels = Object.keys(categoryCount);
    this.chartData.datasets[0].data = Object.values(categoryCount);

    this.categoryChart?.chart?.update();
  }

}

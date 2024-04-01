import * as Highcharts from 'highcharts';
import { Component, Input, SimpleChange } from '@angular/core';
import { HighchartsChartModule } from 'highcharts-angular';
import { SeriesColumnOptions } from 'highcharts';
import { RecommendationItem } from '../../interfaces';

@Component({
  selector: 'app-recommendation-chart',
  standalone: true,
  imports: [HighchartsChartModule],
  templateUrl: './recommendation-chart.component.html',
  styleUrl: './recommendation-chart.component.css',
})
export class RecommendationChartComponent {
  @Input() recommendationData!: RecommendationItem[];
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions!: Highcharts.Options;

  ngOnChanges(changes: SimpleChange) {
    if ('recommendationData' in changes) {
      const change = changes.recommendationData as SimpleChange;
      if (change.currentValue) {
        this.initChart(change.currentValue);
      }
    }
  }

  initChart(recommendationData: RecommendationItem[]) {
    this.chartOptions = {
      chart: {
        type: 'column',
        backgroundColor: '#f5f4f4',
      },
      title: {
        text: 'Recommendation Trends',
      },
      xAxis: {
        categories: [
          this.recommendationData[0].period.slice(0, 7),
          this.recommendationData[1].period.slice(0, 7),
          this.recommendationData[2].period.slice(0, 7),
          this.recommendationData[3].period.slice(0, 7),
        ],
        // crosshair: true,
      },
      yAxis: {
        min: 0,
        title: {
          text: '#Analysis',
        },
        stackLabels: {
          // enabled: true,
          style: {
            fontWeight: 'bold',
            color: 'gray',
          },
        },
      },
      tooltip: {
        headerFormat: '<b>{point.x}</b><br/>',
        pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}',
      },
      plotOptions: {
        column: {
          stacking: 'normal',
          dataLabels: {
            enabled: true,
          },
        },
      },
      series: [
        {
          name: 'Strong Buy',
          data: [
            this.recommendationData[0].strongBuy,
            this.recommendationData[1].strongBuy,
            this.recommendationData[2].strongBuy,
            this.recommendationData[3].strongBuy,
          ],
          color: '#195e33',
        } as SeriesColumnOptions,
        {
          name: 'Buy',
          data: [
            this.recommendationData[0].buy,
            this.recommendationData[1].buy,
            this.recommendationData[2].buy,
            this.recommendationData[3].buy,
          ],
          color: '#22ae50',
        } as SeriesColumnOptions,
        {
          name: 'Hold',
          data: [
            this.recommendationData[0].hold,
            this.recommendationData[1].hold,
            this.recommendationData[2].hold,
            this.recommendationData[3].hold,
          ],
          color: '#ae7d29',
        } as SeriesColumnOptions,
        {
          name: 'Sell',
          data: [
            this.recommendationData[0].sell,
            this.recommendationData[1].sell,
            this.recommendationData[2].sell,
            this.recommendationData[3].sell,
          ],
          color: '#f05050',
        } as SeriesColumnOptions,
        {
          name: 'Strong Sell',
          data: [
            this.recommendationData[0].strongSell,
            this.recommendationData[1].strongSell,
            this.recommendationData[2].strongSell,
            this.recommendationData[3].strongSell,
          ],
          color: '#722928',
        } as SeriesColumnOptions,
      ],
    };
  }
  //  = {
  //   chart: {
  //     type: 'column',
  //   },
  //   title: {
  //     text: 'Recommendation Trends',
  //   },
  //   xAxis: {
  //     categories: ['2023-11', '2023-12', '2024-01', '2024-02'],
  //     // crosshair: true,
  //   },
  //   yAxis: {
  //     min: 0,
  //     title: {
  //       text: 'Amount',
  //     },
  //     stackLabels: {
  //       // enabled: true,
  //       style: {
  //         fontWeight: 'bold',
  //         color: 'gray',
  //       },
  //     },
  //   },
  //   tooltip: {
  //     headerFormat: '<b>{point.x}</b><br/>',
  //     pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}',
  //   },
  //   plotOptions: {
  //     column: {
  //       stacking: 'normal',
  //       dataLabels: {
  //         enabled: true,
  //       },
  //     },
  //   },
  //   series: [
  //     {
  //       name: 'Strong Buy',
  //       data: [
  //         this.recommendationData[0].strongBuy,
  //         this.recommendationData[1].strongBuy,
  //         this.recommendationData[2].strongBuy,
  //         this.recommendationData[3].strongBuy,
  //       ],
  //       color: '#195e33',
  //     } as SeriesColumnOptions,
  //     {
  //       name: 'Buy',
  //       data: [2, 2, 3, 2],
  //       color: '#22ae50',
  //     } as SeriesColumnOptions,
  //     {
  //       name: 'Hold',
  //       data: [3, 4, 4, 2],
  //       color: '#ae7d29',
  //     } as SeriesColumnOptions,
  //     {
  //       name: 'Sell',
  //       data: [3, 4, 4, 2],
  //       color: '#f05050',
  //     } as SeriesColumnOptions,
  //     {
  //       name: 'Strong Sell',
  //       data: [3, 4, 4, 2],
  //       color: '#722928',
  //     } as SeriesColumnOptions,
  //   ],
  // };
}

import * as Highcharts from 'highcharts';
import { Component, Input, SimpleChange } from '@angular/core';
import { HighchartsChartModule } from 'highcharts-angular';
import { SeriesColumnOptions } from 'highcharts';
import { CompanyEarning } from '../../interfaces';

@Component({
  selector: 'app-eps-chart',
  standalone: true,
  imports: [HighchartsChartModule],
  templateUrl: './eps-chart.component.html',
  styleUrl: './eps-chart.component.css',
})
export class EpsChartComponent {
  @Input() earningData!: CompanyEarning[];
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions!: Highcharts.Options;

  ngOnChanges(changes: SimpleChange) {
    if ('earningData' in changes) {
      const change = changes.earningData as SimpleChange;
      const data = change.currentValue;
      if (data) {
        data.forEach((earning: CompanyEarning) => {
          if (earning.actual === null) {
            earning.actual = 0;
          }
          if (earning.estimate === null) {
            earning.estimate = 0;
          }
          if (earning.surprise === null) {
            earning.surprise = 0;
          }
          if (earning.surprisePercent === null) {
            earning.surprisePercent = 0;
          }
        });
        this.initChart(data);
      }
    }
  }
  initChart(earningData: CompanyEarning[]) {
    this.chartOptions = {
      chart: {
        backgroundColor: '#f5f4f4',
      },
      title: {
        text: 'Historical EPS Surprises',
      },
      yAxis: {
        title: {
          text: 'Quarterly EPS',
        },
      },
      xAxis: {
        categories: [
          earningData[0].period,
          earningData[1].period,
          earningData[2].period,
          earningData[3].period,
        ],
      },
      legend: {
        layout: 'horizontal',
        align: 'center',
        verticalAlign: 'bottom',
      },
      series: [
        {
          name: 'Actual',
          type: 'spline',
          data: [
            earningData[0].actual,
            earningData[1].actual,
            earningData[2].actual,
            earningData[3].actual,
          ],
          tooltip: {},
        },
        {
          name: 'Estimate',
          type: 'spline',
          data: [
            earningData[0].estimate,
            earningData[1].estimate,
            earningData[2].estimate,
            earningData[3].estimate,
          ],
          tooltip: {},
        },
      ],
    };
  }
}

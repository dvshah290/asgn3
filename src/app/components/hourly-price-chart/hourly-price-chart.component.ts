import { Component, Input, SimpleChange } from '@angular/core';
import { CompanyHistoricalData } from '../../interfaces';
import * as Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';

@Component({
  selector: 'app-hourly-price-chart',
  standalone: true,
  imports: [HighchartsChartModule],
  templateUrl: './hourly-price-chart.component.html',
  styleUrl: './hourly-price-chart.component.css',
})
export class HourlyPriceChartComponent {
  @Input() chartData!: CompanyHistoricalData;
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions!: Highcharts.Options;

  ngOnChanges(changes: SimpleChange) {
    if ('chartData' in changes) {
      const change = changes.chartData as SimpleChange;
      let data = change.currentValue as CompanyHistoricalData;
      if (data) {
        this.initChart(data);
      }
    }
  }
  initChart(data: CompanyHistoricalData) {
    let data1: any[] = [];
    let ticker = data.ticker;

    data.results.forEach((x) => {
      data1.push([x.t, x.c]);
    });
    const today = new Date();
    const dayOfWeek = today.getDay();

    const isWeekday = dayOfWeek >= 1 && dayOfWeek <= 5;
    const start = new Date();
    start.setHours(6, 30, 0, 0);

    const end = new Date();
    end.setHours(13, 0, 0, 0);

    const isTimeInRange = today >= start && today <= end;

    this.chartOptions = {
      accessibility: {
        enabled: false,
      },
      chart: {
        backgroundColor: '#f3f3f3',
      },
      title: {
        text: data.ticker + ' Hourly Price Variation',
        align: 'center',
      },
      xAxis: {
        type: 'datetime',
      },
      yAxis: {
        title: {
          text: '',
        },
        opposite: true,
      },
      series: [
        {
          data: data1,
          showInLegend: false,
          marker: {
            enabled: false,
          },
          color: isTimeInRange && isWeekday ? 'green' : 'red',
        },
      ] as Highcharts.SeriesOptionsType[],
      tooltip: {
        formatter: function () {
          return `${ticker}: ${this.y}`;
        },
      },
    };
  }
}

// import { Component, Input, SimpleChange } from '@angular/core';
// import { allData } from '../../../interfaces';
// import * as Highcharts from 'highcharts';
// import { HighchartsChartModule } from 'highcharts-angular';
// import { CompanyHistoricalData } from '../../interfaces';

// @Component({
//   selector: 'app-summary-charts',
//   standalone: true,
//   imports: [
//     HighchartsChartModule,
//   ],
//   templateUrl: './summary-charts.component.html',
//   styleUrl: './summary-charts.component.css'
// })
// export class SummaryChartsComponent {
//   @Input() data: allData;
//   Highcharts: typeof Highcharts = Highcharts;
//   chartOptions!: Highcharts.Options;

//   ngOnChanges(changes: SimpleChange) {
//     if ('data' in changes) {
//       const change = changes.data as SimpleChange;
//       if (change.currentValue) {
//         this.chart();
//       }
//     }
//   }

//   chart() {
//     let data1=[];
//     let ticker = this.data.profile.ticker;

//     for(let element of this.data.hours.results){
//       data1.push([
//         element.t,
//         element.c,
//       ])
//     }
//     const today = new Date();
//     const dayOfWeek = today.getDay();

//     const isWeekday = dayOfWeek >= 1 && dayOfWeek <= 5;
//     const start = new Date();
//     start.setHours(6, 30, 0, 0);

//     const end = new Date();
//     end.setHours(13, 0, 0, 0);

//     const isTimeInRange = today >= start && today <= end;

//     this.chartOptions = {
//       accessibility: {
//         enabled: false
//       },
//       chart: {
//         backgroundColor: '#f3f3f3'
//       },
//       title: {
//         text: this.data.profile.ticker +' Hourly Price Variation',
//         align: 'center'
//       },
//       xAxis: {
//         type: 'datetime',
//       },
//       yAxis: {
//         title: {
//           text: ''
//         },
//         opposite: true,
//       },
//       series: [{
//         data: data1,
//         showInLegend: false,
//         marker: {
//           enabled: false
//         },
//         color: isTimeInRange && isWeekday ? 'green' : 'red',
//       }] as Highcharts.SeriesOptionsType[],
//       tooltip: {
//         formatter: function() {
//           return ${ticker}: ${this.y}
//         }
//       }
//     }
//   }
// }

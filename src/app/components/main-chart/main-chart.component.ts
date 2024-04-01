import * as Highcharts from 'highcharts';
import { Component, Input, SimpleChange } from '@angular/core';
import { HighchartsChartModule } from 'highcharts-angular';
import { SeriesColumnOptions } from 'highcharts';
import StockModule from 'highcharts/modules/stock';
import IndicatorsCore from 'highcharts/indicators/indicators';
// import SMA from 'highcharts/indicators/sma';
import VBP from 'highcharts/indicators/volume-by-price';
import { CompanyHistoricalData } from '../../interfaces';
StockModule(Highcharts);
IndicatorsCore(Highcharts);
// SMA(Highcharts);
VBP(Highcharts);

@Component({
  selector: 'app-main-chart',
  standalone: true,
  imports: [HighchartsChartModule],
  templateUrl: './main-chart.component.html',
  styleUrl: './main-chart.component.css',
})
export class MainChartComponent {
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
    let ohlc_data: any[] = [];
    let time_vs_volume: any[] = [];
    data.results.forEach((x) => {
      ohlc_data.push([x.t, x.o, x.h, x.l, x.c]);
      time_vs_volume.push([x.t, x.v]);
    });
    this.chartOptions = {
      accessibility: {
        enabled: false,
      },

      legend: {
        enabled: false,
      },
      title: {
        text: this.chartData.ticker + ' Historical',
      },

      subtitle: {
        text: 'With SMA and Volume by Price technical indicators',
      },

      navigator: {
        enabled: true,
      },

      // chart: {
      //   height: '100%'
      // },

      stockTools: {
        gui: {
          enabled: true,
          buttons: ['rangeSelector', 'datepicker'],
        },
      },

      xAxis: {
        type: 'datetime',
        range: 6 * 30 * 24 * 3600 * 1000,
      },

      yAxis: [
        {
          startOnTick: false,
          endOnTick: false,
          labels: {
            align: 'right',
            x: -3,
          },
          title: {
            text: 'OHLC',
          },
          height: '65%',
          lineWidth: 2,
          resize: {
            enabled: true,
          },
          opposite: true,
        },
        {
          labels: {
            align: 'right',
            x: -3,
          },
          title: {
            text: 'Volume',
          },
          top: '70%',
          height: '30%',
          offset: 0,
          lineWidth: 2,
          opposite: true,
        },
      ],

      tooltip: {
        split: true,
      },

      rangeSelector: {
        selected: 0,
        enabled: true,
        inputEnabled: true,
        buttons: [
          {
            type: 'month',
            count: 1,
            text: '1m',
          },
          {
            type: 'month',
            count: 3,
            text: '3m',
          },
          {
            type: 'month',
            count: 6,
            text: '6m',
          },
          {
            type: 'ytd',
            text: 'YTD',
          },
          {
            type: 'all',
            text: 'All',
          },
        ],
      },

      series: [
        {
          type: 'candlestick',
          name: this.chartData.ticker,
          id: 'OHLC',
          zIndex: 2,
          pointWidth: 5,
          data: ohlc_data,
        },
        {
          type: 'column',
          name: 'Volume',
          id: 'volume',
          data: time_vs_volume,
          yAxis: 1,
        },
        {
          type: 'vbp',
          linkedTo: 'OHLC',
          params: {
            volumeSeriesID: 'volume',
          },
          dataLabels: {
            enabled: false,
          },
          zoneLines: {
            enabled: false,
          },
        },
        {
          type: 'sma',
          linkedTo: 'OHLC',
          zIndex: 1,
          marker: {
            enabled: false,
          },
        },
      ],
    };
  }
}

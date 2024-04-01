import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  ViewChild,
  inject,
  viewChild,
} from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MainService } from '../../services/main.service';
import {
  CompanyNews,
  CompanyProfile,
  CompanyQuote,
  CompanySentiment,
  CompleteData,
  PortfolioItem,
  SentimentAggregation,
} from '../../interfaces';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HomeComponent } from '../home/home.component';
import { RecommendationChartComponent } from '../recommendation-chart/recommendation-chart.component';
import { EpsChartComponent } from '../eps-chart/eps-chart.component';
import { MainChartComponent } from '../main-chart/main-chart.component';
import { GeneralService } from '../../services/general.service';
import { BuyComponent } from '../displayComponents/buy/buy.component';
import { SellComponent } from '../displayComponents/sell/sell.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NewsModalComponent } from '../displayComponents/news-modal/news-modal.component';
import { HourlyPriceChartComponent } from '../hourly-price-chart/hourly-price-chart.component';

declare var bootstrap: any;

@Component({
  selector: 'app-stock-page',
  standalone: true,
  imports: [
    MatTabsModule,
    CommonModule,
    HomeComponent,
    RouterLink,
    RecommendationChartComponent,
    EpsChartComponent,
    MainChartComponent,
    BuyComponent,
    SellComponent,
    NewsModalComponent,
    HourlyPriceChartComponent,
  ],
  templateUrl: './stock-page.component.html',
  styleUrl: './stock-page.component.css',
})
export class StockPageComponent {
  constructor(
    private dataFetch: MainService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private generalService: GeneralService
  ) {}
  modalService = inject(NgbModal);
  ticker!: string;
  completeData!: CompleteData | undefined;
  marketOpen!: boolean;
  fiveMinutes = 5 * 60 * 1000;
  selectedNewsItem!: CompanyNews;
  encodedText!: string;
  encodedURL!: string;
  formattedDate!: string;
  sentiment_values!: SentimentAggregation;
  is_in_watchlist!: boolean;
  watchlist_alert!: boolean;
  quote_data!: CompanyQuote;
  is_in_portfolio!: boolean;
  buy_alert: boolean = false;
  sell_alert: boolean = false;
  balance!: number;

  openBuyModal() {
    const modal = this.modalService.open(BuyComponent);
    modal.componentInstance.ticker = this.completeData?.profile.ticker;
    modal.componentInstance.name = this.completeData?.profile.ticker;
    modal.componentInstance.quote_data = this.quote_data;
    modal.componentInstance.balance = this.balance;
    modal.componentInstance.buyCompleted.subscribe(() => {
      this.buy_alert = true;
      setTimeout(() => {
        this.buy_alert = false;
      }, 5000);
    });
  }

  openSellModal() {
    const modal = this.modalService.open(SellComponent);
    modal.componentInstance.quote_data = this.quote_data;
    modal.componentInstance.ticker = this.completeData?.profile.ticker;
    modal.componentInstance.name = this.completeData?.profile.ticker;
    modal.componentInstance.balance = this.balance;
    modal.componentInstance.sellCompleted.subscribe(() => {
      this.sell_alert = true;
      setTimeout(() => {
        this.sell_alert = false;
      }, 5000);
    });
  }

  watchlistSwitch() {
    if (this.is_in_watchlist) {
      this.generalService
        .deleteWatchlistItem(this.ticker.toUpperCase())
        .subscribe((x) => {
          this.is_in_watchlist = false;
          this.watchlist_alert = true;
          this.cdr.detectChanges();
          setTimeout(() => {
            this.watchlist_alert = false;
            this.cdr.detectChanges();
          }, 4000);
        });
    } else {
      if (this.completeData) {
        let watchlistItem = {
          ticker: this.ticker.toUpperCase(),
          name: this.completeData.profile.name,
        };
        this.generalService.addWatchlistItem(watchlistItem).subscribe((x) => {
          this.is_in_watchlist = true;
          this.watchlist_alert = true;
          this.cdr.detectChanges();
          setTimeout(() => {
            this.watchlist_alert = false;
            this.cdr.detectChanges();
          }, 4000);
        });
      }
    }
  }

  closeAlert() {
    this.watchlist_alert = false;
    this.buy_alert = false;
    this.sell_alert = false;
    this.cdr.detectChanges();
  }

  calculate_sentiment_values(arr: CompanySentiment) {
    let total_mspr = 0;
    let total_change = 0;
    let positive_mspr = 0;
    let negative_mspr = 0;
    let positive_change = 0;
    let negative_change = 0;
    arr.data.forEach((item) => {
      total_mspr += item.mspr;
      total_change += item.change;
      if (item.mspr > 0) {
        positive_mspr += item.mspr;
      }
      if (item.mspr < 0) {
        negative_mspr += item.mspr;
      }
      if (item.change > 0) {
        positive_change += item.change;
      }
      if (item.change < 0) {
        negative_change += item.change;
      }
    });
    return {
      total_mspr: parseFloat(total_mspr.toFixed(2)),
      total_change: parseFloat(total_change.toFixed(2)),
      positive_mspr: parseFloat(positive_mspr.toFixed(2)),
      negative_mspr: parseFloat(negative_mspr.toFixed(2)),
      positive_change: parseFloat(positive_change.toFixed(2)),
      negative_change: parseFloat(negative_change.toFixed(2)),
    };
  }

  openNewsModal(newsItem: CompanyNews) {
    const modal = this.modalService.open(NewsModalComponent);
    modal.componentInstance.newsItem = newsItem;
  }
  ngOnInit() {
    let currentTime = new Date().getTime();
    // this.completeData = this.dataFetch.getAllData(this.ticker);
    this.route.paramMap.subscribe((params) => {
      this.ticker = params.get('ticker') || '';
      this.cdr.detectChanges();
      this.dataFetch.getAllData(this.ticker, false).subscribe((data) => {
        this.completeData =
          data.profile && Object.keys(data.profile).length > 0
            ? data
            : undefined;
        console.log(this.completeData);
        if (this.completeData !== undefined) {
          this.sentiment_values = this.calculate_sentiment_values(
            this.completeData.sentiment
          );
        }
      });
      this.generalService.getWatchlistData().subscribe((x) => {
        let ticker_array = x.map((x) => x.ticker);
        this.is_in_watchlist = ticker_array.includes(this.ticker.toUpperCase())
          ? true
          : false;
      });
      this.dataFetch.getCompanyQuoteData(this.ticker).subscribe((data) => {
        this.quote_data = data;
        this.marketOpen =
          currentTime - data.t > this.fiveMinutes ? false : true;
        if (this.marketOpen) {
          setInterval(() => {
            this.dataFetch
              .getCompanyQuoteData(this.ticker)
              .subscribe((data) => {
                this.quote_data = data;
                this.cdr.detectChanges();
              });
          }, 15000);
        }
      });
      this.generalService.getPortfolioData().subscribe((data) => {
        let ticker_array = data.map((x) => x.ticker);
        this.is_in_portfolio = ticker_array.includes(this.ticker.toUpperCase());
      });
      this.generalService.getBalance().subscribe((data) => {
        this.balance = data[0].balance;
      });
    });
  }
  // mongodb username = devanshu290
  // mongodb password = ijsXyBSgncjlzrXH
  // connection string = mongodb+srv://devanshu290:ijsXyBSgncjlzrXH@customerdata.utbe9oi.mongodb.net/?retryWrites=true&w=majority&appName=CustomerData
  // connection string2 = mongodb+srv://devanshu290:<password>@customerdata.utbe9oi.mongodb.net/
}

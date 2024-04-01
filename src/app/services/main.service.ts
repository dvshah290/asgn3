import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  CompanyProfile,
  CompanyEarning,
  CompanyHistoricalData,
  CompanyQuote,
  CompanySentiment,
  CompanyNews,
  Sentiment,
  HistoricalData,
  CompleteData,
  RecommendationItem,
  WatchlistItem,
  PortfolioItem,
  BalanceItem,
} from '../interfaces';
import { Observable, filter, forkJoin, map, of, pipe, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MainService {
  constructor(private http: HttpClient) {}
  baseUrl: string = `https://api-dot-ds-asgn3.uw.r.appspot.com`;

  public dataCache: { [key: string]: CompleteData } = {};
  // company api calls
  allFieldsFilled = (obj: any) => {
    return Object.values(obj).every((value) => value !== null && value !== '');
  };

  public getCompanyProfileData(key: string): Observable<CompanyProfile> {
    return this.http.get<CompanyProfile>(
      `${this.baseUrl}/company-profile/${key}`
    );
  }

  public getCompanyQuoteData(key: string): Observable<CompanyQuote> {
    return this.http.get<CompanyQuote>(`${this.baseUrl}/company-quote/${key}`);
  }

  public getCompanyRecommendationData(
    key: string
  ): Observable<RecommendationItem[]> {
    return this.http.get<RecommendationItem[]>(
      `${this.baseUrl}/company-recommendation/${key}`
    );
  }

  public getCompanyNewsData(key: string): Observable<CompanyNews[]> {
    return this.http
      .get<CompanyNews[]>(`${this.baseUrl}/company-news/${key}`)
      .pipe(map((res) => res.filter(this.allFieldsFilled).slice(0, 10)));
  }
  public getCompanyEarningData(key: string): Observable<CompanyEarning[]> {
    return this.http.get<CompanyEarning[]>(
      `${this.baseUrl}/company-earnings/${key}`
    );
  }
  public getCompanySentimentData(key: string): Observable<CompanySentiment> {
    return this.http.get<CompanySentiment>(
      `${this.baseUrl}/company-sentiment/${key}`
    );
  }
  public getCompanyPeersData(key: string): Observable<String[]> {
    return this.http
      .get<String[]>(`${this.baseUrl}/company-peers/${key}`)
      .pipe(map((res) => res.filter((x) => !x.includes('.'))));
  }
  public getCompanyHistoricalData(
    key: string
  ): Observable<CompanyHistoricalData> {
    return this.http.get<CompanyHistoricalData>(
      `${this.baseUrl}/company-historical-data/${key}`
    );
  }

  public getCompanyHistoricalHourlyData(
    key: string
  ): Observable<CompanyHistoricalData> {
    return this.http.get<CompanyHistoricalData>(
      `${this.baseUrl}/company-historical-hourly-data/${key}`
    );
  }

  //mongo api calls
  public getWatchlistData(): Observable<WatchlistItem[]> {
    return this.http.get<WatchlistItem[]>(`${this.baseUrl}/watchlist-data`);
  }

  public addWatchlistItem(item: WatchlistItem): Observable<WatchlistItem> {
    return this.http.post<WatchlistItem>(
      `${this.baseUrl}/watchlist-create`,
      item
    );
  }

  public deleteWatchlistItem(ticker: string): Observable<string> {
    return this.http.delete<string>(
      `${this.baseUrl}/watchlist-delete/${ticker}`
    );
  }

  public getPortfolioData(): Observable<PortfolioItem[]> {
    return this.http.get<PortfolioItem[]>(`${this.baseUrl}/portfolio-data`);
  }

  public addPortfolioItem(item: PortfolioItem): Observable<PortfolioItem> {
    return this.http.post<PortfolioItem>(
      `${this.baseUrl}/portfolio-create`,
      item
    );
  }

  public getBalance(): Observable<BalanceItem[]> {
    return this.http.get<BalanceItem[]>(`${this.baseUrl}/get-balance`);
  }

  public setBalance(item: BalanceItem): Observable<string> {
    return this.http.put<string>(`${this.baseUrl}/set-balance`, item);
  }

  public getAllData(key: string, forceRefresh: boolean = false) {
    if (!forceRefresh && this.dataCache[key]) {
      return of(this.dataCache[key]);
    }
    return forkJoin({
      profile: this.getCompanyProfileData(key),
      quote: this.getCompanyQuoteData(key),
      recommendation: this.getCompanyRecommendationData(key),
      news: this.getCompanyNewsData(key),
      earning: this.getCompanyEarningData(key),
      sentiment: this.getCompanySentimentData(key),
      peers: this.getCompanyPeersData(key),
      historical: this.getCompanyHistoricalData(key),
      historical_hourly: this.getCompanyHistoricalHourlyData(key),
    }).pipe(
      tap((data) => {
        this.dataCache[key] = data;
      })
    );
  }
}

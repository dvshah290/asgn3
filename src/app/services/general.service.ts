import { Injectable } from '@angular/core';
import { WatchlistItem, PortfolioItem, BalanceItem } from '../interfaces';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GeneralService {
  base_url = 'https://api-dot-ds-asgn3.uw.r.appspot.com/';
  constructor(private http: HttpClient) {}

  public getWatchlistData(): Observable<WatchlistItem[]> {
    return this.http.get<WatchlistItem[]>(`${this.base_url}/watchlist-data`);
  }

  public addWatchlistItem(item: WatchlistItem): Observable<WatchlistItem> {
    return this.http.post<WatchlistItem>(
      `${this.base_url}/watchlist-create`,
      item
    );
  }

  public deleteWatchlistItem(ticker: string): Observable<string> {
    return this.http.delete<string>(
      `${this.base_url}/watchlist-delete/${ticker}`
    );
  }

  public getPortfolioData(): Observable<PortfolioItem[]> {
    return this.http.get<PortfolioItem[]>(`${this.base_url}/portfolio-data`);
  }

  public addPortfolioItem(item: PortfolioItem): Observable<PortfolioItem> {
    return this.http.post<PortfolioItem>(
      `${this.base_url}/portfolio-create`,
      item
    );
  }

  public getBalance(): Observable<BalanceItem[]> {
    return this.http.get<BalanceItem[]>(`${this.base_url}/get-balance`);
  }

  public setBalance(item: BalanceItem): Observable<string> {
    return this.http.put<string>(`${this.base_url}/set-balance`, item);
  }
}

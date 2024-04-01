import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TickerService {
  private lastSearchedTicker = new BehaviorSubject<string | null>(null);
  lastSearchedTicker$ = this.lastSearchedTicker.asObservable();
  constructor() {}
  updateLastSearchedTicker(ticker: string) {
    this.lastSearchedTicker.next(ticker);
  }
}

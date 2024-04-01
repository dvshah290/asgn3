import { Component, EventEmitter, Input, Output } from '@angular/core';
import { WatchlistItem } from '../../../interfaces';
import { MainService } from '../../../services/main.service';
import { CommonModule } from '@angular/common';
import { GeneralService } from '../../../services/general.service';

@Component({
  selector: 'app-watchlist-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './watchlist-item.component.html',
  styleUrl: './watchlist-item.component.css',
})
export class WatchlistItemComponent {
  @Input() watchlistItem!: WatchlistItem;
  @Output() itemDeleted = new EventEmitter<void>();
  constructor(
    private dataFetch: MainService,
    private generalService: GeneralService
  ) {}
  current_price!: number;
  change!: number;
  change_percent!: number;
  is_negative!: boolean;

  deleteItem() {
    console.log('hello');
    console.log(this.watchlistItem.ticker);
    this.generalService
      .deleteWatchlistItem(this.watchlistItem.ticker)
      .subscribe((x) => {
        this.itemDeleted.emit();
      });
  }

  ngOnInit() {
    console.log(this.watchlistItem);
    this.dataFetch
      .getCompanyQuoteData(this.watchlistItem.ticker)
      .subscribe((quote) => {
        this.current_price = parseFloat(quote.c.toFixed(2));
        this.change = parseFloat(quote.d.toFixed(2));
        this.change_percent = parseFloat(quote.dp.toFixed(2));
        this.is_negative = this.change < 0 ? true : false;
      });
  }
}

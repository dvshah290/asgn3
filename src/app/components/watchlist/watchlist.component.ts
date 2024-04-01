import { ChangeDetectorRef, Component } from '@angular/core';
import { GeneralService } from '../../services/general.service';
import { WatchlistItem, WatchlistPageData } from '../../interfaces';
import { CommonModule } from '@angular/common';
import { Observable, switchMap } from 'rxjs';
import { WatchlistItemComponent } from '../displayComponents/watchlist-item/watchlist-item.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-watchlist',
  standalone: true,
  imports: [CommonModule, WatchlistItemComponent, MatProgressSpinnerModule],
  templateUrl: './watchlist.component.html',
  styleUrl: './watchlist.component.css',
})
export class WatchlistComponent {
  constructor(
    private generalService: GeneralService,
    private cdr: ChangeDetectorRef //
  ) {}
  watchlist!: WatchlistItem[];
  final_data!: WatchlistPageData;
  isLoading: boolean = true;
  onItemDelete() {
    this.generalService.getWatchlistData().subscribe((data) => {
      this.watchlist = data;
      this.cdr.detectChanges();
    });
  }

  ngOnInit() {
    console.log(this.isLoading);
    this.generalService.getWatchlistData().subscribe((data) => {
      this.watchlist = data;
      this.isLoading = false;
      console.log(this.isLoading);
      this.cdr.detectChanges();
      console.log(this.watchlist);
      console.log('inside watchlist');
    });
  }
}

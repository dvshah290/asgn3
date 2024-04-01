import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { TickerService } from './services/ticker.service';
import { Subscription } from 'rxjs';
import { GeneralService } from './services/general.service';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  lastSearchedTicker: string | null = null;
  private subscription!: Subscription;
  constructor(
    private tickerService: TickerService,
    private generalService: GeneralService
  ) {
    this.subscription = this.tickerService.lastSearchedTicker$.subscribe(
      (ticker) => {
        this.lastSearchedTicker = ticker;
      }
    );
  }
  // ngOnInit() {
  //   this.generalService.getGeneralData().subscribe((res) => {
  //     console.log(res);
  //   });
  // }
}

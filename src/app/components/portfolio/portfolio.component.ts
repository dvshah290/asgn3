import { ChangeDetectorRef, Component } from '@angular/core';
import { GeneralService } from '../../services/general.service';
import { BalanceItem, PortfolioItem } from '../../interfaces';
import { CommonModule } from '@angular/common';
import { PortfolioItemComponent } from '../displayComponents/portfolio-item/portfolio-item.component';

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [CommonModule, PortfolioItemComponent],
  templateUrl: './portfolio.component.html',
  styleUrl: './portfolio.component.css',
})
export class PortfolioComponent {
  constructor(
    private generalService: GeneralService,
    private cdr: ChangeDetectorRef
  ) {}
  balance!: number;
  portfolio!: PortfolioItem[];

  buy_alert: boolean = false;
  buy_alert_ticker!: string;
  sell_alert: boolean = false;
  sell_alert_ticker!: string;

  handleBuyAlert(data: string) {
    this.generalService.getPortfolioData().subscribe((data) => {
      this.portfolio = data;
    });
    this.generalService.getBalance().subscribe((data) => {
      this.balance = data[0].balance;
    });
    console.log(this.portfolio);
    this.cdr.detectChanges();
    this.buy_alert = true;
    this.buy_alert_ticker = data;
    this.cdr.detectChanges();
    setInterval(() => {
      this.buy_alert = false;
      this.cdr.detectChanges();
    }, 5000);
  }

  handleSellAlert(data: string) {
    this.generalService.getPortfolioData().subscribe((data) => {
      this.portfolio = data;
    });
    this.generalService.getBalance().subscribe((data) => {
      this.balance = data[0].balance;
    });
    this.sell_alert = true;
    this.sell_alert_ticker = data;
    this.cdr.detectChanges();
    setInterval(() => {
      this.sell_alert = false;
      this.cdr.detectChanges();
    }, 5000);
  }

  closeAlert() {
    this.buy_alert = false;
    this.sell_alert = false;
    this.cdr.detectChanges();
  }

  ngOnInit() {
    this.generalService.getPortfolioData().subscribe((data) => {
      this.portfolio = data;
    });
    this.generalService.getBalance().subscribe((data) => {
      this.balance = data[0].balance;
    });
  }
}

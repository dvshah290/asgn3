import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CompanyQuote, PortfolioItem } from '../../../interfaces';
import { MainService } from '../../../services/main.service';
import { CommonModule } from '@angular/common';
import { BuyComponent } from '../buy/buy.component';
import { SellComponent } from '../sell/sell.component';
import { NgModel } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GeneralService } from '../../../services/general.service';

@Component({
  selector: 'app-portfolio-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './portfolio-item.component.html',
  styleUrl: './portfolio-item.component.css',
})
export class PortfolioItemComponent {
  @Input() portfolioItem!: PortfolioItem;
  @Output() parentSellAlert = new EventEmitter<string>();
  @Output() parentBuyAlert = new EventEmitter<string>();
  constructor(
    private dataFetch: MainService,
    private generalService: GeneralService
  ) {}

  change!: number;
  current_price!: number;
  market_value!: number;
  is_negative!: boolean;
  quote_data!: CompanyQuote;
  balance!: number;

  modalService = inject(NgbModal);

  openBuyModal() {
    const modal = this.modalService.open(BuyComponent);
    modal.componentInstance.ticker = this.portfolioItem.ticker;
    modal.componentInstance.name = this.portfolioItem.name;
    modal.componentInstance.quote_data = this.quote_data;
    modal.componentInstance.balance = this.balance;
    modal.componentInstance.buyCompleted.subscribe((x: string) => {
      this.parentBuyAlert.emit(x);
    });
  }

  openSellModal() {
    const modal = this.modalService.open(SellComponent);
    modal.componentInstance.quote_data = this.quote_data;
    modal.componentInstance.ticker = this.portfolioItem.ticker;
    modal.componentInstance.name = this.portfolioItem.name;
    modal.componentInstance.balance = this.balance;
    modal.componentInstance.sellCompleted.subscribe((x: string) => {
      this.parentSellAlert.emit(x);
    });
  }

  ngOnInit() {
    this.dataFetch
      .getCompanyQuoteData(this.portfolioItem.ticker)
      .subscribe((quote) => {
        this.quote_data = quote;
        console.log(this.quote_data);
        this.change = parseFloat(quote.d.toFixed(2));
        this.is_negative = this.change < 0 ? true : false;
        this.current_price = parseFloat(quote.c.toFixed(2));
        this.market_value = parseFloat(
          (this.portfolioItem.quantity * this.current_price).toFixed(2)
        );
      });
    this.generalService.getBalance().subscribe((x) => {
      this.balance = x[0].balance;
    });
  }
}

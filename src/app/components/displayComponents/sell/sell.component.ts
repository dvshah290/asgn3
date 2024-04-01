import {
  Component,
  EventEmitter,
  Input,
  Output,
  inject,
  input,
} from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {
  BalanceItem,
  CompanyQuote,
  CompleteData,
  PortfolioItem,
} from '../../../interfaces';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { GeneralService } from '../../../services/general.service';

@Component({
  selector: 'app-sell',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './sell.component.html',
  styleUrl: './sell.component.css',
})
export class SellComponent {
  @Input() quote_data!: CompanyQuote;
  @Input() balance!: number;
  @Input() ticker!: string;
  @Input() name!: string;
  @Output() sellCompleted = new EventEmitter<string>();
  modal = inject(NgbActiveModal);
  constructor(private generalService: GeneralService) {}

  isValidQuantity: boolean = false;
  inputControl = new FormControl();
  total: number = 0.0;
  portfolio_item!: PortfolioItem;

  sellClicked() {
    console.log('hello world');
    console.log(this.portfolio_item);
    console.log(this.balance);
    let quantity = this.portfolio_item.quantity - this.inputControl.value;
    let total = this.portfolio_item.total_cost - this.total;
    let avg_cost = total / quantity;
    let balance = {
      balance: this.balance + this.total,
    };
    this.generalService.setBalance(balance).subscribe();
    let data = {
      quantity: quantity,
      total_cost: total,
      avg_cost: avg_cost,
      ticker: this.ticker,
      name: this.name,
    };
    this.generalService.addPortfolioItem(data).subscribe((x) => {
      console.log('sell completed');
      this.sellCompleted.emit(this.ticker);
    });
  }

  ngOnInit() {
    this.generalService.getPortfolioData().subscribe((x) => {
      let item = x.find((o) => o.ticker === this.ticker);
      if (item !== undefined) {
        this.portfolio_item = item;
        this.inputControl.valueChanges.subscribe((value) => {
          this.total = this.quote_data.c * value;
          if (value > this.portfolio_item.quantity || value <= 0) {
            this.isValidQuantity = false;
          } else {
            this.isValidQuantity = true;
          }
        });
      }
    });
  }
}

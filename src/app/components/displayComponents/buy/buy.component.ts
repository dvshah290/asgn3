import {
  Component,
  EventEmitter,
  Input,
  Output,
  inject,
  input,
} from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { CompanyQuote, CompleteData, PortfolioItem } from '../../../interfaces';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GeneralService } from '../../../services/general.service';

@Component({
  selector: 'app-buy',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './buy.component.html',
  styleUrl: './buy.component.css',
})
export class BuyComponent {
  @Input() quote_data!: CompanyQuote;
  @Input() ticker!: string;
  @Input() name!: string;
  @Input() balance!: number;

  @Output() buyCompleted = new EventEmitter<string>();
  constructor(private generalService: GeneralService) {}

  inputControl = new FormControl();
  total: number = 0.0;
  isValidQuantity: boolean = false;
  portfolio_item: PortfolioItem | undefined;
  buyClicked() {
    let balance = {
      balance: parseFloat((this.balance - this.total).toFixed(2)),
    };
    this.generalService.setBalance(balance).subscribe();
    this.generalService.getPortfolioData().subscribe((x) => {
      let total_cost;
      let quantity;
      let avg_cost;
      console.log(x);
      let portfolio_item = x.find((o) => o.ticker === this.ticker);
      console.log(portfolio_item);
      if (portfolio_item) {
        total_cost = portfolio_item.total_cost + this.total;
        quantity = portfolio_item.quantity + this.inputControl.value;
        avg_cost = total_cost / quantity;
      } else {
        total_cost = this.total;
        quantity = this.inputControl.value;
        avg_cost = total_cost / quantity;
      }
      let data = {
        ticker: this.ticker,
        name: this.name,
        quantity: quantity,
        avg_cost: avg_cost,
        total_cost: total_cost,
      };
      this.generalService.addPortfolioItem(data).subscribe(() => {
        this.buyCompleted.emit(this.name);
      });
    });
  }

  modal = inject(NgbActiveModal);
  ngOnInit() {
    this.inputControl.valueChanges.subscribe((x) => {
      console.log(x);
      this.total = this.quote_data.c * x;
      this.total = this.total;
      if (this.total > this.balance || this.total == 0) {
        this.isValidQuantity = false;
      } else {
        this.isValidQuantity = true;
      }
      console.log(this.total);
    });
  }
}

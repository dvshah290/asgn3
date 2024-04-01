import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  ReactiveFormsModule,
  FormsModule,
  NgForm,
  FormBuilder,
} from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Observable, Subject, Subscription, finalize, of, tap } from 'rxjs';
import {
  map,
  debounceTime,
  switchMap,
  startWith,
  catchError,
  filter,
} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AutocompleteInterface, CompleteData, result } from '../../interfaces';
import { Router } from '@angular/router';
import { MainService } from '../../services/main.service';
import { TickerService } from '../../services/ticker.service';
import { tick } from '@angular/core/testing';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MatAutocompleteModule,
    MatInputModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  providers: [HttpClient],
})
export class HomeComponent {
  @Input() tickerData!: string;
  constructor(
    private http: HttpClient,
    private router: Router,
    private dataFetch: MainService,
    private tickerService: TickerService
  ) {}
  inputControl = new FormControl();
  filterOptions!: Observable<result[]>;
  isLoading: boolean = false;
  isValidSearch: boolean = true;

  loadSymbols(search: string | null): Observable<AutocompleteInterface> {
    if (search == null) search = '';
    return this.http.get<AutocompleteInterface>(
      `https://api-dot-ds-asgn3.uw.r.appspot.com/symbol-lookup/${search}`
    );
  }

  onSubmit() {
    const ticker = this.inputControl.value;
    if (ticker != null) {
      this.dataFetch.getAllData(ticker, true).subscribe((res) => {
        if (res.profile.ticker) {
          this.router.navigate(['/search', ticker]);
          this.tickerService.updateLastSearchedTicker(ticker || '');
        } else {
          this.router.navigate(['/search', ticker]);
          this.isValidSearch = false;
        }
      });
    }
  }

  onClear() {
    this.inputControl.setValue('');
    this.router.navigate(['/search', 'home']);
  }

  ngOnInit() {
    this.inputControl.setValue(this.tickerData);
    this.filterOptions = this.inputControl.valueChanges.pipe(
      debounceTime(100),
      filter((value) => value != null),
      filter((value) => value !== ''),
      tap(() => {
        this.isLoading = true;
      }),
      switchMap((value) =>
        this.loadSymbols(value).pipe(
          tap(() => {
            this.isLoading = false;
          })
        )
      ),
      map((res) =>
        res.result
          .filter((x) => x.type === 'Common Stock')
          .filter((x) => !x.symbol.includes('.'))
      )
    );
  }
}

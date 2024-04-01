import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AutocompleteService {
  constructor(private http: HttpClient) {}

  public getAutocompleteData(key: string) {
    return this.http.get(
      `https://api-dot-ds-asgn3.uw.r.appspot.com/symbol-lookup/${key}`
    );
  }
}

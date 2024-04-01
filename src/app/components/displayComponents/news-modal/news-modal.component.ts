import { Component, Input, inject } from '@angular/core';
import { CompanyNews } from '../../../interfaces';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-news-modal',
  standalone: true,
  imports: [],
  templateUrl: './news-modal.component.html',
  styleUrl: './news-modal.component.css',
})
export class NewsModalComponent {
  @Input() newsItem!: CompanyNews;
  modal = inject(NgbActiveModal);
  encodedText!: string;
  encodedURL!: string;
  formattedDate!: string;
  ngOnInit() {
    const date = new Date(this.newsItem.datetime);
    this.formattedDate = date.toLocaleDateString('en-us', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
    this.encodedText = encodeURIComponent(this.newsItem.headline);
    this.encodedURL = encodeURIComponent(this.newsItem.url);
  }
}

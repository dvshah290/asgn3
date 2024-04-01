import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { StockPageComponent } from './components/stock-page/stock-page.component';
import { WatchlistComponent } from './components/watchlist/watchlist.component';
import { PortfolioComponent } from './components/portfolio/portfolio.component';

export const routes: Routes = [
  {
    path: 'search/home',
    component: HomeComponent,
    title: 'Home',
  },
  {
    path: 'search/:ticker',
    component: StockPageComponent,
    title: 'Stock',
  },
  {
    path: 'watchlist',
    component: WatchlistComponent,
    title: 'Watchlist',
  },
  {
    path: 'portfolio',
    component: PortfolioComponent,
    title: 'Portfolio',
  },
  {
    path: '',
    redirectTo: '/search/home',
    pathMatch: 'full',
  },
];

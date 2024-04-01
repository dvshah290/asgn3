import { Observable } from 'rxjs';

export interface result {
  description: string;
  displaySymbol: string;
  symbol: string;
  type: string;
}

export interface AutocompleteInterface {
  count: number;
  result: result[];
}

export interface CompanyProfile {
  country: string;
  currency: string;
  estimateCurrency: string;
  exchange: string;
  finnhubIndustry: string;
  ipo: string;
  logo: string;
  marketCapitalization: number;
  name: string;
  phone: string;
  shareOutstanding: number;
  ticker: string;
  weburl: string;
}

export interface CompanyQuote {
  c: number;
  d: number;
  dp: number;
  h: number;
  l: number;
  o: number;
  pc: number;
  t: number;
}

export interface RecommendationItem {
  buy: number;
  hold: number;
  period: string;
  sell: number;
  strongBuy: number;
  strongSell: number;
  symbol: string;
}

export interface CompanyNews {
  category: string;
  datetime: number;
  headline: string;
  id: number;
  image: string;
  related: string;
  source: string;
  summary: string;
  url: string;
}

export interface CompanyEarning {
  actual: number;
  estimate: number;
  period: string;
  quarter: number;
  surprise: number;
  surprisePercent: number;
  symbol: string;
  year: number;
}

export interface Sentiment {
  symbol: string;
  year: number;
  month: number;
  change: number;
  mspr: number;
}

export interface CompanySentiment {
  data: Sentiment[];
}

export interface HistoricalData {
  v: number;
  vw: number;
  o: number;
  c: number;
  h: number;
  l: number;
  t: number;
  n: number;
}

export interface CompanyHistoricalData {
  ticker: string;
  queryCount: number;
  resultsCount: number;
  adjusted: boolean;
  results: HistoricalData[];
}

export interface CompleteData {
  profile: CompanyProfile;
  quote: CompanyQuote;
  recommendation: RecommendationItem[];
  news: CompanyNews[];
  earning: CompanyEarning[];
  sentiment: CompanySentiment;
  peers: String[];
  historical: CompanyHistoricalData;
  historical_hourly: CompanyHistoricalData;
}

// watchlist data
export interface WatchlistItem {
  _id?: string;
  ticker: string;
  name: string;
}

export interface PortfolioItem {
  _id?: string;
  ticker: string;
  name: string;
  quantity: number;
  avg_cost: number;
  total_cost: number;
}

export interface BalanceItem {
  _id?: string;
  balance: number;
}

export interface WatchlistPageData {
  _id?: string;
  ticker: string;
  name: string;
  c: number;
  d: number;
  dp: number;
}

export interface SentimentAggregation {
  total_mspr: number;
  total_change: number;
  positive_mspr: number;
  positive_change: number;
  negative_mspr: number;
  negative_change: number;
}

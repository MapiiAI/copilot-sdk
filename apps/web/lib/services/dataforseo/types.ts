/**
 * DataForSEO service types.
 *
 * These types model the subset of the DataForSEO API surface used by mapii.ai.
 * Add additional properties as you expand coverage of the DataForSEO API.
 * @see https://docs.dataforseo.com/
 */

export interface DataForSEOCredentials {
  login: string;
  password: string;
}

export interface KeywordSearchResult {
  keyword: string;
  searchVolume: number;
  competition: number;
  cpc: number;
}

export interface LocalBusinessResult {
  placeId: string;
  title: string;
  address: string;
  rating: number | null;
  reviewCount: number;
  categories: string[];
  phone: string | null;
  website: string | null;
  latitude: number;
  longitude: number;
}

export interface SerpResult {
  position: number;
  url: string;
  title: string;
  description: string;
}

export interface DataForSEOService {
  /** Search for keywords and return volume / competition data. */
  searchKeywords(
    keyword: string,
    location?: string
  ): Promise<KeywordSearchResult[]>;

  /** Fetch local business listings for a query + location. */
  searchLocalBusinesses(
    query: string,
    location: string
  ): Promise<LocalBusinessResult[]>;

  /** Fetch organic SERP results for a keyword. */
  getSerpResults(keyword: string, location?: string): Promise<SerpResult[]>;
}

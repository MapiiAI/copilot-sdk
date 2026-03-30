/**
 * Local Map / Google Business AI platform types.
 *
 * This layer represents the mapii.ai domain model for local map intelligence.
 * It sits above the raw DataForSEO API and adds AI-enriched context.
 */

export interface GeoLocation {
  latitude: number;
  longitude: number;
}

export interface BusinessProfile {
  placeId: string;
  name: string;
  address: string;
  location: GeoLocation;
  rating: number | null;
  reviewCount: number;
  categories: string[];
  phone: string | null;
  website: string | null;
}

export interface LocalSearchQuery {
  query: string;
  /** Human-readable location string, e.g. "New York, NY" */
  location: string;
  /** Optional radius in km */
  radiusKm?: number;
}

export interface LocalSearchResult {
  businesses: BusinessProfile[];
  totalFound: number;
  location: string;
  query: string;
}

export interface CompetitorInsight {
  business: BusinessProfile;
  /** Estimated local rank position (1-based) */
  rankPosition: number;
  /** AI-generated summary of strengths/weaknesses */
  aiSummary?: string;
}

export interface LocalMapService {
  /** Search for local businesses matching a query. */
  searchBusinesses(query: LocalSearchQuery): Promise<LocalSearchResult>;

  /** Get competitor insights for a given business category and location. */
  getCompetitorInsights(
    category: string,
    location: string,
    limit?: number
  ): Promise<CompetitorInsight[]>;

  /** Get a single business profile by place ID. */
  getBusinessProfile(placeId: string): Promise<BusinessProfile | null>;
}

/**
 * Local Map service implementation.
 *
 * This service provides the mapii.ai domain API for local map and Google
 * Business intelligence. It delegates data retrieval to the DataForSEO
 * service layer and enriches results with AI context.
 *
 * Usage:
 *   import { createLocalMapService } from "@/lib/services/local-map";
 *   import { getDataForSEOService } from "@/lib/services/dataforseo";
 *
 *   const localMap = createLocalMapService(getDataForSEOService());
 *   const results = await localMap.searchBusinesses({ query: "pizza", location: "New York, NY" });
 */

import type { DataForSEOService } from "../dataforseo/types";
import type {
  BusinessProfile,
  CompetitorInsight,
  LocalMapService,
  LocalSearchQuery,
  LocalSearchResult,
} from "./types";

export function createLocalMapService(
  dataForSEO: DataForSEOService
): LocalMapService {
  return {
    async searchBusinesses(query: LocalSearchQuery): Promise<LocalSearchResult> {
      const raw = await dataForSEO.searchLocalBusinesses(
        query.query,
        query.location
      );

      const businesses: BusinessProfile[] = raw.map((b) => ({
        placeId: b.placeId,
        name: b.title,
        address: b.address,
        location: { latitude: b.latitude, longitude: b.longitude },
        rating: b.rating,
        reviewCount: b.reviewCount,
        categories: b.categories,
        phone: b.phone,
        website: b.website,
      }));

      return {
        businesses,
        totalFound: businesses.length,
        location: query.location,
        query: query.query,
      };
    },

    async getCompetitorInsights(
      category: string,
      location: string,
      limit = 10
    ): Promise<CompetitorInsight[]> {
      const raw = await dataForSEO.searchLocalBusinesses(category, location);

      return raw.slice(0, limit).map((b, index) => ({
        business: {
          placeId: b.placeId,
          name: b.title,
          address: b.address,
          location: { latitude: b.latitude, longitude: b.longitude },
          rating: b.rating,
          reviewCount: b.reviewCount,
          categories: b.categories,
          phone: b.phone,
          website: b.website,
        },
        rankPosition: index + 1,
        // AI summaries can be generated here by calling streamText / generateText
        aiSummary: undefined,
      }));
    },

    async getBusinessProfile(placeId: string): Promise<BusinessProfile | null> {
      // DataForSEO does not have a direct "get by place ID" endpoint in all tiers.
      // This is a placeholder that can be replaced with a real lookup when available.
      void placeId;
      return null;
    },
  };
}

/**
 * DataForSEO service implementation.
 *
 * This module provides a clean abstraction over the DataForSEO REST API.
 * All actual HTTP calls to DataForSEO live here; the rest of the app imports
 * only from this module, making it easy to swap providers in the future.
 *
 * Usage:
 *   import { createDataForSEOService } from "@/lib/services/dataforseo";
 *   const seo = createDataForSEOService({ login: "...", password: "..." });
 *   const results = await seo.searchLocalBusinesses("pizza", "New York, NY");
 *
 * @see https://docs.dataforseo.com/
 */

import type {
  DataForSEOCredentials,
  DataForSEOService,
  KeywordSearchResult,
  LocalBusinessResult,
  SerpResult,
} from "./types";

const BASE_URL = "https://api.dataforseo.com/v3";

function makeBasicAuth(credentials: DataForSEOCredentials): string {
  return btoa(`${credentials.login}:${credentials.password}`);
}

async function post<T>(
  path: string,
  body: unknown,
  credentials: DataForSEOCredentials
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${makeBasicAuth(credentials)}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(
      `DataForSEO API error: ${res.status} ${res.statusText}`
    );
  }

  return res.json() as Promise<T>;
}

export function createDataForSEOService(
  credentials: DataForSEOCredentials
): DataForSEOService {
  return {
    async searchKeywords(keyword, location = "United States") {
      // POST /keywords_data/google_ads/search_volume/live
      const data = await post<{ tasks: Array<{ result: unknown[] }> }>(
        "/keywords_data/google_ads/search_volume/live",
        [{ keywords: [keyword], location_name: location }],
        credentials
      );

      const result = data?.tasks?.[0]?.result ?? [];

      return result.map((item: unknown) => {
        const r = item as Record<string, unknown>;
        return {
          keyword: String(r["keyword"] ?? keyword),
          searchVolume: Number(r["search_volume"] ?? 0),
          competition: Number(r["competition"] ?? 0),
          cpc: Number(r["cpc"] ?? 0),
        } satisfies KeywordSearchResult;
      });
    },

    async searchLocalBusinesses(query, location) {
      // POST /serp/google/maps/live/advanced
      const data = await post<{ tasks: Array<{ result: unknown[] }> }>(
        "/serp/google/maps/live/advanced",
        [{ keyword: query, location_name: location }],
        credentials
      );

      const result = data?.tasks?.[0]?.result ?? [];

      return result.map((item: unknown) => {
        const r = item as Record<string, unknown>;
        const geo = r["coordinate"] as Record<string, number> | undefined;
        return {
          placeId: String(r["place_id"] ?? ""),
          title: String(r["title"] ?? ""),
          address: String(r["address"] ?? ""),
          rating: r["rating"] != null ? Number(r["rating"]) : null,
          reviewCount: Number(r["reviews_count"] ?? 0),
          categories: Array.isArray(r["category"])
            ? (r["category"] as string[])
            : [],
          phone: r["phone"] ? String(r["phone"]) : null,
          website: r["url"] ? String(r["url"]) : null,
          latitude: geo?.["lat"] ?? 0,
          longitude: geo?.["lng"] ?? 0,
        } satisfies LocalBusinessResult;
      });
    },

    async getSerpResults(keyword, location = "United States") {
      // POST /serp/google/organic/live/advanced
      const data = await post<{ tasks: Array<{ result: unknown[] }> }>(
        "/serp/google/organic/live/advanced",
        [{ keyword, location_name: location }],
        credentials
      );

      const result = data?.tasks?.[0]?.result ?? [];

      return result.map((item: unknown, index: number) => {
        const r = item as Record<string, unknown>;
        return {
          position: Number(r["rank_absolute"] ?? index + 1),
          url: String(r["url"] ?? ""),
          title: String(r["title"] ?? ""),
          description: String(r["description"] ?? ""),
        } satisfies SerpResult;
      });
    },
  };
}

/**
 * Singleton factory that reads credentials from environment variables.
 * Call this only from server-side code (Route Handlers, Server Components).
 */
export function getDataForSEOService(): DataForSEOService {
  const login = process.env.DATAFORSEO_LOGIN;
  const password = process.env.DATAFORSEO_PASSWORD;

  if (!login || !password) {
    throw new Error(
      "DataForSEO credentials are not configured. " +
        "Set DATAFORSEO_LOGIN and DATAFORSEO_PASSWORD in your environment."
    );
  }

  return createDataForSEOService({ login, password });
}

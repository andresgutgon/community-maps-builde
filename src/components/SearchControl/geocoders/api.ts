import { LatLng, LatLngLiteral, LatLngBounds, Util } from 'leaflet'

/**
 * An object that represents a result from
 * a geocoding query
 */
export interface GeocodingResult {
  name: string;
  bbox: LatLngBounds;
  center: LatLng;
  icon?: string;
  html?: string;
  properties?: any;
}

export type GeocodingCallback = (result: GeocodingResult[]) => void;

export interface IGeocoder {
  geocode(query: string, cb: GeocodingCallback, context?: any): void;
  suggest?(query: string, cb: GeocodingCallback, context?: any): void;
  reverse?(location: LatLngLiteral, scale: number, cb: GeocodingCallback, context?: any): void;
}

export interface GeocoderOptions {
  serviceUrl: string;
  geocodingQueryParams?: Record<string, unknown>;
  reverseQueryParams?: Record<string, unknown>;
  apiKey?: string;
}

export function geocodingParams(
  options: GeocoderOptions,
  params: Record<string, unknown>
): Record<string, unknown> {
  return Util.extend(params, options.geocodingQueryParams);
}

export function reverseParams(
  options: GeocoderOptions,
  params: Record<string, unknown>
): Record<string, unknown> {
  return Util.extend(params, options.reverseQueryParams);
}

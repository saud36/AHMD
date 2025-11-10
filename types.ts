export type SearchType = 'contractors' | 'parking' | 'under_construction';

export interface SearchParams {
  area: string;
  searchType: SearchType;
  keywords?: string;
  radius?: number;
  useThinkingMode: boolean;
}

export interface SearchResult {
  name: string;
  address: string;
  phone: string | null;
  mapsLink: string;
  website: string | null;
  rating?: number | null;
}

export interface UserLocation {
  latitude: number;
  longitude: number;
}
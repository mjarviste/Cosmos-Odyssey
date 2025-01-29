export interface ProviderLeg {
  from: string;
  to: string;
  distance: number;
  companyId: string;
  company: {
    name: string;
  };
  price: number;
  flightStart: Date;
  flightEnd: Date;
  validUntil: Date;
}

export interface RouteOption {
  flights: ProviderLeg[]; // One provider per flight leg
  totalPrice: number; // Sum of all provider prices
  totalTravelTime: number; // Total travel time in minutes
}

export interface PriceListResponse {
  page: number;
  limit: number;
  totalRoutes: number;
  routes: RouteOption[];
}

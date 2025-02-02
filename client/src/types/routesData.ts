export interface ProviderLeg {
  apiId: string;
  from: string;
  to: string;
  distance: number;
  companyName: string;
  price: number;
  flightStart: Date;
  flightEnd: Date;
  validUntil: Date;
}

export interface RouteOption {
  flights: ProviderLeg[];
  totalPrice: number;
  totalTravelTime: number;
  validUntill: Date;
}

export interface PriceListResponse {
  page: number;
  limit: number;
  totalRoutes: number;
  routes: RouteOption[];
}

export interface Reservation {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  totalPrice: number;
  totalTravelTime: number;
  companyNames: string[];
  validUntil: Date;
  flights: ReservationProviderLeg[];
}

export interface ReservationProviderLeg {
  id: string;
  reservationId: string;
  providerLegId: string;
  providerLeg: ProviderLeg;
}

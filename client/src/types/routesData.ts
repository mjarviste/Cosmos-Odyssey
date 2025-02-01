export interface ProviderLeg {
  id: string;
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

export interface RouteOptionProviderLeg {
  id: string;
  routeOptionId: string;
  providerLegId: string;
  providerLeg: ProviderLeg;
}

export interface RouteOption {
  flights: RouteOptionProviderLeg[];
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
  validUntil: Date;
  firstName: string;
  lastName: string;
  fullName: string;
  totalPrice: number;
  totalTravelTime: number;
  companyNames: string[];
  flights: ReservationProviderLeg[];
}

export interface ReservationProviderLeg {
  id: string;
  reservationId: string;
  providerLegId: string;
  providerLeg: ProviderLeg;
}

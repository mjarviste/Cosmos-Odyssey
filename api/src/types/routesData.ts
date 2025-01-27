export interface Company {
  apiId: string;
  name: string;
}

export interface Provider {
  apiId: string;
  price: number;
  flightStart: Date;
  flightEnd: Date;
  company: Company;
}

export interface Planet {
  apiId: string;
  name: string;
}

export interface RouteInfo {
  apiId: string;
  distance: number;
  from: Planet;
  to: Planet;
}

export interface Leg {
  apiId: string;
  routeInfo: RouteInfo;
  providers: Provider[];
}

export interface RoutesData {
  apiId: string;
  validUntil: Date;
  legs: Leg[];
}

export interface RoutePath {
  path: string[];
  totalDistance: number;
}

export interface ProviderInfo {
  providerApiId: string;
  price: number;
  flightStart: Date;
  flightEnd: Date;
  companyName: string;
}

export interface Edge {
  to: string;
  distance: number;
  legApiId: string;
  providers: ProviderInfo[];
}

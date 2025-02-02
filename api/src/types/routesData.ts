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

export interface Leg {
  apiId: string;
  routeInfo: RouteInfo;
  providers: Provider[];
}
export interface RouteInfo {
  apiId: string;
  distance: number;
  from: Planet;
  to: Planet;
}

export interface RoutesData {
  apiId: string;
  validUntil: Date;
  legs: Leg[];
}

export interface RouteOption {
  flights: ProviderLeg[];
  totalPrice: number;
  totalDistance: number;
  totalTravelTime: number;
  validUntil: Date;
}

export interface ProviderInfo {
  providerApiId: string;
  price: number;
  flightStart: Date;
  flightEnd: Date;
  companyName: string;
}

export interface RawApiData {
  id: string;
  validUntil: Date;
  legs: [
    {
      id: string;
      routeInfo: {
        id: string;
        from: {
          id: string;
          name: string;
        };
        to: {
          id: string;
          name: string;
        };
        distance: number;
      };
      providers: [
        {
          id: string;
          company: {
            id: string;
            name: string;
          };
          price: number;
          flightStart: Date;
          flightEnd: Date;
        }
      ];
    }
  ];
}

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

export interface Edge {
  apiId: string;
  to: string;
  distance: number;
  companyName: string;
  price: number;
  flightStart: Date;
  flightEnd: Date;
  validUntil: Date;
}

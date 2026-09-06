export type Money = {
  amountInCents: number;
  currency: "USD";
};

export type RestaurantSummary = {
  id: string;
  name: string;
  cuisines: string[];
  rating: number;
  deliveryMinutes: number;
  deliveryFee: Money;
  isOpen: boolean;
};

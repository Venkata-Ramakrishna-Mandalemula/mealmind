export type Money = {
  amountInCents: number;
  currency: "USD";
};

export type RestaurantSummary = {
  id: string;
  name: string;
  cuisines: string[];
  rating: number | null;
  deliveryMinutes: number;
  deliveryFee: Money;
  isOpen: boolean;
  image: { src: string; alt: string } | null;
};

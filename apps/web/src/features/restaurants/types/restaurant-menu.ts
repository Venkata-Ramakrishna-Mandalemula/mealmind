import type { Money } from "./restaurant-summary";

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: Money;
};

export type MenuCategory = {
  id: string;
  name: string;
  items: readonly MenuItem[];
};

export type RestaurantMenu = {
  restaurantId: string;
  categories: readonly MenuCategory[];
};

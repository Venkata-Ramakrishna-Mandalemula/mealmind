import { demoMenus } from "./demo-menus";
import { demoRestaurants } from "./demo-restaurants";

export function getDemoRestaurant(restaurantId: string) {
  const restaurant = demoRestaurants.find((item) => item.id === restaurantId);
  if (!restaurant) return null;

  const menu = demoMenus.find((item) => item.restaurantId === restaurantId);
  // A missing fixture is a data error; an intentionally empty menu has categories: [].
  if (!menu) throw new Error(`Missing demo menu for restaurant ${restaurantId}`);

  return { restaurant, menu };
}

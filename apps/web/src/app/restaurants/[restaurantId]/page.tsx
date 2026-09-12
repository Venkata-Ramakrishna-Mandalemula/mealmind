import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RestaurantMenu } from "@/features/restaurants/components/restaurant-menu";
import { demoRestaurants } from "@/features/restaurants/data/demo-restaurants";
import { getDemoRestaurant } from "@/features/restaurants/data/get-demo-restaurant";

type RestaurantPageProps = { params: Promise<{ restaurantId: string }> };

export function generateStaticParams() {
  return demoRestaurants.map(({ id }) => ({ restaurantId: id }));
}

export async function generateMetadata({ params }: RestaurantPageProps): Promise<Metadata> {
  const { restaurantId } = await params;
  const data = getDemoRestaurant(restaurantId);
  if (!data) notFound();
  return {
    title: `${data.restaurant.name} menu | MealMind`,
    description: `Explore the sample menu for ${data.restaurant.name} on MealMind.`,
  };
}

export default async function RestaurantPage({ params }: RestaurantPageProps) {
  const { restaurantId } = await params;
  const data = getDemoRestaurant(restaurantId);
  if (!data) notFound();
  return <RestaurantMenu restaurant={data.restaurant} menu={data.menu} />;
}

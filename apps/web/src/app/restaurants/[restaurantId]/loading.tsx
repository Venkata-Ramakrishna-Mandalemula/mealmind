import { RouteMessage } from "@/components/ui/route-message";

export default function RestaurantLoading() {
  return <RouteMessage title="Opening the menu"><p role="status">Loading restaurant menu…</p></RouteMessage>;
}

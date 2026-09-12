"use client";

import { Button } from "@/components/ui/button";
import { RouteMessage } from "@/components/ui/route-message";

export default function RestaurantError({ retry }: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return (
    <RouteMessage title="We couldn't load this menu">
      <p>Something went wrong while opening this restaurant. Please try again.</p>
      <Button onClick={() => retry()}>Try again</Button>
    </RouteMessage>
  );
}

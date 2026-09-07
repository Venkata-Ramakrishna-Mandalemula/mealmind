import type { RestaurantSummary } from "../types/restaurant-summary";

// Fictional fixtures for the UI prototype, never live availability or prices.
export const demoRestaurants: readonly RestaurantSummary[] = [
  {
    id: "spice-route",
    name: "Spice Route",
    cuisines: ["Indian", "North Indian"],
    rating: 4.7,
    deliveryMinutes: 30,
    deliveryFee: { amountInCents: 249, currency: "USD" },
    isOpen: true,
    image: {
      src: "/images/food/indian-table.jpg",
      alt: "A plate of curry with flatbread",
    },
  },
  {
    id: "bowl-theory",
    name: "Bowl Theory",
    cuisines: ["Japanese", "Sushi"],
    rating: 4.6,
    deliveryMinutes: 25,
    deliveryFee: { amountInCents: 199, currency: "USD" },
    isOpen: true,
    image: { src: "/images/food/sushi.jpg", alt: "A selection of sushi rolls" },
  },
  {
    id: "pizza-corner",
    name: "Pizza Corner",
    cuisines: ["Italian", "Pizza"],
    rating: 4.5,
    deliveryMinutes: 35,
    deliveryFee: { amountInCents: 249, currency: "USD" },
    isOpen: true,
    image: {
      src: "/images/food/pizza.jpg",
      alt: "Freshly baked pizza with colorful toppings",
    },
  },
  {
    id: "green-table",
    name: "Green Table",
    cuisines: ["Mediterranean", "Salads"],
    rating: 4.8,
    deliveryMinutes: 20,
    deliveryFee: { amountInCents: 199, currency: "USD" },
    isOpen: true,
    image: {
      src: "/images/food/salad.jpg",
      alt: "A colorful bowl of fresh vegetables",
    },
  },
  {
    id: "taco-house",
    name: "Taco House",
    cuisines: ["Mexican", "Tacos"],
    rating: 4.6,
    deliveryMinutes: 30,
    deliveryFee: { amountInCents: 149, currency: "USD" },
    isOpen: true,
    image: {
      src: "/images/food/tacos.jpg",
      alt: "Tacos served with fresh garnishes",
    },
  },
  {
    id: "morning-crumb",
    name: "Morning Crumb",
    cuisines: ["Bakery", "Breakfast"],
    rating: null,
    deliveryMinutes: 25,
    deliveryFee: { amountInCents: 0, currency: "USD" },
    isOpen: false,
    image: null,
  },
];

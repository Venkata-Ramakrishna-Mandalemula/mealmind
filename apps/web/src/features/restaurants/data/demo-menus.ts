import type { RestaurantMenu } from "../types/restaurant-menu";

// Authored prototype fixtures, not live restaurant offerings or pricing quotes.
export const demoMenus: readonly RestaurantMenu[] = [
  {
    restaurantId: "spice-route",
    categories: [
      { id: "popular", name: "Popular", items: [
        { id: "paneer-tikka-bowl", name: "Paneer Tikka Bowl", description: "Charred paneer, basmati rice, roasted vegetables and tikka sauce.", price: { amountInCents: 1499, currency: "USD" } },
        { id: "chana-masala", name: "Chana Masala", description: "Chickpeas simmered in a spiced onion and tomato gravy.", price: { amountInCents: 1249, currency: "USD" } },
      ] },
      { id: "breads", name: "Breads", items: [
        { id: "garlic-naan", name: "Garlic Naan", description: "Soft flatbread finished with garlic and herbs.", price: { amountInCents: 349, currency: "USD" } },
      ] },
    ],
  },
  {
    restaurantId: "bowl-theory",
    categories: [
      { id: "rolls", name: "Rolls", items: [
        { id: "avocado-roll", name: "Avocado Roll", description: "Avocado, cucumber and seasoned rice wrapped in nori.", price: { amountInCents: 899, currency: "USD" } },
        { id: "salmon-roll", name: "Salmon Roll", description: "Salmon and cucumber with rice and a sesame finish.", price: { amountInCents: 1299, currency: "USD" } },
      ] },
      { id: "sides", name: "Sides", items: [
        { id: "edamame", name: "Edamame", description: "Steamed soybeans with a light sprinkle of sea salt.", price: { amountInCents: 499, currency: "USD" } },
      ] },
    ],
  },
  {
    restaurantId: "pizza-corner",
    categories: [
      { id: "pizzas", name: "Pizzas", items: [
        { id: "margherita", name: "Margherita Pizza", description: "Tomato sauce, mozzarella and fresh basil on a crisp crust.", price: { amountInCents: 1499, currency: "USD" } },
        { id: "roasted-vegetable", name: "Roasted Vegetable Pizza", description: "Peppers, mushrooms and red onion with mozzarella.", price: { amountInCents: 1699, currency: "USD" } },
      ] },
      { id: "sides", name: "Sides", items: [
        { id: "garlic-bread", name: "Garlic Bread", description: "Toasted bread with garlic butter and parsley.", price: { amountInCents: 499, currency: "USD" } },
      ] },
    ],
  },
  {
    restaurantId: "green-table",
    categories: [
      { id: "bowls", name: "Bowls", items: [
        { id: "mediterranean-bowl", name: "Mediterranean Bowl", description: "Couscous, cucumber, tomatoes, olives and a lemon dressing.", price: { amountInCents: 1349, currency: "USD" } },
        { id: "roasted-chickpea-salad", name: "Roasted Chickpea Salad", description: "Mixed greens, roasted chickpeas and crunchy seasonal vegetables.", price: { amountInCents: 1199, currency: "USD" } },
      ] },
      { id: "sides", name: "Sides", items: [
        { id: "hummus-pita", name: "Hummus and Pita", description: "Creamy chickpea hummus with soft pita wedges.", price: { amountInCents: 549, currency: "USD" } },
      ] },
    ],
  },
  {
    restaurantId: "taco-house",
    categories: [
      { id: "tacos", name: "Tacos", items: [
        { id: "black-bean-tacos", name: "Black Bean Tacos", description: "Three corn tortillas with black beans, cabbage and tomato salsa.", price: { amountInCents: 1099, currency: "USD" } },
        { id: "chicken-tacos", name: "Chicken Tacos", description: "Three chicken tacos with onion, cilantro and lime.", price: { amountInCents: 1299, currency: "USD" } },
      ] },
      { id: "sides", name: "Sides", items: [
        { id: "chips-guacamole", name: "Chips and Guacamole", description: "Corn chips served with avocado, lime and tomato guacamole.", price: { amountInCents: 599, currency: "USD" } },
      ] },
    ],
  },
  { restaurantId: "morning-crumb", categories: [] },
];

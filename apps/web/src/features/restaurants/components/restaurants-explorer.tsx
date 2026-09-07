"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import type { RestaurantSummary } from "../types/restaurant-summary";
import { CuisineFilters } from "./cuisine-filters";
import { RestaurantCard } from "./restaurant-card";
import styles from "./restaurants-explorer.module.css";

export function RestaurantsExplorer({
  restaurants,
}: {
  restaurants: readonly RestaurantSummary[];
}) {
  const [query, setQuery] = useState("");
  const [selectedCuisine, setSelectedCuisine] = useState<string | null>(null);
  const [openOnly, setOpenOnly] = useState(false);
  const [savedOnly, setSavedOnly] = useState(false);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const resultsHeadingRef = useRef<HTMLHeadingElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  // Keeping saved IDs here preserves selection when a filtered card unmounts.
  function toggleSave(id: string) {
    // Removing a saved-only card also removes its focused button.
    if (savedOnly && savedIds.includes(id)) resultsHeadingRef.current?.focus();
    setSavedIds((previous) =>
      previous.includes(id)
        ? previous.filter((savedId) => savedId !== id)
        : [...previous, id],
    );
  }

  const cuisines = [
    ...new Set(
      restaurants
        .map((restaurant) => restaurant.cuisines[0])
        .filter((cuisine): cuisine is string => Boolean(cuisine)),
    ),
  ];
  const normalizedQuery = query.trim().toLowerCase();
  const visibleRestaurants = restaurants.filter((restaurant) => {
    const matchesQuery = [restaurant.name, ...restaurant.cuisines].some(
      (value) => value.toLowerCase().includes(normalizedQuery),
    );
    return (
      matchesQuery &&
      (selectedCuisine === null ||
        restaurant.cuisines.includes(selectedCuisine)) &&
      (!openOnly || restaurant.isOpen) &&
      (!savedOnly || savedIds.includes(restaurant.id))
    );
  });

  const hasFilters =
    query !== "" || selectedCuisine !== null || openOnly || savedOnly;
  function clearFilters() {
    setQuery("");
    setSelectedCuisine(null);
    setOpenOnly(false);
    setSavedOnly(false);
    searchRef.current?.focus();
  }

  return (
    <section
      id="discover"
      aria-labelledby="discovery-heading"
      className={styles.explorer}
    >
      <div className={styles.searchArea}>
        <label htmlFor="restaurant-search" className={styles.searchLabel}>
          Find your next favorite
        </label>
        <div className={styles.searchField}>
          <Icon name="search" />
          <input
            ref={searchRef}
            id="restaurant-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search restaurants or cuisines, e.g. Indian"
            aria-describedby="search-help"
          />
          <span className={styles.searchHint}>Explore a little</span>
        </div>
        <p id="search-help" className={styles.help}>
          Search this sample collection by name or cuisine. Favorites stay until
          you refresh.
        </p>
      </div>

      <div className={styles.cuisineHeading}>
        <h2 id="discovery-heading">What are you in the mood for?</h2>
        <span>Start with a cuisine</span>
      </div>
      <CuisineFilters
        cuisines={cuisines}
        selectedCuisine={selectedCuisine}
        onSelect={setSelectedCuisine}
      />

      <div className={styles.resultsHeading}>
        <div>
          <p className={styles.eyebrow}>A little inspiration</p>
          <h2 ref={resultsHeadingRef} tabIndex={-1}>
            {savedOnly ? "Your saved picks" : "Good food to explore"}
          </h2>
        </div>
        <div className={styles.toggles}>
          <label>
            <input
              type="checkbox"
              checked={openOnly}
              onChange={(event) => setOpenOnly(event.target.checked)}
            />
            Open now
          </label>
          <label>
            <input
              type="checkbox"
              checked={savedOnly}
              onChange={(event) => setSavedOnly(event.target.checked)}
            />
            Saved only <span className={styles.count}>{savedIds.length}</span>
          </label>
        </div>
      </div>

      <div className={styles.resultMeta}>
        <p role="status" aria-live="polite" aria-atomic="true">
          {visibleRestaurants.length}{" "}
          {visibleRestaurants.length === 1 ? "restaurant" : "restaurants"}{" "}
          {savedOnly ? "in your saved picks" : "to discover"}
        </p>
        <button
          type="button"
          className={styles.clear}
          disabled={!hasFilters}
          onClick={clearFilters}
        >
          Clear filters
        </button>
      </div>

      {visibleRestaurants.length > 0 ? (
        <ul className={styles.grid} aria-label="Restaurants">
          {visibleRestaurants.map((restaurant) => (
            <li key={restaurant.id}>
              <RestaurantCard
                restaurant={restaurant}
                isSaved={savedIds.includes(restaurant.id)}
                onToggleSave={toggleSave}
              />
            </li>
          ))}
        </ul>
      ) : (
        <div className={styles.empty}>
          <Icon name={savedOnly ? "heart" : "search"} />
          <h3>
            {savedOnly && savedIds.length === 0
              ? "Your next favorite is out there"
              : "Nothing here just yet"}
          </h3>
          <p>
            {savedOnly && savedIds.length === 0
              ? "Save a restaurant using its heart button, then find it here."
              : "Try another name or cuisine, or clear your filters to see the whole collection."}
          </p>
          <Button variant="secondary" onClick={clearFilters}>
            Explore all restaurants <Icon name="arrow" />
          </Button>
        </div>
      )}
      <noscript>
        <p>
          Enable JavaScript to search, filter, or save restaurants. You can
          still browse the sample cards.
        </p>
      </noscript>
    </section>
  );
}

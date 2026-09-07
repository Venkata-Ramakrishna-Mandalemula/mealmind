import styles from "./restaurants-explorer.module.css";

type CuisineFiltersProps = {
  cuisines: readonly string[];
  selectedCuisine: string | null;
  onSelect: (cuisine: string | null) => void;
};

export function CuisineFilters({
  cuisines,
  selectedCuisine,
  onSelect,
}: CuisineFiltersProps) {
  return (
    <div
      className={styles.cuisines}
      role="group"
      aria-label="Filter by cuisine"
    >
      <button
        type="button"
        aria-pressed={selectedCuisine === null}
        onClick={() => onSelect(null)}
      >
        All cuisines
      </button>
      {cuisines.map((cuisine) => (
        <button
          key={cuisine}
          type="button"
          aria-pressed={selectedCuisine === cuisine}
          onClick={() => onSelect(cuisine)}
        >
          {cuisine}
        </button>
      ))}
    </div>
  );
}

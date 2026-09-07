import Image from "next/image";
import { Icon } from "@/components/ui/icon";
import type { RestaurantSummary } from "../types/restaurant-summary";
import styles from "./restaurant-card.module.css";

type RestaurantCardProps = {
  restaurant: RestaurantSummary;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
};

export function RestaurantCard({
  restaurant,
  isSaved,
  onToggleSave,
}: RestaurantCardProps) {
  const fee = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: restaurant.deliveryFee.currency,
  }).format(restaurant.deliveryFee.amountInCents / 100);

  return (
    <article
      className={styles.card}
      aria-labelledby={`restaurant-${restaurant.id}`}
    >
      <div className={styles.photo}>
        {restaurant.image ? (
          <Image
            src={restaurant.image.src}
            alt={restaurant.image.alt}
            fill
            sizes="(max-width: 599px) calc(100vw - 40px), (max-width: 999px) 46vw, (max-width: 1279px) 30vw, 284px"
          />
        ) : (
          <div className={styles.placeholder}>
            <Icon name="bowl" />
            <span>Something good is baking</span>
          </div>
        )}
        {!restaurant.isOpen && (
          <span className={styles.closed}>Currently closed</span>
        )}
        <button
          type="button"
          className={styles.save}
          aria-label={`Save ${restaurant.name}`}
          aria-pressed={isSaved}
          onClick={() => onToggleSave(restaurant.id)}
        >
          <Icon name="heart" />
        </button>
      </div>
      <div className={styles.details}>
        <div className={styles.heading}>
          <h3 id={`restaurant-${restaurant.id}`}>{restaurant.name}</h3>
          {restaurant.rating !== null ? (
            <span className={styles.rating}>
              <Icon name="star" />
              {restaurant.rating.toFixed(1)}
              <span className="sr-only"> out of 5 stars</span>
            </span>
          ) : (
            <span className={styles.new}>New</span>
          )}
        </div>
        <p className={styles.cuisines}>{restaurant.cuisines.join(" · ")}</p>
        <div className={styles.delivery}>
          <span>
            <Icon name="clock" />
            {restaurant.isOpen
              ? `About ${restaurant.deliveryMinutes} min`
              : "Not taking orders"}
          </span>
          <span>
            {restaurant.deliveryFee.amountInCents === 0
              ? "No delivery fee"
              : `${fee} delivery`}
          </span>
        </div>
      </div>
    </article>
  );
}

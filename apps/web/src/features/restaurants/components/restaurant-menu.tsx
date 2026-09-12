import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import type { RestaurantSummary } from "../types/restaurant-summary";
import type { RestaurantMenu as Menu } from "../types/restaurant-menu";
import styles from "./restaurant-menu.module.css";

export function RestaurantMenu({ restaurant, menu }: {
  restaurant: RestaurantSummary;
  menu: Menu;
}) {
  const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
  const categories = menu.categories.filter((category) => category.items.length > 0);

  return (
    <main id="main-content" tabIndex={-1} className={styles.main}>
      <Link className={styles.back} href="/#discover">← All restaurants</Link>
      <div className={styles.hero}>
        {restaurant.image ? (
          <Image src={restaurant.image.src} alt={restaurant.image.alt} fill
            sizes="(max-width: 1100px) 100vw, 1100px" loading="eager" fetchPriority="high" />
        ) : <div className={styles.placeholder}><Icon name="bowl" /><span>A fresh start to your day</span></div>}
      </div>
      <div className={styles.overview}>
        <div>
          <p className={styles.eyebrow}>{restaurant.cuisines.join(" · ")}</p>
          <h1>{restaurant.name}</h1>
          <div className={styles.facts}>
            <span>{restaurant.rating === null ? "New restaurant" : `★ ${restaurant.rating.toFixed(1)} out of 5`}</span>
            <span>{restaurant.isOpen ? `About ${restaurant.deliveryMinutes} min` : "Currently closed"}</span>
            <span>{restaurant.deliveryFee.amountInCents === 0 ? "No delivery fee" : `${money.format(restaurant.deliveryFee.amountInCents / 100)} delivery`}</span>
          </div>
        </div>
        <span className={styles.badge}>Sample menu</span>
      </div>
      <p className={styles.notice}>Explore illustrative dishes and prices. Ordering is not available in this preview.</p>
      {!restaurant.isOpen && <p className={styles.closed}>This restaurant is currently closed. You can still browse any published menu.</p>}
      {categories.length > 0 ? (
        <div className={styles.menuLayout}>
          <nav className={styles.categories} aria-label="Menu categories">
            <p>On the menu</p>
            {categories.map((category) => <a key={category.id} href={`#menu-${category.id}`}>{category.name}</a>)}
          </nav>
          <div>
            {categories.map((category) => (
              <section key={category.id} className={styles.category} aria-labelledby={`menu-${category.id}`}>
                <h2 id={`menu-${category.id}`} tabIndex={-1}>{category.name}</h2>
                <ul className={styles.items}>
                  {category.items.map((item) => (
                    <li key={item.id} className={styles.item}>
                      <div><h3>{item.name}</h3><p>{item.description}</p></div>
                      <span className={styles.price}>{money.format(item.price.amountInCents / 100)}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </div>
      ) : (
        <section className={styles.empty}>
          <Icon name="bowl" />
          <h2>The menu is still in the oven</h2>
          <p>No dishes have been published for this restaurant yet.</p>
          <Link href="/#discover">Explore other restaurants</Link>
        </section>
      )}
      <p className={styles.footnote}>Photos are illustrative. Listed item prices exclude delivery, service fees and taxes.</p>
    </main>
  );
}

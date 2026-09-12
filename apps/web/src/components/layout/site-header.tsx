import Link from "next/link";
import styles from "./site-header.module.css";

export function SiteHeader() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link className={styles.wordmark} href="/" aria-label="MealMind home">
          Meal<span>Mind</span>
        </Link>
        <span className={styles.tagline}>
          Good food. A little less thought.
        </span>
        <nav aria-label="Main navigation">
          <Link className={styles.explore} href="/#discover">
            Explore restaurants <span aria-hidden="true">↗</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}

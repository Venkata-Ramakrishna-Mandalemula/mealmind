import Image from "next/image";
import { SiteHeader } from "@/components/layout/site-header";
import { Icon } from "@/components/ui/icon";
import { RestaurantsExplorer } from "@/features/restaurants/components/restaurants-explorer";
import { demoRestaurants } from "@/features/restaurants/data/demo-restaurants";
import styles from "./page.module.css";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="main-content" tabIndex={-1} className={styles.main}>
        <section className={styles.hero} aria-labelledby="home-heading">
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>
              <span /> A little inspiration for your appetite
            </p>
            <h1 id="home-heading">
              What sounds
              <br />
              good <span>right now?</span>
            </h1>
            <p className={styles.intro}>
              A little comfort. A new favorite.
              <br />
              Find something that hits the spot.
            </p>
          </div>
          <div className={styles.heroPhoto}>
            <Image
              src="/images/food/discovery-bowl.jpg"
              alt="A colorful bowl topped with vegetables and golden cubes"
              fill
              sizes="(max-width: 599px) 100vw, 560px"
              loading="eager"
              fetchPriority="high"
            />
            <span className={styles.photoNote}>
              <Icon name="bowl" /> Good food, good mood.
            </span>
          </div>
        </section>
        <div className={styles.demoNotice}>
          <span className={styles.demoBadge}>Demo collection</span>
          <p>
            Sample restaurants, ratings, fees and delivery estimates. Orders
            aren’t available yet.
          </p>
        </div>
        <RestaurantsExplorer restaurants={demoRestaurants} />
        <aside
          className={styles.closingNote}
          aria-label="About this collection"
        >
          <Icon name="heart" />
          <div>
            <h2>A few favorites. A little less indecision.</h2>
            <p>
              Tap a heart to keep a shortlist while you explore. Your picks are
              just for this visit.
            </p>
          </div>
          <a href="#discover">
            Back to the collection <Icon name="arrow" />
          </a>
        </aside>
      </main>
      <footer className={styles.footer}>
        <p>
          MealMind <span>·</span> Made for the way you feel.
        </p>
        <p>Early preview · Stock food photography</p>
      </footer>
    </>
  );
}

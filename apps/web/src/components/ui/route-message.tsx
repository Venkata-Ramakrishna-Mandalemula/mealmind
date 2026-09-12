import type { ReactNode } from "react";
import Link from "next/link";
import styles from "./route-message.module.css";

export function RouteMessage({ title, children }: { title: string; children: ReactNode }) {
  return (
    <main id="main-content" tabIndex={-1} className={styles.main}>
      <h1>{title}</h1>
      <div className={styles.content}>{children}</div>
      <Link className={styles.back} href="/#discover">Explore restaurants</Link>
    </main>
  );
}

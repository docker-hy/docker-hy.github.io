import React from "react";
import styles from "./styles.module.css";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";

export default function HomePageFeatures() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={styles.banner}>
      <div className={styles.container}>
        <h1 className={styles.title}>{siteConfig.title}</h1>
        <p className={styles.subtitle}>{siteConfig.tagline}</p>
      </div>
    </header>
  );
}

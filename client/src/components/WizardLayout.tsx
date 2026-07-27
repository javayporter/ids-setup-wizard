import { type ReactNode, useId } from "react";

import styles from "./WizardLayout.module.css";

interface WizardLayoutProps {
  stepLabel: string;
  title: string;
  description?: ReactNode;
  maxWidth?: string;
  children: ReactNode;
}

export default function WizardLayout({
  stepLabel,
  title,
  description,
  maxWidth = "620px",
  children,
}: WizardLayoutProps) {
  const titleId = useId();

  return (
    <main className={styles.page}>
      <section
        aria-labelledby={titleId}
        className={styles.card}
        style={{ maxWidth }}
      >
        <header className={styles.header}>
          <p className={styles.stepLabel}>{stepLabel}</p>

          <h1 id={titleId} className={styles.heading}>
            {title}
          </h1>

          {description && <p className={styles.description}>{description}</p>}
        </header>

        {children}
      </section>
    </main>
  );
}

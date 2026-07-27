import { type ReactNode, useId } from "react";

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
    <main style={styles.page}>
      <section
        aria-labelledby={titleId}
        style={{
          ...styles.card,
          maxWidth,
        }}
      >
        <header style={styles.header}>
          <p style={styles.stepLabel}>{stepLabel}</p>

          <h1 id={titleId} style={styles.heading}>
            {title}
          </h1>

          {description && <p style={styles.description}>{description}</p>}
        </header>

        {children}
      </section>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    display: "grid",
    placeItems: "center",
    padding: "24px",
    backgroundColor: "#f5f7fa",
    fontFamily: "Arial, sans-serif",
  },
  card: {
    width: "100%",
    padding: "32px",
    borderRadius: "12px",
    backgroundColor: "#ffffff",
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)",
  },
  header: {
    marginBottom: "28px",
  },
  stepLabel: {
    margin: "0 0 8px",
    fontSize: "14px",
    fontWeight: 600,
  },
  heading: {
    margin: "0 0 12px",
    fontSize: "30px",
  },
  description: {
    margin: 0,
    lineHeight: 1.5,
  },
};

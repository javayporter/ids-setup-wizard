import { PrimaryButton, SecondaryButton } from "../components/Button";
import WizardLayout from "../components/WizardLayout";

import type { IdsLocation } from "../../../shared/types/api.types";

interface DealerLocationsPageProps {
  dealershipName: string;
  mainLocation: IdsLocation;
  locations: IdsLocation[];
  onBack: () => void;
  onContinue: () => void;
}

export default function DealerLocationsPage({
  dealershipName,
  mainLocation,
  locations,
  onBack,
  onContinue,
}: DealerLocationsPageProps) {
  return (
    <WizardLayout
      stepLabel="Step 2"
      title="Confirm Dealer Locations"
      description={
        <>
          IDS returned the following location information for{" "}
          <strong>{dealershipName}</strong>.
        </>
      }
      maxWidth="620px"
    >
      <section style={styles.mainLocationCard}>
        <h2 style={styles.mainLocationHeading}>Main location</h2>

        <p>
          <strong>Name:</strong> {mainLocation.Name}
        </p>

        <p>
          <strong>Location code:</strong> {mainLocation.Location}
        </p>
      </section>

      <h2 style={styles.allLocationsHeading}>All locations</h2>

      <ul>
        {locations.map((location) => (
          <li key={location.Location}>
            {location.Name} ({location.Location})
          </li>
        ))}
      </ul>

      <div style={styles.buttonRow}>
        <SecondaryButton type="button" onClick={onBack}>
          Back
        </SecondaryButton>

        <PrimaryButton type="button" onClick={onContinue}>
          Continue
        </PrimaryButton>
      </div>
    </WizardLayout>
  );
}

const styles: Record<string, React.CSSProperties> = {
  mainLocationCard: {
    padding: "16px",
    border: "1px solid #cbd5e1",
    borderRadius: "8px",
  },
  mainLocationHeading: {
    marginTop: 0,
    fontSize: "18px",
  },
  allLocationsHeading: {
    marginTop: "28px",
    fontSize: "20px",
  },
  buttonRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: "16px",
    marginTop: "24px",
  },
};

import type { IdsLocation } from "../../../shared/types/api.types";
import { PrimaryButton, SecondaryButton } from "../components/Button";
import WizardLayout from "../components/WizardLayout";

import styles from "./DealerLocationsPage.module.css";

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
      <section className={styles.mainLocationCard}>
        <h2 className={styles.mainLocationHeading}>Main location</h2>

        <p>
          <strong>Name:</strong> {mainLocation.Name}
        </p>

        <p>
          <strong>Location code:</strong> {mainLocation.Location}
        </p>
      </section>

      <h2 className={styles.allLocationsHeading}>All locations</h2>

      <ul>
        {locations.map((location) => (
          <li key={location.Location}>
            {location.Name} ({location.Location})
          </li>
        ))}
      </ul>

      <div className={styles.buttonRow}>
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

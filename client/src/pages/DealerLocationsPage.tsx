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
      <section
        style={{
          padding: "16px",
          border: "1px solid #cbd5e1",
          borderRadius: "8px",
        }}
      >
        <h2 style={{ marginTop: 0, fontSize: "18px" }}>Main location</h2>

        <p>
          <strong>Name:</strong> {mainLocation.Name}
        </p>

        <p>
          <strong>Location code:</strong> {mainLocation.Location}
        </p>
      </section>

      <h2 style={{ marginTop: "28px", fontSize: "20px" }}>All locations</h2>

      <ul>
        {locations.map((location) => (
          <li key={location.Location}>
            {location.Name} ({location.Location})
          </li>
        ))}
      </ul>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "16px",
          marginTop: "24px",
        }}
      >
        <button
          type="button"
          onClick={onBack}
          style={{
            padding: "12px 18px",
            border: "1px solid #64748b",
            borderRadius: "8px",
            backgroundColor: "#ffffff",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Back
        </button>

        <button
          type="button"
          onClick={onContinue}
          style={{
            padding: "12px 18px",
            border: "none",
            borderRadius: "8px",
            backgroundColor: "#2563eb",
            color: "#ffffff",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Continue
        </button>
      </div>
    </WizardLayout>
  );
}

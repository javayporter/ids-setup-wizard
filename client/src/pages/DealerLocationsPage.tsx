import type { IdsLocation } from "../../../shared/types/api.types";

interface DealerLocationsPageProps {
  dealershipName: string;
  mainLocation: IdsLocation;
  locations: IdsLocation[];
  onBack: () => void;
}

export default function DealerLocationsPage({
  dealershipName,
  mainLocation,
  locations,
  onBack,
}: DealerLocationsPageProps) {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "24px",
        backgroundColor: "#f5f7fa",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <section
        style={{
          width: "100%",
          maxWidth: "620px",
          padding: "32px",
          borderRadius: "12px",
          backgroundColor: "#ffffff",
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)",
        }}
      >
        <p style={{ margin: "0 0 8px", fontWeight: 600 }}>Step 2</p>

        <h1 style={{ margin: "0 0 12px" }}>Confirm Dealer Locations</h1>

        <p style={{ lineHeight: 1.5 }}>
          IDS returned the following location information for{" "}
          <strong>{dealershipName}</strong>.
        </p>

        <section
          style={{
            marginTop: "24px",
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

        <button
          type="button"
          onClick={onBack}
          style={{
            marginTop: "24px",
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
      </section>
    </main>
  );
}

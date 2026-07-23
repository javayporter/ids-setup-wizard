import { useEffect, useState } from "react";

import DealerInformationPage from "./pages/DealerInformationPage";
import { getHealthCheck } from "./services/api";

import type { StartSetupResult } from "../../shared/types/api.types";

type ApiStatus = "checking" | "connected" | "disconnected";

function App() {
  // Stores the current frontend-to-backend connection state.
  const [apiStatus, setApiStatus] = useState<ApiStatus>("checking");

  // Stores the safe setup data returned after the first wizard step.
  // When this value exists, we know the setup session was created.
  const [setupResult, setSetupResult] = useState<StartSetupResult | null>(null);

  // Check the backend connection once when the application loads.
  useEffect(() => {
    async function checkApiConnection() {
      try {
        await getHealthCheck();
        setApiStatus("connected");
      } catch {
        setApiStatus("disconnected");
      }
    }

    checkApiConnection();
  }, []);

  // Temporary next-screen placeholder.
  // Later this will become the real Dealer Locations page.
  if (setupResult) {
    return (
      <main>
        <h1>Locations retrieved</h1>

        <p>Dealership: {setupResult.dealershipName}</p>
        <p>Main location: {setupResult.mainLocation.Name}</p>
        <p>Location code: {setupResult.mainLocation.Location}</p>
        <p>Total locations: {setupResult.locations.length}</p>
      </main>
    );
  }

  return (
    <>
      {/* 
        Show connection information only during development.
        Vite replaces import.meta.env.DEV with true during local development
        and false in a production build.
      */}
      {import.meta.env.DEV && (
        <div
          style={{
            padding: "8px 16px",
            fontFamily: "Arial, sans-serif",
            fontSize: "14px",
            backgroundColor:
              apiStatus === "connected"
                ? "#dcfce7"
                : apiStatus === "disconnected"
                  ? "#fee2e2"
                  : "#fef3c7",
          }}
        >
          {apiStatus === "checking" && "Checking API connection..."}

          {apiStatus === "connected" && "Backend API connected"}

          {apiStatus === "disconnected" &&
            "Unable to connect to the backend API"}
        </div>
      )}

      <DealerInformationPage onSetupStarted={setSetupResult} />
    </>
  );
}

export default App;

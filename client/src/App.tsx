import { useEffect, useState } from "react";

import SetupWizard from "./features/setup/SetupWizard";
import { getHealthCheck } from "./services/api";

type ApiStatus = "checking" | "connected" | "disconnected";

function App() {
  const [apiStatus, setApiStatus] = useState<ApiStatus>("checking");

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

  return (
    <>
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

      <SetupWizard />
    </>
  );
}

export default App;

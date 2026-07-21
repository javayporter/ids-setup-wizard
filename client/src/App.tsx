import { useEffect, useState } from "react";
import { getHealthCheck } from "./services/api";

function App() {
  // React state used to display the current API connection status.
  // The initial value is shown immediately when the component first renders.
  const [message, setMessage] = useState("Checking API connection...");

  // useEffect runs once after the component is first rendered.
  // Its job is to verify that the frontend can successfully communicate
  // with our backend API.
  useEffect(() => {
    // Async function that calls our backend health endpoint.
    async function checkApi() {
      try {
        // Calls getHealthCheck() in api.ts.
        //
        // Data Flow:
        // React
        //   ↓
        // getHealthCheck()
        //   ↓
        // GET http://localhost:3000/api/health
        //   ↓
        // Express Backend
        //   ↓
        // health.routes.ts
        //   ↓
        // JSON Response
        //   ↓
        // Back to React
        const response = await getHealthCheck();

        // Update React state with the message returned by the backend.
        // Calling setMessage() tells React that the state has changed,
        // causing the component to automatically render again with the
        // new message.
        setMessage(response.message);
      } catch {
        // If anything fails (backend isn't running, network issue, etc.),
        // display a user-friendly message instead.
        setMessage("Unable to connect to the backend.");
      }
    }

    // Execute the API call.
    checkApi();

    // Empty dependency array means:
    // Run this effect only once when the component first mounts.
  }, []);

  // Render the current message stored in React state.
  // Initially:
  //   "Checking API connection..."
  //
  // After a successful API call:
  //   "IDS Setup Wizard API is running"
  //
  // If the request fails:
  //   "Unable to connect to the backend."
  return <h1>{message}</h1>;
}

export default App;

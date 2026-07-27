import { useState } from "react";

import { PrimaryButton } from "../components/Button";
import WizardLayout from "../components/WizardLayout";
import { startSetup } from "../services/api";

import type { StartSetupResult } from "../../../shared/types/api.types";

interface DealerInformationPageProps {
  onSetupStarted: (result: StartSetupResult) => void;
}

export default function DealerInformationPage({
  onSetupStarted,
}: DealerInformationPageProps) {
  // These values are controlled by the two form inputs.
  const [dealershipName, setDealershipName] = useState("");
  const [clientId, setClientId] = useState("");

  // Tracks whether the request is currently running.
  // We use this to prevent duplicate submissions and update button text.
  const [isLoading, setIsLoading] = useState(false);

  // Stores a user-facing error message when setup cannot begin.
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ): Promise<void> {
    // Prevent the browser from refreshing the page when the form submits.
    event.preventDefault();

    const trimmedDealershipName = dealershipName.trim();
    const trimmedClientId = clientId.trim();

    // Frontend validation gives the user immediate feedback.
    // The backend still validates these values for security and reliability.
    if (!trimmedDealershipName || !trimmedClientId) {
      setErrorMessage("Dealership name and Client ID are required.");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await startSetup({
        dealershipName: trimmedDealershipName,
        clientId: trimmedClientId,
      });

      // Send the safe setup result to App.tsx.
      // App.tsx can store the session ID and move to the locations screen.
      onSetupStarted(response.data);
    } catch (error) {
      // The backend currently returns structured error JSON.
      // We check for a message before falling back to a generic error.
      if (
        typeof error === "object" &&
        error !== null &&
        "message" in error &&
        typeof error.message === "string"
      ) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Unable to start the setup session.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  const isFormIncomplete = !dealershipName.trim() || !clientId.trim();

  return (
    <WizardLayout
      stepLabel="Step 1 of 8"
      title="Start IDS Setup"
      description="Enter the dealership information provided for this IDS integration."
      maxWidth="520px"
    >
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.fieldGroup}>
          <label htmlFor="dealershipName" style={styles.label}>
            Dealership name
          </label>

          <input
            id="dealershipName"
            type="text"
            value={dealershipName}
            onChange={(event) => setDealershipName(event.target.value)}
            placeholder="Southwind RV"
            autoComplete="organization"
            disabled={isLoading}
            style={styles.input}
          />
        </div>

        <div style={styles.fieldGroup}>
          <label htmlFor="clientId" style={styles.label}>
            IDS Client ID
          </label>

          <input
            id="clientId"
            type="password"
            value={clientId}
            onChange={(event) => setClientId(event.target.value)}
            placeholder="Enter the IDS Client ID"
            autoComplete="off"
            disabled={isLoading}
            style={styles.input}
          />

          <small style={styles.helpText}>
            The Client ID is sent securely to the backend and is not displayed
            after setup begins.
          </small>
        </div>

        {errorMessage && (
          <div role="alert" style={styles.error}>
            {errorMessage}
          </div>
        )}

        <PrimaryButton
          type="submit"
          disabled={isLoading || isFormIncomplete}
          aria-busy={isLoading}
        >
          {isLoading ? "Starting setup..." : "Next: Retrieve Locations"}
        </PrimaryButton>
      </form>
    </WizardLayout>
  );
}

const styles: Record<string, React.CSSProperties> = {
  form: {
    display: "grid",
    gap: "20px",
  },
  fieldGroup: {
    display: "grid",
    gap: "8px",
  },
  label: {
    fontWeight: 600,
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "12px",
    border: "1px solid #cbd5e1",
    borderRadius: "8px",
    fontSize: "16px",
  },
  helpText: {
    lineHeight: 1.4,
  },
  error: {
    padding: "12px",
    borderRadius: "8px",
    backgroundColor: "#fee2e2",
    color: "#991b1b",
  },
};

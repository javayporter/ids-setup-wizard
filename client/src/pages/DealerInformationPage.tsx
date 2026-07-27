import { useState } from "react";

import type { StartSetupResult } from "../../../shared/types/api.types";
import { PrimaryButton } from "../components/Button";
import WizardLayout from "../components/WizardLayout";
import { ApiError } from "../errors/ApiError";
import { startSetup } from "../services/api";

import styles from "./DealerInformation.module.css";

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

      // Send the safe setup result to the wizard state hook.
      // The hook stores the session details and advances to the locations page.
      onSetupStarted(response.data);
    } catch (error) {
      if (error instanceof ApiError) {
        console.error("Setup API request failed:", error);

        setErrorMessage(error.message);
      } else {
        console.error("Unexpected setup request error:", error);

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
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.fieldGroup}>
          <label htmlFor="dealershipName" className={styles.label}>
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
            className={styles.input}
          />
        </div>

        <div className={styles.fieldGroup}>
          <label htmlFor="clientId" className={styles.label}>
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
            className={styles.input}
          />

          <small className={styles.helpText}>
            The Client ID is sent securely to the backend and is not displayed
            after setup begins.
          </small>
        </div>

        {errorMessage && (
          <div role="alert" className={styles.error}>
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

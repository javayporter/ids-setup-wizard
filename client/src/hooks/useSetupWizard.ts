import { useState } from "react";

import type { StartSetupResult } from "../../../shared/types/api.types";
import { generateSetupCredentials } from "../services/api";
import type {
  SetupWizardState,
  SetupWizardStep,
} from "../state/setupWizard.types";

/**
 * The wizard's starting state.
 *
 * Every new setup begins on the dealer information page without an active
 * backend session, retrieved location information, or generated password.
 */
const initialWizardState: SetupWizardState = {
  currentStep: "dealer-information",
  sessionId: null,
  dealershipName: "",
  mainLocation: null,
  locations: [],
  generatedPassword: null,
};

/**
 * Owns the frontend state and navigation rules for the IDS setup wizard.
 *
 * Individual pages report that an action occurred, while this hook decides
 * how that action changes the overall setup process.
 */
export function useSetupWizard() {
  const [wizardState, setWizardState] =
    useState<SetupWizardState>(initialWizardState);

  const [isGeneratingCredentials, setIsGeneratingCredentials] = useState(false);

  const [credentialError, setCredentialError] = useState<string | null>(null);

  /**
   * Handles the successful completion of the dealer information step.
   *
   * The backend has already authenticated with IDS, retrieved the dealer
   * locations, identified the main location, and created a setup session.
   *
   * The frontend stores only the safe result and advances to the locations
   * page.
   */
  function handleSetupStarted(result: StartSetupResult): void {
    setWizardState((currentState) => ({
      ...currentState,
      currentStep: "dealer-locations",
      sessionId: result.sessionId,
      dealershipName: result.dealershipName,
      mainLocation: result.mainLocation,
      locations: result.locations,
      generatedPassword: null,
    }));

    setCredentialError(null);
  }

  /**
   * Moves the wizard to a specific known step.
   *
   * This remains private to the hook so page components cannot navigate
   * directly to arbitrary steps.
   */
  function goToStep(step: SetupWizardStep): void {
    setWizardState((currentState) => ({
      ...currentState,
      currentStep: step,
    }));
  }

  /**
   * Returns from the locations page to the dealer information page.
   */
  function goBackToDealerInformation(): void {
    goToStep("dealer-information");
  }

  /**
   * Requests a generated password from the backend and advances to the
   * iCC feed setup page after the request succeeds.
   *
   * The backend remains the source of truth for the generated password.
   */
  async function continueToIccFeedSetup(): Promise<void> {
    const sessionId = wizardState.sessionId;

    if (!sessionId) {
      setCredentialError(
        "The setup session is unavailable. Please restart the setup process.",
      );
      return;
    }

    setIsGeneratingCredentials(true);
    setCredentialError(null);

    try {
      const response = await generateSetupCredentials(sessionId);

      setWizardState((currentState) => ({
        ...currentState,
        currentStep: "icc-feed-setup",
        generatedPassword: response.data.generatedPassword,
      }));
    } catch {
      setCredentialError(
        "Unable to generate the feed credentials. Please try again.",
      );
    } finally {
      setIsGeneratingCredentials(false);
    }
  }

  /**
   * Returns from the iCC feed setup page to the dealer locations page.
   *
   * The existing password remains in state so returning to the iCC page
   * does not unexpectedly generate a new value.
   */
  function goBackToDealerLocations(): void {
    setCredentialError(null);
    goToStep("dealer-locations");
  }

  /**
   * Requests a replacement password from the backend.
   *
   * The backend updates the existing setup session and returns the newly
   * generated password.
   */
  async function regeneratePassword(): Promise<void> {
    const sessionId = wizardState.sessionId;

    if (!sessionId) {
      setCredentialError(
        "The setup session is unavailable. Please restart the setup process.",
      );
      return;
    }

    setIsGeneratingCredentials(true);
    setCredentialError(null);

    try {
      const response = await generateSetupCredentials(sessionId);

      setWizardState((currentState) => ({
        ...currentState,
        generatedPassword: response.data.generatedPassword,
      }));
    } catch {
      setCredentialError(
        "Unable to generate a new password. Please try again.",
      );
    } finally {
      setIsGeneratingCredentials(false);
    }
  }

  /**
   * Handles confirmation that the iCC feed was created.
   *
   * The next wizard step will be added after the iCC setup flow is verified.
   */
  function handleFeedCreated(): void {
    console.log("The user confirmed that the iCC feed was created.");
  }

  /**
   * Clears all frontend wizard state and starts a completely new setup.
   */
  function resetWizard(): void {
    setWizardState(initialWizardState);
    setCredentialError(null);
    setIsGeneratingCredentials(false);
  }

  return {
    wizardState,
    isGeneratingCredentials,
    credentialError,
    handleSetupStarted,
    goBackToDealerInformation,
    continueToIccFeedSetup,
    goBackToDealerLocations,
    regeneratePassword,
    handleFeedCreated,
    resetWizard,
  };
}

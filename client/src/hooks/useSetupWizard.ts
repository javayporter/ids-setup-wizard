import { useState } from "react";

import type { StartSetupResult } from "../../../shared/types/api.types";
import type {
  SetupWizardState,
  SetupWizardStep,
} from "../state/setupWizard.types";

/**
 * The wizard's starting state.
 *
 * Every new setup begins on the dealer information page without an active
 * backend session or any retrieved location information.
 */
const initialWizardState: SetupWizardState = {
  currentStep: "dealer-information",
  sessionId: null,
  dealershipName: "",
  mainLocation: null,
  locations: [],
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
    setWizardState({
      currentStep: "dealer-locations",
      sessionId: result.sessionId,
      dealershipName: result.dealershipName,
      mainLocation: result.mainLocation,
      locations: result.locations,
    });
  }

  /**
   * Moves the wizard to a specific known step.
   *
   * This is intentionally private to the hook's public API for now. As the
   * wizard grows, navigation rules may become more restrictive.
   */
  function goToStep(step: SetupWizardStep): void {
    setWizardState((currentState) => ({
      ...currentState,
      currentStep: step,
    }));
  }

  /**
   * Returns from the locations page to the dealer information page.
   *
   * The retrieved setup data remains in state for now. We can later decide
   * whether returning to the first page should invalidate the backend session.
   */
  function goBackToDealerInformation(): void {
    goToStep("dealer-information");
  }

  /**
   * Clears all frontend wizard state and starts a completely new setup.
   */
  function resetWizard(): void {
    setWizardState(initialWizardState);
  }

  return {
    wizardState,
    handleSetupStarted,
    goBackToDealerInformation,
    resetWizard,
  };
}

import type { IdsLocation } from "../../../shared/types/api.types";

/**
 * Identifies the page currently displayed by the setup wizard.
 *
 * We use descriptive string values instead of step numbers so the code
 * communicates what each step represents.
 */
export type SetupWizardStep =
  | "dealer-information"
  | "dealer-locations"
  | "icc-feed-setup";

/**
 * Represents the safe setup information the React application must retain
 * while the user moves through the wizard.
 *
 * Sensitive values such as the IDS access token are intentionally excluded.
 * Those values remain in the backend setup session.
 */
export interface SetupWizardState {
  currentStep: SetupWizardStep;
  sessionId: string | null;
  dealershipName: string;
  mainLocation: IdsLocation | null;
  locations: IdsLocation[];
  generatedPassword: string | null;
}

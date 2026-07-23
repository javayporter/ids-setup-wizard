import DealerInformationPage from "../../pages/DealerInformationPage";
import DealerLocationsPage from "../../pages/DealerLocationsPage";
import { useSetupWizard } from "../../hooks/useSetupWizard";

/**
 * Coordinates the pages that make up the IDS setup process.
 *
 * This component determines which page should currently be displayed and
 * passes each page only the state and callbacks it needs.
 */
export default function SetupWizard() {
  const { wizardState, handleSetupStarted, goBackToDealerInformation } =
    useSetupWizard();

  switch (wizardState.currentStep) {
    case "dealer-information":
      return <DealerInformationPage onSetupStarted={handleSetupStarted} />;

    case "dealer-locations":
      /**
       * TypeScript knows these values may initially be null because no setup
       * session exists when the application first loads.
       *
       * Reaching this page without a main location would represent invalid
       * wizard state, so we guard against it before rendering the page.
       */
      if (!wizardState.mainLocation) {
        return (
          <main>
            <h1>Unable to display dealer locations.</h1>
            <p>Please restart the setup process.</p>
          </main>
        );
      }

      return (
        <DealerLocationsPage
          dealershipName={wizardState.dealershipName}
          mainLocation={wizardState.mainLocation}
          locations={wizardState.locations}
          onBack={goBackToDealerInformation}
        />
      );

    default:
      return null;
  }
}

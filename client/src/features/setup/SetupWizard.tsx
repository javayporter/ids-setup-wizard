import DealerInformationPage from "../../pages/DealerInformationPage";
import DealerLocationsPage from "../../pages/DealerLocationsPage";
import IccFeedSetupPage from "../../pages/IccFeedSetupPage";
import { useSetupWizard } from "../../hooks/useSetupWizard";

/**
 * Coordinates the pages that make up the IDS setup process.
 *
 * This component determines which page should currently be displayed and
 * passes each page only the state and callbacks it needs.
 */
export default function SetupWizard() {
  const {
    wizardState,
    handleSetupStarted,
    goBackToDealerInformation,
    continueToIccFeedSetup,
    goBackToDealerLocations,
    regeneratePassword,
    handleFeedCreated,
  } = useSetupWizard();

  switch (wizardState.currentStep) {
    case "dealer-information":
      return <DealerInformationPage onSetupStarted={handleSetupStarted} />;

    case "dealer-locations":
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
          onContinue={continueToIccFeedSetup}
        />
      );

    case "icc-feed-setup":
      if (!wizardState.mainLocation || !wizardState.generatedPassword) {
        return (
          <main>
            <h1>Unable to display feed credentials.</h1>
            <p>Please return to the previous step and try again.</p>

            <button type="button" onClick={goBackToDealerLocations}>
              Back
            </button>
          </main>
        );
      }

      return (
        <IccFeedSetupPage
          mainLocationCode={wizardState.mainLocation.Location}
          generatedPassword={wizardState.generatedPassword}
          onBack={goBackToDealerLocations}
          onRegeneratePassword={regeneratePassword}
          onFeedCreated={handleFeedCreated}
        />
      );

    default:
      return null;
  }
}

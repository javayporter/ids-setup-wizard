import { useState } from "react";

import { PrimaryButton, SecondaryButton } from "../components/Button";
import WizardLayout from "../components/WizardLayout";

import styles from "./IccFeedSetupPage.module.css";

interface IccFeedSetupPageProps {
  mainLocationCode: string;
  generatedPassword: string;
  onBack: () => void;
  onRegeneratePassword: () => Promise<void>;
  onFeedCreated: () => void;
}

export default function IccFeedSetupPage({
  mainLocationCode,
  generatedPassword,
  onBack,
  onRegeneratePassword,
  onFeedCreated,
}: IccFeedSetupPageProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isRegeneratingPassword, setIsRegeneratingPassword] = useState(false);
  const [copyMessage, setCopyMessage] = useState("");
  const [regenerateError, setRegenerateError] = useState("");

  async function handleCopyPassword(): Promise<void> {
    try {
      await navigator.clipboard.writeText(generatedPassword);
      setCopyMessage("Password copied.");

      window.setTimeout(() => {
        setCopyMessage("");
      }, 2000);
    } catch {
      setCopyMessage("Unable to copy the password.");
    }
  }

  async function handleRegeneratePassword(): Promise<void> {
    setIsRegeneratingPassword(true);
    setRegenerateError("");
    setCopyMessage("");

    try {
      await onRegeneratePassword();
      setIsPasswordVisible(false);
    } catch {
      setRegenerateError(
        "Unable to generate a new password. Please try again.",
      );
    } finally {
      setIsRegeneratingPassword(false);
    }
  }

  const passwordInputClassName = [styles.input, styles.passwordInput].join(" ");

  return (
    <WizardLayout
      stepLabel="Step 3"
      title="Create the Feed in iCC"
      description="Use the information below to create the dealer's IDS API inventory feed in iCC."
      maxWidth="700px"
    >
      <section className={styles.feedInformationCard}>
        <h2 className={styles.sectionHeading}>Feed Information</h2>

        <div className={styles.fieldSection}>
          <p className={styles.fieldLabel}>IDS Client ID</p>

          <p className={styles.fieldDescription}>
            Use the Client ID entered during Step 1.
          </p>
        </div>

        <div className={styles.fieldSection}>
          <label htmlFor="main-location-code" className={styles.inputLabel}>
            Master Location Code
          </label>

          <input
            id="main-location-code"
            type="text"
            value={mainLocationCode}
            readOnly
            className={styles.input}
          />
        </div>

        <div className={styles.fieldSection}>
          <label htmlFor="generated-password" className={styles.inputLabel}>
            Generated Password
          </label>

          <input
            id="generated-password"
            type={isPasswordVisible ? "text" : "password"}
            value={generatedPassword}
            readOnly
            className={passwordInputClassName}
          />

          <div className={styles.passwordButtonRow}>
            <SecondaryButton
              type="button"
              onClick={() =>
                setIsPasswordVisible((currentValue) => !currentValue)
              }
              disabled={isRegeneratingPassword}
              className={styles.compactButton}
            >
              {isPasswordVisible ? "Hide Password" : "Show Password"}
            </SecondaryButton>

            <SecondaryButton
              type="button"
              onClick={handleCopyPassword}
              disabled={isRegeneratingPassword}
              className={styles.compactButton}
            >
              Copy Password
            </SecondaryButton>

            <SecondaryButton
              type="button"
              onClick={handleRegeneratePassword}
              disabled={isRegeneratingPassword}
              aria-busy={isRegeneratingPassword}
              className={styles.compactButton}
            >
              {isRegeneratingPassword
                ? "Generating..."
                : "Generate New Password"}
            </SecondaryButton>
          </div>

          {copyMessage && (
            <p role="status" className={styles.statusMessage}>
              {copyMessage}
            </p>
          )}

          {regenerateError && (
            <p role="alert" className={styles.errorMessage}>
              {regenerateError}
            </p>
          )}
        </div>
      </section>

      <section className={styles.instructionsCard}>
        <h2 className={styles.sectionHeading}>iCC Instructions</h2>

        <ol className={styles.instructionsList}>
          <li>Open the dealer account in iCC.</li>
          <li>Create a new IDS API inventory import feed.</li>
          <li>Enter the IDS Client ID used during Step 1.</li>
          <li>
            Enter <strong>{mainLocationCode}</strong> in the Master Location
            Code field.
          </li>
          <li>Enter the generated password shown above.</li>
          <li>Save the feed in iCC.</li>
        </ol>
      </section>

      <div className={styles.navigationButtonRow}>
        <SecondaryButton
          type="button"
          onClick={onBack}
          disabled={isRegeneratingPassword}
        >
          Back
        </SecondaryButton>

        <PrimaryButton
          type="button"
          onClick={onFeedCreated}
          disabled={isRegeneratingPassword}
        >
          Feed Created
        </PrimaryButton>
      </div>
    </WizardLayout>
  );
}

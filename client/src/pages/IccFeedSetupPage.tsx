import { useState } from "react";

import { PrimaryButton, SecondaryButton } from "../components/Button";
import WizardLayout from "../components/WizardLayout";

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

  return (
    <WizardLayout
      stepLabel="Step 3"
      title="Create the Feed in iCC"
      description="Use the information below to create the dealer's IDS API inventory feed in iCC."
      maxWidth="700px"
    >
      <section style={styles.feedInformationCard}>
        <h2 style={styles.sectionHeading}>Feed Information</h2>

        <div style={styles.fieldSection}>
          <p style={styles.fieldLabel}>IDS Client ID</p>

          <p style={styles.fieldDescription}>
            Use the Client ID entered during Step 1.
          </p>
        </div>

        <div style={styles.fieldSection}>
          <label htmlFor="main-location-code" style={styles.inputLabel}>
            Master Location Code
          </label>

          <input
            id="main-location-code"
            type="text"
            value={mainLocationCode}
            readOnly
            style={styles.input}
          />
        </div>

        <div style={styles.fieldSection}>
          <label htmlFor="generated-password" style={styles.inputLabel}>
            Generated Password
          </label>

          <input
            id="generated-password"
            type={isPasswordVisible ? "text" : "password"}
            value={generatedPassword}
            readOnly
            style={{
              ...styles.input,
              fontFamily: "monospace",
              letterSpacing: "1px",
            }}
          />

          <div style={styles.passwordButtonRow}>
            <SecondaryButton
              type="button"
              onClick={() =>
                setIsPasswordVisible((currentValue) => !currentValue)
              }
              disabled={isRegeneratingPassword}
              style={styles.compactButton}
            >
              {isPasswordVisible ? "Hide Password" : "Show Password"}
            </SecondaryButton>

            <SecondaryButton
              type="button"
              onClick={handleCopyPassword}
              disabled={isRegeneratingPassword}
              style={styles.compactButton}
            >
              Copy Password
            </SecondaryButton>

            <SecondaryButton
              type="button"
              onClick={handleRegeneratePassword}
              disabled={isRegeneratingPassword}
              aria-busy={isRegeneratingPassword}
              style={styles.compactButton}
            >
              {isRegeneratingPassword
                ? "Generating..."
                : "Generate New Password"}
            </SecondaryButton>
          </div>

          {copyMessage && (
            <p role="status" style={styles.statusMessage}>
              {copyMessage}
            </p>
          )}

          {regenerateError && (
            <p role="alert" style={styles.errorMessage}>
              {regenerateError}
            </p>
          )}
        </div>
      </section>

      <section style={styles.instructionsCard}>
        <h2 style={styles.sectionHeading}>iCC Instructions</h2>

        <ol style={styles.instructionsList}>
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

      <div style={styles.navigationButtonRow}>
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

const styles: Record<string, React.CSSProperties> = {
  feedInformationCard: {
    padding: "20px",
    border: "1px solid #cbd5e1",
    borderRadius: "8px",
    backgroundColor: "#f8fafc",
  },
  instructionsCard: {
    marginTop: "24px",
    padding: "20px",
    border: "1px solid #cbd5e1",
    borderRadius: "8px",
  },
  sectionHeading: {
    marginTop: 0,
    fontSize: "20px",
  },
  fieldSection: {
    marginTop: "20px",
  },
  fieldLabel: {
    marginBottom: "6px",
    fontSize: "14px",
    fontWeight: 600,
  },
  fieldDescription: {
    marginTop: 0,
  },
  inputLabel: {
    display: "block",
    marginBottom: "6px",
    fontSize: "14px",
    fontWeight: 600,
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "12px",
    border: "1px solid #94a3b8",
    borderRadius: "8px",
    backgroundColor: "#ffffff",
    fontSize: "16px",
  },
  passwordButtonRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    marginTop: "12px",
  },
  compactButton: {
    padding: "10px 14px",
  },
  statusMessage: {
    marginBottom: 0,
    color: "#334155",
    fontSize: "14px",
  },
  errorMessage: {
    marginBottom: 0,
    color: "#b91c1c",
    fontSize: "14px",
  },
  instructionsList: {
    paddingLeft: "22px",
    lineHeight: 1.7,
  },
  navigationButtonRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: "16px",
    marginTop: "32px",
  },
};

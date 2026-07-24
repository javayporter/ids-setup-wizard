import { useState } from "react";

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
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "24px",
        backgroundColor: "#f5f7fa",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <section
        style={{
          width: "100%",
          maxWidth: "700px",
          padding: "32px",
          borderRadius: "12px",
          backgroundColor: "#ffffff",
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)",
        }}
      >
        <p style={{ margin: "0 0 8px", fontWeight: 600 }}>Step 3</p>

        <h1 style={{ margin: "0 0 12px" }}>Create the Feed in iCC</h1>

        <p style={{ lineHeight: 1.6 }}>
          Use the information below to create the dealer&apos;s IDS API
          inventory feed in iCC.
        </p>

        <section
          style={{
            marginTop: "24px",
            padding: "20px",
            border: "1px solid #cbd5e1",
            borderRadius: "8px",
            backgroundColor: "#f8fafc",
          }}
        >
          <h2 style={{ marginTop: 0, fontSize: "20px" }}>Feed Information</h2>

          <div style={{ marginTop: "20px" }}>
            <p
              style={{
                marginBottom: "6px",
                fontSize: "14px",
                fontWeight: 600,
              }}
            >
              IDS Client ID
            </p>

            <p style={{ marginTop: 0 }}>
              Use the Client ID entered during Step 1.
            </p>
          </div>

          <div style={{ marginTop: "20px" }}>
            <label
              htmlFor="main-location-code"
              style={{
                display: "block",
                marginBottom: "6px",
                fontSize: "14px",
                fontWeight: 600,
              }}
            >
              Master Location Code
            </label>

            <input
              id="main-location-code"
              type="text"
              value={mainLocationCode}
              readOnly
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "12px",
                border: "1px solid #94a3b8",
                borderRadius: "8px",
                backgroundColor: "#ffffff",
                fontSize: "16px",
              }}
            />
          </div>

          <div style={{ marginTop: "20px" }}>
            <label
              htmlFor="generated-password"
              style={{
                display: "block",
                marginBottom: "6px",
                fontSize: "14px",
                fontWeight: 600,
              }}
            >
              Generated Password
            </label>

            <input
              id="generated-password"
              type={isPasswordVisible ? "text" : "password"}
              value={generatedPassword}
              readOnly
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "12px",
                border: "1px solid #94a3b8",
                borderRadius: "8px",
                backgroundColor: "#ffffff",
                fontFamily: "monospace",
                fontSize: "16px",
                letterSpacing: "1px",
              }}
            />

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "10px",
                marginTop: "12px",
              }}
            >
              <button
                type="button"
                onClick={() => setIsPasswordVisible((current) => !current)}
                disabled={isRegeneratingPassword}
                style={{
                  padding: "10px 14px",
                  border: "1px solid #64748b",
                  borderRadius: "8px",
                  backgroundColor: "#ffffff",
                  fontWeight: 600,
                  cursor: isRegeneratingPassword ? "not-allowed" : "pointer",
                  opacity: isRegeneratingPassword ? 0.6 : 1,
                }}
              >
                {isPasswordVisible ? "Hide Password" : "Show Password"}
              </button>

              <button
                type="button"
                onClick={handleCopyPassword}
                disabled={isRegeneratingPassword}
                style={{
                  padding: "10px 14px",
                  border: "1px solid #64748b",
                  borderRadius: "8px",
                  backgroundColor: "#ffffff",
                  fontWeight: 600,
                  cursor: isRegeneratingPassword ? "not-allowed" : "pointer",
                  opacity: isRegeneratingPassword ? 0.6 : 1,
                }}
              >
                Copy Password
              </button>

              <button
                type="button"
                onClick={handleRegeneratePassword}
                disabled={isRegeneratingPassword}
                style={{
                  padding: "10px 14px",
                  border: "1px solid #64748b",
                  borderRadius: "8px",
                  backgroundColor: "#ffffff",
                  fontWeight: 600,
                  cursor: isRegeneratingPassword ? "not-allowed" : "pointer",
                  opacity: isRegeneratingPassword ? 0.6 : 1,
                }}
              >
                {isRegeneratingPassword
                  ? "Generating..."
                  : "Generate New Password"}
              </button>
            </div>

            {copyMessage && (
              <p
                role="status"
                style={{
                  marginBottom: 0,
                  color: "#334155",
                  fontSize: "14px",
                }}
              >
                {copyMessage}
              </p>
            )}

            {regenerateError && (
              <p
                role="alert"
                style={{
                  marginBottom: 0,
                  color: "#b91c1c",
                  fontSize: "14px",
                }}
              >
                {regenerateError}
              </p>
            )}
          </div>
        </section>

        <section
          style={{
            marginTop: "24px",
            padding: "20px",
            border: "1px solid #cbd5e1",
            borderRadius: "8px",
          }}
        >
          <h2 style={{ marginTop: 0, fontSize: "20px" }}>iCC Instructions</h2>

          <ol style={{ paddingLeft: "22px", lineHeight: 1.7 }}>
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

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "16px",
            marginTop: "32px",
          }}
        >
          <button
            type="button"
            onClick={onBack}
            disabled={isRegeneratingPassword}
            style={{
              padding: "12px 18px",
              border: "1px solid #64748b",
              borderRadius: "8px",
              backgroundColor: "#ffffff",
              fontWeight: 600,
              cursor: isRegeneratingPassword ? "not-allowed" : "pointer",
              opacity: isRegeneratingPassword ? 0.6 : 1,
            }}
          >
            Back
          </button>

          <button
            type="button"
            onClick={onFeedCreated}
            disabled={isRegeneratingPassword}
            style={{
              padding: "12px 18px",
              border: "none",
              borderRadius: "8px",
              backgroundColor: "#2563eb",
              color: "#ffffff",
              fontWeight: 600,
              cursor: isRegeneratingPassword ? "not-allowed" : "pointer",
              opacity: isRegeneratingPassword ? 0.6 : 1,
            }}
          >
            Feed Created
          </button>
        </div>
      </section>
    </main>
  );
}

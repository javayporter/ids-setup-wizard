import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

type ButtonVariant = "primary" | "secondary";

interface BaseButtonProps extends ButtonProps {
  variant: ButtonVariant;
}

function BaseButton({
  children,
  variant,
  disabled = false,
  style,
  ...buttonProps
}: BaseButtonProps) {
  const variantStyles =
    variant === "primary" ? styles.primary : styles.secondary;

  return (
    <button
      {...buttonProps}
      disabled={disabled}
      style={{
        ...styles.base,
        ...variantStyles,
        opacity: disabled ? 0.6 : 1,
        cursor: disabled ? "not-allowed" : "pointer",
        ...style,
      }}
    >
      {children}
    </button>
  );
}

export function PrimaryButton({ children, ...buttonProps }: ButtonProps) {
  return (
    <BaseButton variant="primary" {...buttonProps}>
      {children}
    </BaseButton>
  );
}

export function SecondaryButton({ children, ...buttonProps }: ButtonProps) {
  return (
    <BaseButton variant="secondary" {...buttonProps}>
      {children}
    </BaseButton>
  );
}

const styles: Record<string, CSSProperties> = {
  base: {
    padding: "12px 18px",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: 600,
  },
  primary: {
    border: "none",
    backgroundColor: "#2563eb",
    color: "#ffffff",
  },
  secondary: {
    border: "1px solid #64748b",
    backgroundColor: "#ffffff",
    color: "#1f2937",
  },
};

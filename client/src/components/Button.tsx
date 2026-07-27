import type { ButtonHTMLAttributes, ReactNode } from "react";

import styles from "./Button.module.css";

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
  className,
  ...buttonProps
}: BaseButtonProps) {
  const variantClass =
    variant === "primary" ? styles.primary : styles.secondary;

  const combinedClassName = [styles.base, variantClass, className]
    .filter(Boolean)
    .join(" ");

  return (
    <button {...buttonProps} className={combinedClassName}>
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

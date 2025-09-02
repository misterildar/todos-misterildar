import { type FC, type ReactNode } from "react";
import clsx from "clsx";

import styles from "./Button.module.scss";

interface ButtonProps {
  text?: string;
  icon?: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "icon";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  className?: string;
  "aria-label"?: string;
  "data-testid"?: string;
}

export const Button: FC<ButtonProps> = ({
  text,
  icon,
  onClick,
  size = "medium",
  disabled = false,
  type = "button",
  className = "",
  variant = "primary",
  "aria-label": ariaLabel,
  "data-testid": dataTestId,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={clsx(styles.button, styles[variant], styles[size], className, {
        [styles.iconOnly]: !text && icon,
      })}
      aria-label={ariaLabel}
      data-testid={dataTestId}
    >
      {icon && <span className={styles.icon}>{icon}</span>}
      {text && <span className={styles.text}>{text}</span>}
    </button>
  );
};

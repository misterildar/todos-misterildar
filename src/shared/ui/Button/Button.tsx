import { type FC } from "react";
import clsx from "clsx";

import styles from "./Button.module.scss";

interface ButtonProps {
  text: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "danger";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  className?: string;
}

export const Button: FC<ButtonProps> = ({
  text,
  onClick,
  size = "medium",
  disabled = false,
  type = "button",
  className = "",
  variant = "primary",
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={clsx(styles.button, styles[variant], styles[size], className)}
    >
      {text}
    </button>
  );
};

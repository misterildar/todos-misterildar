import { type FC } from "react";

interface HighlightedTextProps {
  text: string;
  highlight: string;
  className?: string;
}

export const HighlightedText: FC<HighlightedTextProps> = ({
  text,
  highlight,
  className = "",
}) => {
  if (!highlight || !highlight.trim()) {
    return <span className={className}>{text}</span>;
  }

  const regex = new RegExp(`(${highlight})`, "gi");
  const parts = text.split(regex);

  return (
    <span className={className}>
      {parts.map((part, index) =>
        regex.test(part) ? (
          <mark key={index} className="highlight">
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </span>
  );
};

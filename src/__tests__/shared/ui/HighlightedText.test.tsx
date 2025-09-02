import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { HighlightedText } from "@/shared/ui/HighlightedText/HighlightedText";

describe("HighlightedText", () => {
  it("должен рендериться с обычным текстом без подсветки", () => {
    render(<HighlightedText text="Обычный текст" highlight="" />);

    expect(screen.getByText("Обычный текст")).toBeInTheDocument();
  });

  it("должен подсвечивать текст при совпадении", () => {
    render(<HighlightedText text="React компонент" highlight="React" />);

    const highlightedText = screen.getByText("React");
    expect(highlightedText).toHaveClass("highlight");
  });

  it("должен подсвечивать несколько совпадений в тексте", () => {
    render(<HighlightedText text="React и React Native" highlight="React" />);

    const highlightedElements = screen.getAllByText("React");
    expect(highlightedElements).toHaveLength(2);

    highlightedElements.forEach((element) => {
      expect(element).toHaveClass("highlight");
    });
  });

  it("должен игнорировать регистр при поиске", () => {
    render(<HighlightedText text="React компонент" highlight="react" />);

    const highlightedText = screen.getByText("React");
    expect(highlightedText).toHaveClass("highlight");
  });

  it("не должен подсвечивать текст при отсутствии совпадений", () => {
    render(<HighlightedText text="React компонент" highlight="Vue" />);

    const text = screen.getByText("React компонент");
    expect(text).not.toHaveClass("highlight");
  });

  it("должен правильно обрабатывать пустой highlight", () => {
    render(<HighlightedText text="React компонент" highlight="" />);

    const text = screen.getByText("React компонент");
    expect(text).not.toHaveClass("highlight");
  });

  it("должен правильно обрабатывать специальные символы в тексте", () => {
    render(<HighlightedText text="React & TypeScript" highlight="&" />);

    const highlightedText = screen.getByText("&");
    expect(highlightedText).toHaveClass("highlight");
  });

  it("должен правильно обрабатывать цифры в тексте", () => {
    render(<HighlightedText text="React 18" highlight="18" />);

    const highlightedText = screen.getByText("18");
    expect(highlightedText).toHaveClass("highlight");
  });
});

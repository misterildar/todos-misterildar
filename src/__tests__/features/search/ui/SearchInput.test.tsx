import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SearchInput } from "@/features/search/ui/SearchInput/SearchInput";

vi.mock("@/shared", () => ({
  Input: ({
    value,
    onChange,
    placeholder,
  }: {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder: string;
  }) => (
    <input
      data-testid="search-input"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
  ),
}));

const mockSetSearchQuery = vi.fn();
vi.mock("@/entities/todo", () => ({
  useSearchQuery: () => "",
  useTodoActions: () => ({
    setSearchQuery: mockSetSearchQuery,
  }),
}));

describe("SearchInput", () => {
  beforeEach(() => {
    mockSetSearchQuery.mockClear();
  });

  it("должен рендериться с полем поиска", () => {
    render(<SearchInput />);

    expect(screen.getByTestId("search-input")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Search tasks...")).toBeInTheDocument();
  });

  it("должен обновлять поисковый запрос при вводе", async () => {
    const user = userEvent.setup();
    render(<SearchInput />);

    const input = screen.getByTestId("search-input") as HTMLInputElement;
    await user.type(input, "React");

    expect(mockSetSearchQuery).toHaveBeenCalledWith("React");
  });

  it("должен вызывать setSearchQuery при каждом изменении", async () => {
    const user = userEvent.setup();
    render(<SearchInput />);

    const input = screen.getByTestId("search-input") as HTMLInputElement;
    await user.type(input, "React");

    expect(mockSetSearchQuery).toHaveBeenCalledTimes(5);
  });

  it("должен правильно обрабатывать пустой поисковый запрос", async () => {
    const user = userEvent.setup();
    render(<SearchInput />);

    const input = screen.getByTestId("search-input") as HTMLInputElement;
    await user.type(input, "React");
    await user.clear(input);

    expect(mockSetSearchQuery).toHaveBeenCalledWith("");
  });

  it("должен правильно обрабатывать пробелы в поиске", async () => {
    const user = userEvent.setup();
    render(<SearchInput />);

    const input = screen.getByTestId("search-input") as HTMLInputElement;
    await user.type(input, "  React  ");

    expect(mockSetSearchQuery).toHaveBeenCalledWith("  React  ");
  });

  it("должен правильно обрабатывать специальные символы", async () => {
    const user = userEvent.setup();
    render(<SearchInput />);

    const input = screen.getByTestId("search-input") as HTMLInputElement;
    await user.type(input, "React & TypeScript");

    expect(mockSetSearchQuery).toHaveBeenCalledWith("React & TypeScript");
  });

  it("должен правильно обрабатывать цифры", async () => {
    const user = userEvent.setup();
    render(<SearchInput />);

    const input = screen.getByTestId("search-input") as HTMLInputElement;
    await user.type(input, "React 18");

    expect(mockSetSearchQuery).toHaveBeenCalledWith("React 18");
  });

  it("должен правильно обрабатывать Unicode символы", async () => {
    const user = userEvent.setup();
    render(<SearchInput />);

    const input = screen.getByTestId("search-input") as HTMLInputElement;
    await user.type(input, "Привет мир");

    expect(mockSetSearchQuery).toHaveBeenCalledWith("Привет мир");
  });

  it("должен правильно обрабатывать эмодзи", async () => {
    const user = userEvent.setup();
    render(<SearchInput />);

    const input = screen.getByTestId("search-input") as HTMLInputElement;
    await user.type(input, "Hello 👋");

    expect(mockSetSearchQuery).toHaveBeenCalledWith("Hello 👋");
  });

  it("должен правильно обрабатывать множественные изменения", async () => {
    const user = userEvent.setup();
    render(<SearchInput />);

    const input = screen.getByTestId("search-input") as HTMLInputElement;

    await user.type(input, "React");
    await user.clear(input);
    await user.type(input, "Vue");
    await user.clear(input);
    await user.type(input, "Angular");

    expect(mockSetSearchQuery).toHaveBeenLastCalledWith("Angular");
  });
});

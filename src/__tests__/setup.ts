import "@testing-library/jest-dom";
import { vi } from "vitest";

const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

let counter = 0;
vi.spyOn(crypto, "randomUUID").mockImplementation(() => {
  counter++;
  return `test-uuid-${counter
    .toString()
    .padStart(8, "0")}-0000-4000-a000-000000000000`;
});

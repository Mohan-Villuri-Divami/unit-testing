import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import MuiSearch from "./MuiSearch";

global.fetch = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(console, "error").mockImplementation(() => {});
});

describe("MuiSearch Component", () => {
  test("should render without crashing", () => {
    render(<MuiSearch />);
    expect(screen.getByLabelText(/search by id/i)).toBeInTheDocument();
  });

  test("should handle text input", () => {
    render(<MuiSearch />);
    const inputField = screen.getByLabelText(/search by id/i);

    fireEvent.change(inputField, { target: { value: "123" } });

    expect(inputField.value).toBe("123");
  });

  test("should trigger fetch on button click", async () => {
    const mockResponse = [
      {
        id: 123,
        Name: "John Doe",
        Role: "Admin",
        class: "A",
        Gender: "M",
        DateOfBirth: "2000-01-01",
      },
    ];
    fetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockResponse),
    });

    render(<MuiSearch />);

    const inputField = screen.getByLabelText(/search by id/i);
    const searchButton = screen.getByRole("button");

    fireEvent.change(inputField, { target: { value: "123" } });
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(expect.stringContaining("123"));
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });
  });

  test("should handle fetch error", async () => {
    fetch.mockRejectedValueOnce(new Error("Network error"));

    render(<MuiSearch />);

    const inputField = screen.getByLabelText(/search by id/i);
    const searchButton = screen.getByRole("button");

    fireEvent.change(inputField, { target: { value: "123" } });
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(screen.getByText("No data available")).toBeInTheDocument();
    });
  });
});

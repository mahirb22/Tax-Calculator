import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import TaxCalculator from "../TaxCalculator";
import useFetch from "../../hooks/useFetch";
import { jest } from "@jest/globals";
import { act } from "react-dom/test-utils";
import { toast } from "react-toastify";

// Mock the useFetch hook
jest.mock("../../hooks/useFetch");

jest.mock("react-toastify");

beforeEach(() => {
  (useFetch as jest.Mock).mockReturnValue({
    data: null,
    loading: false,
    error: null,
    fetchData: jest.fn(),
    retries: 0,
  });
});

// Helper function to simulate form submission
const submitForm = () => fireEvent.click(screen.getByText("Calculate"));

describe("TaxCalculator", () => {
  beforeEach(() => {
    // Clear all instances of the mocked useFetch hook
    (useFetch as jest.Mock).mockClear();
  });

  test("renders without crashing", () => {
    render(<TaxCalculator />);
    expect(screen.getByText("Tax Calculator")).toBeInTheDocument();
  });

  test("does not submit the form when annual income is not provided", async () => {
    const toastError = jest.spyOn(toast, "error");
    toastError.mockClear();

    render(<TaxCalculator />);

    fireEvent.change(screen.getByPlaceholderText("Tax Year"), {
      target: { value: "2021" },
    });

    submitForm();

    await waitFor(() => expect(toastError).toHaveBeenCalled());
  });

  test("does not submit the form when tax year is not provided", async () => {
    const toastError = jest.spyOn(toast, "error");
    toastError.mockClear();

    render(<TaxCalculator />);

    fireEvent.change(screen.getByPlaceholderText("Annual Income"), {
      target: { value: "50000" },
    });

    submitForm();

    await waitFor(() => expect(toastError).toHaveBeenCalled());
  });

  test("handles form submission with valid inputs", async () => {
    (useFetch as jest.Mock).mockReturnValue({
      data: null,
      loading: false,
      error: null,
      fetchData: jest.fn(),
      retries: 0,
    });

    render(<TaxCalculator />);

    fireEvent.change(screen.getByPlaceholderText("Annual Income"), {
      target: { value: "50000" },
    });
    fireEvent.change(screen.getByPlaceholderText("Tax Year"), {
      target: { value: "2022" },
    });

    submitForm();

    await waitFor(() =>
      expect(useFetch).toHaveBeenCalledWith(
        `http://localhost:5000/tax-calculator/tax-year/2022`
      )
    );
  });

  test("displays a loading state while waiting for API response", async () => {
    (useFetch as jest.Mock).mockReturnValue({
      data: null,
      loading: true,
      error: null,
      fetchData: jest.fn(),
      retries: 0,
    });

    render(<TaxCalculator />);

    fireEvent.change(screen.getByPlaceholderText("Annual Income"), {
      target: { value: "50000" },
    });
    fireEvent.change(screen.getByPlaceholderText("Tax Year"), {
      target: { value: "2022" },
    });

    submitForm();

    await waitFor(() =>
      expect(screen.getByText(/Loading/i)).toBeInTheDocument()
    );
  });

  test("shows an error toast when tax year is out of range", async () => {
    const toastError = jest.spyOn(toast, "error");
    toastError.mockClear();

    render(<TaxCalculator />);

    fireEvent.change(screen.getByPlaceholderText("Tax Year"), {
      target: { value: "2018" },
    });

    submitForm();

    await waitFor(() => expect(toastError).toHaveBeenCalled());
  });

  test("updates tax year input field correctly", () => {
    render(<TaxCalculator />);

    fireEvent.change(screen.getByPlaceholderText("Tax Year"), {
      target: { value: "2022" },
    });

    expect(screen.getByPlaceholderText("Tax Year")).toHaveValue("2022");
  });

  test("updates annual income input field correctly", () => {
    render(<TaxCalculator />);

    fireEvent.change(screen.getByPlaceholderText("Annual Income"), {
      target: { value: "50000" },
    });

    expect(screen.getByPlaceholderText("Annual Income")).toHaveValue("50000");
  });

  test("displays an error message when API call returns an error", async () => {
    (useFetch as jest.Mock).mockReturnValue({
      data: null,
      loading: false,
      error: "Error 500: Internal Server Error",
      fetchData: jest.fn(),
      retries: 0,
    });

    render(<TaxCalculator />);

    fireEvent.change(screen.getByPlaceholderText("Annual Income"), {
      target: { value: "50000" },
    });
    fireEvent.change(screen.getByPlaceholderText("Tax Year"), {
      target: { value: "2022" },
    });

    submitForm();

    await waitFor(() =>
      expect(
        screen.getByText(/Error 500: Internal Server Error/i)
      ).toBeInTheDocument()
    );
  });
  test("displays the correct tax bands and tax values when the API call is successful", async () => {
    // Mock the useFetch hook to return sample data in the expected format
    (useFetch as jest.Mock).mockReturnValue({
      data: {
        tax_brackets: [
          { min: 0, max: 50197, rate: 0.15 },
          { min: 50197, max: 100392, rate: 0.205 },
        ],
      },
      loading: false,
      error: null,
      fetchData: jest.fn(),
      retries: 0,
    });

    render(<TaxCalculator />);

    // Wrap the fireEvent.change calls inside act to ensure proper rendering
    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText("Annual Income"), {
        target: { value: "100000" },
      });

      fireEvent.change(screen.getByPlaceholderText("Tax Year"), {
        target: { value: "2022" },
      });
    });

    submitForm();

    // Check if the correct tax bands and tax values are displayed
    await waitFor(() => expect(screen.getByText("Band 1")).toBeInTheDocument());
    expect(screen.getByText("$7,529.55")).toBeInTheDocument();
    expect(screen.getByText("Band 2")).toBeInTheDocument();
    expect(screen.getByText("$10,209.62")).toBeInTheDocument();
  }, 10000);
});

import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, fireEvent, screen } from "@testing-library/react";
import TaxForm from "../TaxForm";

describe("TaxForm", () => {
  const mockSetSalary = jest.fn();
  const mockSetTaxYearStr = jest.fn();
  const mockHandleSubmit = jest.fn();

  beforeEach(() => {
    // Render the TaxForm component before each test
    render(
      <TaxForm
        setSalary={mockSetSalary}
        setTaxYearStr={mockSetTaxYearStr}
        handleSubmit={mockHandleSubmit}
      />
    );
  });

  test("renders the form correctly", () => {
    expect(screen.getByPlaceholderText("Annual Income")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Tax Year")).toBeInTheDocument();
    expect(screen.getByText("Calculate")).toBeInTheDocument();
  });

  test("handles annual income input change", () => {
    fireEvent.change(screen.getByPlaceholderText("Annual Income"), {
      target: { value: "50000" },
    });

    expect(mockSetSalary).toHaveBeenCalledWith("50000");
  });

  test("handles tax year input change", () => {
    fireEvent.change(screen.getByPlaceholderText("Tax Year"), {
      target: { value: "2021" },
    });

    expect(mockSetTaxYearStr).toHaveBeenCalledWith("2021");
  });

  test("handles form submission", () => {
    fireEvent.submit(screen.getByText("Calculate"));

    expect(mockHandleSubmit).toHaveBeenCalled();
  });
});

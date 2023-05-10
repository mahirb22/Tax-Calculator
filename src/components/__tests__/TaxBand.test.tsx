import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import TaxBand from "../TaxBand";

describe("TaxBand", () => {
  test("renders with the correct band index and tax value", () => {
    render(<TaxBand index={0} tax={5000} />);

    expect(screen.getByText("Band 1")).toBeInTheDocument();

    expect(screen.getByText("$5,000")).toBeInTheDocument();
  });

  test("renders tax value with correct formatting", () => {
    // Render the TaxBand component with sample props
    render(<TaxBand index={1} tax={1234.5678} />);

    expect(screen.getByText("$1,234.57")).toBeInTheDocument();
  });

  test("renders with different band indices", () => {
    render(<TaxBand index={2} tax={3000} />);
    expect(screen.getByText("Band 3")).toBeInTheDocument();
  });
});

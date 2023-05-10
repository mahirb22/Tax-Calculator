import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import TaxContent from "../TaxContent";

describe("TaxContent", () => {
  test("renders loading state correctly", () => {
    render(
      <TaxContent loading={true} error={null} taxInfo={null} retries={0} />
    );
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  test("renders error state correctly", () => {
    render(
      <TaxContent
        loading={false}
        error="Error 500: Internal Server Error"
        taxInfo={null}
        retries={1}
      />
    );
    expect(
      screen.getByText(
        "Error: Error 500: Internal Server Error (Please wait, trying to fetch the data again - Attempt: 1 of 3)"
      )
    ).toBeInTheDocument();
  });

  test("renders no data state correctly", () => {
    render(
      <TaxContent loading={false} error={null} taxInfo={null} retries={0} />
    );
    expect(
      screen.getByText("Please enter a salary and tax year to calculate taxes.")
    ).toBeInTheDocument();
  });

  const formatCurrency = (value: number) => {
    return value.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const formatPercentage = (value: number) => {
    return (value * 100).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  test("renders tax results correctly", () => {
    const taxInfo = {
      taxesByBand: [7529.55, 10209.62],
      totalTax: 17739.17,
      effectiveRate: 0.1773,
    };

    render(
      <TaxContent loading={false} error={null} taxInfo={taxInfo} retries={0} />
    );

    // Check if the TaxResult component is rendered with the correct props
    expect(
      screen.getByText(`Total Income Tax: $${formatCurrency(17739.17)}`)
    ).toBeInTheDocument();
    expect(
      screen.getByText(`Effective Rate: ${formatPercentage(0.1773)}%`)
    ).toBeInTheDocument();

    expect(screen.getByText("Band 1")).toBeInTheDocument();
    expect(screen.getByText(`$${formatCurrency(7529.55)}`)).toBeInTheDocument();
    expect(screen.getByText("Band 2")).toBeInTheDocument();
    expect(
      screen.getByText(`$${formatCurrency(10209.62)}`)
    ).toBeInTheDocument();
  });
});

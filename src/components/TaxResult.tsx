// src/components/TaxResults.tsx
import React from "react";

interface TaxResultsProps {
  totalTax: number;
  effectiveRate: number;
}

const TaxResults: React.FC<TaxResultsProps> = ({ totalTax, effectiveRate }) => {
  return (
    <>
      <span>
        Total Income Tax: $
        {totalTax.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </span>
      <p>
        Effective Rate:{" "}
        {(effectiveRate * 100).toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
        %
      </p>
    </>
  );
};

export default TaxResults;

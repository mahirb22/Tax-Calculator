import React from "react";

interface TaxBandProps {
  index: number;
  tax: number;
}

const TaxBand: React.FC<TaxBandProps> = ({ index, tax }) => {
  return (
    <tr>
      <td>Band {index + 1}</td>
      <td>${tax.toLocaleString("en-US", { maximumFractionDigits: 2 })}</td>
    </tr>
  );
};

export default TaxBand;

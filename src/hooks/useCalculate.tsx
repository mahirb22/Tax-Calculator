import { useMemo } from "react";

const useCalculate = (data: any, salary: string) => {
  // Calculate taxes only when the data or salary changes
  const taxInfo = useMemo(() => calculateTaxes(data, salary), [data, salary]);

  // Return the tax information
  return taxInfo;
};

// Helper function to calculate taxes
const calculateTaxes = (data: any, salary: string) => {
  if (!data || !salary) return null;

  const salaryNoSymbols = salary.replace(/\$|,/g, ""); // Removes dollar sign and commas
  const salaryStr = parseInt(salaryNoSymbols, 10); // Parse integer value

  if (salaryStr <= 0) {
    return {
      taxesByBand: [0, 0, 0, 0],
      totalTax: 0,
      effectiveRate: 0,
    };
  }

  // Calculate the tax for each band based on the salary and tax brackets
  const taxesByBand = data.tax_brackets.map((band: any) => {
    const taxableAmount = Math.min(
      Math.max(salaryStr - band.min, 0),
      (band.max || Infinity) - band.min
    );
    return taxableAmount * band.rate;
  });

  // Calculate the total tax by summing up the taxes for each band
  const totalTax = taxesByBand.reduce(
    (acc: number, tax: number) => acc + tax,
    0
  );

  // Calculate the effective tax rate
  const effectiveRate = totalTax / salaryStr;

  return {
    taxesByBand,
    totalTax,
    effectiveRate,
  };
};

export default useCalculate;

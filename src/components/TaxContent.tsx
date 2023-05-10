import React from "react";
import TaxResult from "./TaxResult";
import TaxBand from "./TaxBand";

interface TaxInfo {
  taxesByBand: number[];
  totalTax: number;
  effectiveRate: number;
}

interface TaxContentProps {
  loading: boolean;
  error: string | null;
  taxInfo: TaxInfo | null;
  retries: number;
}

const TaxContent: React.FC<TaxContentProps> = ({
  loading,
  error,
  taxInfo,
  retries,
}) => {
  if (loading) return <p>Loading...</p>;
  if (error && error.includes("500")) {
    return (
      <p>
        Error: {error} (Please wait, trying to fetch the data again - Attempt:{" "}
        {retries} of 3)
      </p>
    );
  }
  if (!loading && !error && taxInfo === null)
    return <p>Please enter a salary and tax year to calculate taxes.</p>;

  console.log(taxInfo);

  return (
    <>
      {!error && taxInfo && (
        <>
          <TaxResult
            totalTax={taxInfo.totalTax}
            effectiveRate={taxInfo.effectiveRate}
          />
          <table className="tax-info">
            <thead>
              <tr>
                <th>Tax Band</th>
                <th>Tax</th>
              </tr>
            </thead>
            <tbody>
              {taxInfo.taxesByBand.map((tax: number, index: number) => (
                <TaxBand key={index} index={index} tax={tax} />
              ))}
            </tbody>
          </table>
        </>
      )}
    </>
  );
};

export default TaxContent;

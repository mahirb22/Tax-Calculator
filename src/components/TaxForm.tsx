import React from "react";

interface TaxFormProps {
  setSalary: (value: string) => void;
  setTaxYearStr: (value: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
}

const TaxForm: React.FC<TaxFormProps> = ({
  setSalary,
  setTaxYearStr,
  handleSubmit,
}) => {
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Annual Income"
        onChange={(e) => setSalary(e.target.value)}
      />
      <input
        type="text"
        placeholder="Tax Year"
        onChange={(e) => setTaxYearStr(e.target.value)}
      />
      <button type="submit">Calculate</button>
    </form>
  );
};

export default TaxForm;

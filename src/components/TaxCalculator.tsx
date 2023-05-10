import React, { useState } from "react";
import { toast } from "react-toastify";
import useFetch from "../hooks/useFetch";
import useCalculate from "../hooks/useCalculate";
import TaxForm from "./TaxForm";
import TaxContent from "./TaxContent";

const TaxCalculator = () => {
  const [salary, setSalary] = useState<string>("");
  const [taxYearStr, setTaxYearStr] = useState<string>("");
  const [taxYearStrError, setTaxYearStrError] = useState<boolean>(false);

  const { data, loading, error, fetchData, retries } = useFetch(
    `http://localhost:5000/tax-calculator/tax-year/${taxYearStr}`
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!salary) {
      toast.error("Please enter a valid Annual Income");
      return;
    }
    if (!taxYearStr || taxYearStrError) {
      toast.error("Please select a valid tax year between 2019 and 2022");
      return;
    }
    fetchData();
  };

  const handleTaxYearStrChange = (value: string) => {
    const taxYearStr = parseInt(value, 10);
    if (taxYearStr >= 2019 && taxYearStr <= 2022) {
      setTaxYearStrError(false);
      setTaxYearStr(value);
    } else {
      setTaxYearStrError(true);
    }
  };

  const taxInfo = useCalculate(data, salary);

  return (
    <div>
      <h1>Tax Calculator</h1>
      <TaxForm
        setSalary={setSalary}
        setTaxYearStr={handleTaxYearStrChange}
        handleSubmit={handleSubmit}
      />
      <div className="tax-content-wrapper">
        <TaxContent
          loading={loading}
          error={error}
          taxInfo={taxInfo}
          retries={retries}
        />
      </div>
    </div>
  );
};

export default TaxCalculator;

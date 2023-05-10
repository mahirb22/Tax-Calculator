import { renderHook } from "@testing-library/react-hooks";
import useCalculate from "../useCalculate";

describe("useCalculate hook", () => {
  const sampleData = {
    tax_brackets: [
      { min: 0, max: 10000, rate: 0.1 },
      { min: 10000, max: 20000, rate: 0.2 },
      { min: 20000, max: 30000, rate: 0.3 },
      { min: 30000, rate: 0.4 },
    ],
  };

  it("should return null when data or salary is missing", () => {
    const { result } = renderHook(() => useCalculate(null, "0"));
    expect(result.current).toBeNull();
  });

  it("should correctly calculate taxes for each band", () => {
    const { result } = renderHook(() => useCalculate(sampleData, "25000"));
    expect(result.current?.taxesByBand).toEqual([1000, 2000, 1500, 0]);
  });

  it("should correctly calculate total tax", () => {
    const { result } = renderHook(() => useCalculate(sampleData, "25000"));
    expect(result.current?.totalTax).toEqual(4500);
  });

  it("should correctly calculate effective tax rate", () => {
    const { result } = renderHook(() => useCalculate(sampleData, "25000"));
    expect(result.current?.effectiveRate).toEqual(0.18);
  });

  it("should return correct tax info for salary within the first tax band", () => {
    const { result } = renderHook(() => useCalculate(sampleData, "5000"));
    expect(result.current).toEqual({
      taxesByBand: [500, 0, 0, 0],
      totalTax: 500,
      effectiveRate: 0.1,
    });
  });

  it("should return correct tax info for salary within the last tax band", () => {
    const { result } = renderHook(() => useCalculate(sampleData, "30000"));
    expect(result.current).toEqual({
      taxesByBand: [1000, 2000, 3000, 0],
      totalTax: 6000,
      effectiveRate: 0.2,
    });
  });

  it("should return correct tax info for salary at the edge of a tax band", () => {
    const { result } = renderHook(() => useCalculate(sampleData, "20000"));
    expect(result.current).toEqual({
      taxesByBand: [1000, 2000, 0, 0],
      totalTax: 3000,
      effectiveRate: 0.15,
    });
  });
});

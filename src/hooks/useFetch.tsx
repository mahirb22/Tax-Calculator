import { useState, useCallback } from "react";
import { toast } from "react-toastify";

interface FetchResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  fetchData: () => Promise<void>;
  retries: number;
}

const useFetch = <T,>(url: string): FetchResult<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [retries, setRetries] = useState<number>(0);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const jsonData = await response.json();
      setData(jsonData);
      setRetries(0);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
        if (err.message.includes("500") && retries < 3) {
          // Retry after 5 seconds
          setTimeout(() => fetchData(), 5000);
          // Update the retries count
          setRetries((retries) => retries + 1);
        } else {
          toast.error("Please Check the Request");
        }
      } else {
        setError("An unknown error occurred");
        // Show a generic error toast
        toast.error("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  }, [url, retries]);

  return { data, loading, error, fetchData, retries };
};

export default useFetch;

import { useCallback, useEffect, useState } from "react";

const useAsyncData = (fetcher, deps = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const run = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const result = await fetcher();
      setData(result);
      return result;
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || "Something went wrong";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, deps);

  useEffect(() => {
    run().catch(() => null);
  }, [run]);

  return {
    data,
    loading,
    error,
    refetch: run,
    setData,
  };
};

export default useAsyncData;

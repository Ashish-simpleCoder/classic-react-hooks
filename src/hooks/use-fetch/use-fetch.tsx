import { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";

interface UseFetchResponse<TData> {
  data: TData | null;
  isLoading: boolean;
  error: Error | null;
  fetchData: (url: string, headers?: Record<string, string>) => Promise<void>;
}

export default function useFetch<TData = unknown>(
  url?: string,
  headers?: Record<string, string>
): UseFetchResponse<TData> {
  const [data, setData] = useState<TData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [abortReq, setAbortReq] = useState<AbortController | null>(null);

  useEffect(() => {
    if (url && headers) {
      fetchData(url, headers);
    } else {
      url && fetchData(url);
    }
  }, [url]);

  useEffect(() => {
    return () => {
      if (abortReq) abortReq.abort();
    };
  }, [abortReq]);

  const fetchData = async (url: string, headers?: Record<string, string>) => {
    setIsLoading(true);

    try {
      const abortController = new AbortController();
      setAbortReq(abortController);

      const signal = abortController.signal;
      const response: AxiosResponse<TData> = await axios.get(url, {
        headers,
        signal,
      });

      const data = response.data;
      setData(data);
    } catch (error) {
      setError(error as Error);
    } finally {
      setIsLoading(false);
    }
  };

  return { data, isLoading, error, fetchData };
}

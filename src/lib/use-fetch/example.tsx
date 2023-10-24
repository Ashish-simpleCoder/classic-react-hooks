import React, { useCallback } from "react";
import useFetch from "./use-fetch";

interface Todo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

export default function Example() {
  // You have 4 options for fetching data, and the code is commented accordingly.

  // Option 1: Fetch data on component mount using the useFetch hook.
  // const { isLoading, data, error } = useFetch<Todo>("https://jsonplaceholder.typicode.com/todos/1");

  // Option 2: Pass headers to the useFetch hook.
  // const { isLoading, data, error } = useFetch<Todo>("https://jsonplaceholder.typicode.com/todos/1", {
  //   "Content-Type": "application/json",
  // });

  // Option 3: Fetch data manually by leaving the URL argument empty.
  const { isLoading, data, error, fetchData } = useFetch<Todo>();
  const handleDataFetch = useCallback(() => {
    fetchData("https://jsonplaceholder.typicode.com/todos/1");
  }, [fetchData]);

  // Option 4: Pass headers to the fetchData function.
  // const { isLoading, data, error, fetchData } = useFetch<Todo>();
  // const handleDataFetch = useCallback(() => {
  //   fetchData("https://jsonplaceholder.typicode.com/todos/1", {
  //     "Content-Type": "application/json",
  //   });
  // }, [fetchData]);

  return (
    <div>
      {/* Clicking this button triggers the manual data fetch. */}
      <div className="px-3 py-2 rounded-md bg-gray-200 dark:bg-gray-800 w-max cursor-pointer" onClick={handleDataFetch}>
        Fetch Data
      </div>

      {/* Display loading, error, or fetched data based on the state. */}
      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error.message}</p>
      ) : data ? (
        <pre>{JSON.stringify(data, null, 2)}</pre>
      ) : null}
    </div>
  );
}

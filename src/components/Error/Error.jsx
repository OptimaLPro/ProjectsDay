import React, { useEffect, useState } from "react";

const Error = () => {
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // Simulate fetching error message from an API
    const fetchError = async () => {
      try {
        // Replace with your actual API call
        const response = await fetch("/api/error");
        const data = await response.json();
        setErrorMessage(data.message || "An unknown error occurred.");
      } catch (error) {
        setErrorMessage("Failed to fetch error message.");
      }
    };

    fetchError();
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Error</h1>
      <p>{errorMessage}</p>
    </div>
  );
};

export default Error;

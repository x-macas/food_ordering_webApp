import React, { useEffect } from "react";

function GoogleAuth() {
  const handleGoogleRedirect = async () => {
    try {
      const response = await fetch(
        "https://dipteshs-food-ordering-webapp.onrender.com/api/auth/google/webomato",
        { method: "GET", credentials: "include" } // Include cookies
      );

      if (response.ok) {
        // Handle success, e.g., redirect to the homepage
        window.location.href = "/";
      } else {
        console.error("Error during Google Auth:", response.statusText);
      }
    } catch (error) {
      console.error("Error calling Google Auth:", error);
    }
  };

  useEffect(() => {
    handleGoogleRedirect();
  }, []);

  return <div>Processing Google authentication...</div>;
}

export default GoogleAuth;

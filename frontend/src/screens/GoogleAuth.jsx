import React, { useEffect } from "react";

function GoogleAuth() {
  const handleGoogleRedirect = async () => {

    const currentURL = window.location.href;
    const link2 = "https://dipteshs-food-ordering-webapp.onrender.com/api/auth/google/webomato"
    const baseURL = "https://webomato.netlify.app";

    const suffix = currentURL.replace(baseURL, "");

    const result = link2.replace(/\/$/, "") + suffix;

    const result2 = result.replace('/authgoogle', '');

    try {
      const response = await fetch(
        result2,
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

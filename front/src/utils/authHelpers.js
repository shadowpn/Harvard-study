export const refreshToken = async () => {
    const refresh = localStorage.getItem("refresh");
    if (!refresh) {
      console.error("No refresh token found");
      return null;
    }
  
    try {
      const response = await fetch("http://localhost:8000/api/refresh/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh })
      });
  
      if (!response.ok) {
        console.error("Refresh failed");
        return null;
      }
  
      const data = await response.json();
      localStorage.setItem("access", data.access);
      return data.access;
    } catch (error) {
      console.error("Error refreshing token:", error);
      return null;
    }
  };
  
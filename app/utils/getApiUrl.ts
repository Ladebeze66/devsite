export function getApiUrl() {
    if (typeof window !== "undefined") {
      const isLocalhost =
        window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1" ||
        window.location.hostname.startsWith("192.168.") ||
        window.location.hostname.endsWith(".local");
  
      console.log("🌍 [getApiUrl] Mode CLIENT détecté - URL :", isLocalhost ? "http://localhost:1337" : "https://api.fernandgrascalvet.com");
      return isLocalhost ? "http://localhost:1337" : "https://api.fernandgrascalvet.com";
    }
  
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.fernandgrascalvet.com";
    console.log("🌍 [getApiUrl] Mode SERVEUR détecté - URL :", apiUrl);
    return apiUrl;
  }
  
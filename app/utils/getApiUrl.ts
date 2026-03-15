export function getApiUrl() {
    if (typeof window !== "undefined") {
      const isLocalhost =
        window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1" ||
        window.location.hostname.startsWith("192.168.") ||
        window.location.hostname.endsWith(".local");
  
      // URLs de fallback en cas de problème VPN
      const localUrl = "http://localhost:1337";
      const productionUrls = [
        "https://api.fernandgrascalvet.com",
        "https://fernandgrascalvet.com/api", // Fallback via proxy
      ];
  
      if (isLocalhost) {
        console.log("🌍 [getApiUrl] Mode LOCAL détecté - URL :", localUrl);
        return localUrl;
      }
  
      // En production, utiliser l'URL principale
      const primaryUrl = productionUrls[0];
      console.log("🌍 [getApiUrl] Mode PRODUCTION détecté - URL :", primaryUrl);
      return primaryUrl;
    }
  
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.fernandgrascalvet.com";
    console.log("🌍 [getApiUrl] Mode SERVEUR détecté - URL :", apiUrl);
    return apiUrl;
  }
  
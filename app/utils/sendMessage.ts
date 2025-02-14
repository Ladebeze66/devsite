import { getApiUrl } from "./getApiUrl";

export async function sendMessage(name: string, email: string, message: string) {
  const dateTime = new Date().toLocaleString("fr-FR", { timeZone: "Europe/Paris" });

  const messageWithDate = `${message}\n\n📅 Envoyé le : ${dateTime}`;

  console.log("📨 Envoi du message...", { name, email, messageWithDate });

  const apiUrl = getApiUrl();

  const res = await fetch(`${apiUrl}/api/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      data: {  
        name: name,
        email: email,
        message: messageWithDate,
      },
    }),
  });

  const responseData = await res.json();

  if (!res.ok) {
    console.error("❌ Erreur API Strapi :", responseData);
    throw new Error(`Échec de l'envoi du message: ${responseData.error.message}`);
  }

  console.log("✅ Message envoyé avec succès !", responseData);
  return responseData;
}

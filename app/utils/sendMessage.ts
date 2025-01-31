// Fonction pour envoyer un message à l'API Strapi
export async function sendMessage(name: string, email: string, message: string) {
  // Formatage de la date et de l'heure en français
  const dateTime = new Date().toLocaleString("fr-FR", { timeZone: "Europe/Paris" }); // ✅ Date formatée en français

  // Ajout de la date à la fin du message
  const messageWithDate = `${message}\n\n📅 Envoyé le : ${dateTime}`; // ✅ Ajout de la date à la fin du message

  // Log des informations du message avant l'envoi
  console.log("📨 Envoi du message...", { name, email, messageWithDate });

  // Envoi du message à l'API Strapi
  const res = await fetch("http://localhost:1337/api/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      data: {  
        name: name,
        email: email,
        message: messageWithDate,  // ✅ Message modifié avec la date
      },
    }),
  });

  // Récupération de la réponse de l'API
  const responseData = await res.json();

  // Gestion des erreurs de l'API
  if (!res.ok) {
    console.error("❌ Erreur API Strapi :", responseData);
    throw new Error(`Échec de l'envoi du message: ${responseData.error.message}`);
  }

  // Log de la réussite de l'envoi du message
  console.log("✅ Message envoyé avec succès !", responseData);
  return responseData;
}
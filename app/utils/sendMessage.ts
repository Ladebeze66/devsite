export async function sendMessage(name: string, email: string, message: string) {
    const dateTime = new Date().toLocaleString("fr-FR", { timeZone: "Europe/Paris" }); // ✅ Date formatée en français
  
    const messageWithDate = `${message}\n\n📅 Envoyé le : ${dateTime}`; // ✅ Ajout de la date à la fin du message
  
    console.log("📨 Envoi du message...", { name, email, messageWithDate });
  
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
  
    const responseData = await res.json();
  
    if (!res.ok) {
      console.error("❌ Erreur API Strapi :", responseData);
      throw new Error(`Échec de l'envoi du message: ${responseData.error.message}`);
    }
  
    console.log("✅ Message envoyé avec succès !", responseData);
    return responseData;
  }
  
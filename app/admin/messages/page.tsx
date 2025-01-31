// Composant principal de la page des messages
export default async function MessagesPage() {
    // Récupération des messages depuis l'API Strapi
    const res = await fetch("http://localhost:1337/api/messages");
    const { data } = await res.json();
  
    return (
      <div className="max-w-3xl mx-auto p-6">
        {/* Titre de la page */}
        <h1 className="text-3xl font-bold text-center mb-6">📬 Messages reçus</h1>
        
        {/* Affichage d'un message si aucun message n'est reçu */}
        {data.length === 0 ? (
          <p className="text-center text-gray-600">Aucun message reçu.</p>
        ) : (
          <ul className="space-y-4">
            {/* Boucle sur les messages pour les afficher */}
            {data.map((msg: any) => (
              <li key={msg.id} className="p-4 border rounded shadow">
                {/* Affichage du nom et de l'email de l'expéditeur */}
                <p><strong>👤 {msg.name}</strong> ({msg.email})</p>
                {/* Affichage de la date de réception du message */}
                <p>📅 {new Date(msg.createdAt).toLocaleString("fr-FR")}</p>
                {/* Affichage du contenu du message */}
                <p className="mt-2">{msg.message}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }
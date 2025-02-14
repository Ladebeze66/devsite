import { getApiUrl } from "../../utils/getApiUrl";
export default async function MessagesPage() {
    const apiUrl = getApiUrl();
    const res = await fetch(`${apiUrl}/api/messages`);
    const { data } = await res.json();
  
    return (
      <div className="bg-white/70 rounded-md max-w-3xl mx-auto p-6">
        {/* Titre de la page */}
        <h1 className="text-3xl font-bold text-center mb-6">📬 Messages reçus</h1>
        
        {data.length === 0 ? (
          <p className="text-center text-gray-600">Aucun message reçu.</p>
        ) : (
          <ul className="space-y-4">
            {data.map((msg: any) => (
              <li key={msg.id} className="p-4 border rounded shadow">
                <p><strong>👤 {msg.name}</strong> ({msg.email})</p>
                <p>📅 {new Date(msg.createdAt).toLocaleString("fr-FR")}</p>
                <p className="mt-2">{msg.message}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }
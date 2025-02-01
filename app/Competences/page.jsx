import Link from "next/link";

// Fonction pour récupérer toutes les compétences depuis l'API Strapi
async function getAllCompetences() {
  try {
    const response = await fetch("http://localhost:1337/api/competences?populate=*");
    if (!response.ok) {
      throw new Error("Failed to fetch competences");
    }
    const competences = await response.json();
    return competences.data;
  } catch (error) {
    console.error("Error fetching competences:", error);
    return [];
  }
}

// Composant principal de la page des compétences
export default async function Page() {
  const competences = await getAllCompetences();

  return (
    <main className="w-full p-6">
      <h1 className="text-3xl mb-6 font-bold text-gray-700">Mes Compétences</h1>

      {/* Grille dynamique pour un affichage équilibré */}
      <div className="grid gap-6 grid-cols-[repeat(auto-fit,minmax(280px,1fr))] max-w-6xl mx-auto">
        {competences.map((competence) => {
          const picture = competence.picture?.[0]; // Récupère la première image si elle existe
          const imageUrl = picture?.url ? `http://localhost:1337${picture.url}` : "/placeholder.jpg";

          return (
            <div key={competence.id} className="bg-white rounded-lg shadow-md overflow-hidden w-72 h-96 flex flex-col">
              <Link href={`/competences/${competence.slug}`}>
                <div className="overflow-hidden w-full h-48">
                  <img
                    src={imageUrl}
                    alt={picture?.name || "Competence image"}
                    className="w-full h-full object-cover object-center"
                  />
                </div>
                <div className="p-4 flex-grow">
                  <p className="font-bold text-xl mb-2">{competence.name}</p>
                  <p className="text-gray-700 text-sm line-clamp-3">{competence.description}</p>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </main>
  );
}

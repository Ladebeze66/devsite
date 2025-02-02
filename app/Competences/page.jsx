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
      <h1 className="text-3xl mb-6 font-bold text-gray-700 text-center">Mes Compétences</h1>

      {/* Grille améliorée avec une meilleure gestion de l'espace */}
      <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(300px,1fr))] max-w-7xl mx-auto">
        {competences.map((competence) => {
          const picture = competence.picture?.[0];
          const imageUrl = picture?.url ? `http://localhost:1337${picture.url}` : "/placeholder.jpg";

          return (
            <div 
              key={competence.id} 
              className="bg-white rounded-lg shadow-md overflow-hidden w-80 h-96 flex flex-col transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              <Link href={`/competences/${competence.slug}`}>
                <div className="overflow-hidden w-full h-48">
                  <img
                    src={imageUrl}
                    alt={picture?.name || "Competence image"}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4 flex-grow">
                  <p className="font-bold text-xl mb-2">{competence.name}</p>
                  <p className="text-gray-700 text-sm hover:text-base transition-all duration-200 ease-in-out">
                    {competence.description}
                  </p>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </main>
  );
}

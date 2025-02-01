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
    <div className="w-full p-6">
      <h1 className="text-3xl mb-6 font-bold text-gray-700">Mes Compétences</h1>

      <div className="grid gap-6 grid-cols-[repeat(auto-fit,minmax(250px,1fr))]">
        {competences.map((competence) => {
          const picture = competence.picture?.[0]; // Récupère la première image si elle existe
          const imageUrl = picture?.url ? `http://localhost:1337${picture.url}` : "/placeholder.jpg";

          return (
            <div key={competence.id} className="bg-white rounded-lg shadow-md overflow-hidden transform transition-transform duration-300 hover:scale-105 hover:shadow-lg hover:bg-blue-100">
              <Link href={`/competences/${competence.slug}`}>
                <div className="overflow-hidden">
                  <img
                    src={imageUrl}
                    alt={picture?.name || "Competence image"}
                    className="w-full h-48 object-cover transform transition-transform duration-300 hover:scale-125 hover:rotate-12"
                  />
                </div>
                <div className="p-4">
                  <p className="font-bold text-xl mb-2">{competence.name}</p>
                  <p className="text-gray-700">{competence.description}</p>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}

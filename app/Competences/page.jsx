import Link from "next/link";

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

export default async function Page() {
  const competences = await getAllCompetences();

  return (
    <div>
      <h1 className="text-3xl mb-6 font-bold text-grey-700">Mes Compétences</h1>
      <div className="grid grid-cols-2 gap-6">
        {competences.map((competence) => {
          const picture = competence.picture?.[0]; // Récupère la première image si elle existe
          const largeImageUrl = picture?.formats?.large?.url; // Vérifie que le format "large" existe
          const originalImageUrl = picture?.url; // URL de l'image originale

          // Utilisez l'URL de l'image originale si disponible, sinon l'URL de l'image large
          const imageUrl = originalImageUrl
            ? `http://localhost:1337${originalImageUrl}`
            : `http://localhost:1337${largeImageUrl}`;

          return (
            <div key={competence.id} className="bg-white rounded-lg shadow-md overflow-hidden transform transition-transform duration-300 hover:scale-105 hover:shadow-lg hover:bg-blue-100">
              <Link href={`/competences/${competence.slug}`}>
                <div className="overflow-hidden">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={picture?.name || "Competence image"}
                      className="w-full h-48 object-cover transform transition-transform duration-300 hover:scale-125 hover:rotate-12"
                    />
                  ) : (
                    <div className="bg-gray-200 text-gray-500 text-center rounded-md shadow-md p-4">
                      Image indisponible
                    </div>
                  )}
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



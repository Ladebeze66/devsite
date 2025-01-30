import Link from "next/link";

async function getAllprojects() {
  try {
    const response = await fetch("http://localhost:1337/api/projects?populate=*");
    if (!response.ok) {
      throw new Error("Failed to fetch projects");
    }
    const projects = await response.json();
    return projects.data;
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
}

export default async function Page() {
  const projects = await getAllprojects();

  return (
    <div>
      <h1 className="text-3xl mb-6 font-bold text-grey-700">Portfolio formation 42</h1>
      <div className="grid grid-cols-2 gap-6">
        {projects.map((project) => {
          const picture = project.picture?.[0]; // Récupère la première image si elle existe
          const largeImageUrl = picture?.formats?.large?.url; // Vérifie que le format "large" existe
          const originalImageUrl = picture?.url; // URL de l'image originale

          // Utilisez l'URL de l'image originale si disponible, sinon l'URL de l'image large
          const imageUrl = originalImageUrl ? `http://localhost:1337${originalImageUrl}` : `http://localhost:1337${largeImageUrl}`;

          return (
            <div key={project.id} className="bg-white rounded-lg shadow-md overflow-hidden transform transition-transform duration-300 hover:scale-105 hover:shadow-lg hover:bg-blue-100">
              <Link href={`/portfolio/${project.slug}`}>
                <div className="overflow-hidden">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={picture?.name || "Project image"}
                      className="w-full h-48 object-cover transform transition-transform duration-300 hover:scale-125 hover:rotate-12"
                    />
                  ) : (
                    <div className="bg-gray-200 text-gray-500 text-center rounded-md shadow-md p-4">
                      Image indisponible
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <p className="font-bold text-xl mb-2">{project.name}</p>
                  <p className="text-gray-700">{project.description}</p>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
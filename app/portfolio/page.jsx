import Link from "next/link";

// Fonction pour récupérer tous les projets depuis l'API Strapi
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

// Composant principal de la page des projets
export default async function Page() {
  const projects = await getAllprojects();

  return (
    <main className="w-full p-6">
      {/* Titre de la page */}
      <h1 className="text-3xl mb-6 font-bold text-gray-700">Portfolio formation 42</h1>

      {/* Grille dynamique pour afficher les projets */}
      <div className="grid gap-6 grid-cols-[repeat(auto-fit,minmax(280px,1fr))] max-w-6xl mx-auto">
        {projects.map((project) => {
          const picture = project.picture?.[0]; // Récupère la première image si elle existe
          const imageUrl = picture?.url ? `http://localhost:1337${picture.url}` : "/placeholder.jpg";

          return (
            <div key={project.id} className="bg-white rounded-lg shadow-md overflow-hidden w-72 h-96 flex flex-col">
              {/* Lien vers la page de détail du projet */}
              <Link href={`/portfolio/${project.slug}`}>
                <div className="overflow-hidden w-full h-48">
                  <img
                    src={imageUrl}
                    alt={picture?.name || "Project image"}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4 flex-grow">
                  <p className="font-bold text-xl mb-2">{project.name}</p>
                  <p className="text-gray-700 text-sm line-clamp-3">{project.description}</p>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </main>
  );
}

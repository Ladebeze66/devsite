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
      <h1 className="text-3xl mb-6 font-bold text-gray-700 text-center">Portfolio formation 42</h1>

      {/* Grille améliorée avec une meilleure largeur et des colonnes plus équilibrées */}
      <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(300px,1fr))] max-w-7xl mx-auto">
        {projects.map((project) => {
          const picture = project.picture?.[0];
          const imageUrl = picture?.url ? `http://localhost:1337${picture.url}` : "/placeholder.jpg";

          return (
            <div 
              key={project.id} 
              className="bg-white rounded-lg shadow-md overflow-hidden w-80 h-96 flex flex-col transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
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
                  <p className="text-gray-700 text-sm hover:text-base transition-all duration-200 ease-in-out">
                    {project.description}
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

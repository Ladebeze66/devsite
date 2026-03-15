const fs = require('fs');
const path = require('path');

// Configuration
const CLEAN_DATA_DIR = './extract/clean-data';
const DOCS_DIR = './docs';

// Créer le dossier de documentation
if (!fs.existsSync(DOCS_DIR)) {
  fs.mkdirSync(DOCS_DIR, { recursive: true });
}

// Fonction utilitaire pour nettoyer le markdown
function cleanMarkdown(text) {
  if (!text) return '';
  return text.trim();
}

// Fonction utilitaire pour créer un nom de fichier sûr
function createSafeFileName(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// Générateurs de documentation par type
const generators = {
  // Générer la documentation des projets
  projects: (projects) => {
    const docs = [];
    
    // 1. Index général des projets
    let indexContent = `# Projets de Fernand Gras-Calvet\n\n`;
    indexContent += `Cette section présente les ${projects.length} projets réalisés dans le cadre de ma formation à l'École 42 et de mon parcours en développement.\n\n`;
    indexContent += `## Liste des projets\n\n`;
    
    projects.forEach((project, index) => {
      indexContent += `${index + 1}. **[${project.name}](${project.slug}.md)** - ${project.description}\n`;
    });
    
    indexContent += `\n## Technologies et compétences développées\n\n`;
    indexContent += `Ces projets couvrent plusieurs domaines clés :\n`;
    indexContent += `- **Programmation système** : Gestion des processus, signaux UNIX, communication inter-processus\n`;
    indexContent += `- **Algorithmes et structures de données** : Tri, piles, optimisation algorithmique\n`;
    indexContent += `- **Programmation concurrente** : Threads, mutex, synchronisation\n`;
    indexContent += `- **Développement web** : Next.js, React, API REST, hébergement\n`;
    indexContent += `- **Réseaux** : TCP/IP, routage, configuration réseau\n\n`;
    
    docs.push({
      filename: '01-projects-index.md',
      content: indexContent
    });
    
    // 2. Documentation détaillée de chaque projet
    projects.forEach(project => {
      let projectContent = `# ${project.name}\n\n`;
      
      // Métadonnées
      projectContent += `**Slug :** \`${project.slug}\`\n`;
      if (project.link) {
        projectContent += `**Lien GitHub :** [${project.link}](${project.link})\n`;
      }
      projectContent += `\n---\n\n`;
      
      // Description courte
      projectContent += `## Description\n\n${project.description}\n\n`;
      
      // Contenu détaillé
      if (project.resum) {
        projectContent += `## Détails du projet\n\n${cleanMarkdown(project.resum)}\n\n`;
      }
      
      // Informations techniques
      projectContent += `## Informations techniques\n\n`;
      projectContent += `- **Langage principal :** C\n`;
      projectContent += `- **École :** 42 Perpignan\n`;
      projectContent += `- **Type :** Projet pédagogique\n`;
      if (project.imageCount > 0) {
        projectContent += `- **Illustrations :** ${project.imageCount} images disponibles\n`;
      }
      
      docs.push({
        filename: `project-${createSafeFileName(project.name)}.md`,
        content: projectContent
      });
    });
    
    return docs;
  },

  // Générer la documentation des compétences
  competences: (competences) => {
    const docs = [];
    
    // 1. Index des compétences
    let indexContent = `# Compétences de Fernand Gras-Calvet\n\n`;
    indexContent += `Cette section présente mes ${competences.length} domaines de compétences principaux.\n\n`;
    
    // Trier par ordre si disponible
    const sortedCompetences = competences.sort((a, b) => {
      if (a.order === null && b.order === null) return 0;
      if (a.order === null) return 1;
      if (b.order === null) return -1;
      return a.order - b.order;
    });
    
    indexContent += `## Domaines d'expertise\n\n`;
    sortedCompetences.forEach((competence, index) => {
      indexContent += `${index + 1}. **[${competence.name}](${competence.slug}.md)**\n`;
    });
    
    docs.push({
      filename: '02-competences-index.md',
      content: indexContent
    });
    
    // 2. Documentation détaillée de chaque compétence
    sortedCompetences.forEach(competence => {
      let competenceContent = `# ${competence.name}\n\n`;
      
      // Métadonnées
      competenceContent += `**Slug :** \`${competence.slug}\`\n`;
      if (competence.order !== null) {
        competenceContent += `**Ordre d'affichage :** ${competence.order}\n`;
      }
      competenceContent += `\n---\n\n`;
      
      // Contenu principal
      if (competence.content) {
        competenceContent += cleanMarkdown(competence.content);
      }
      
      // Informations supplémentaires
      if (competence.imageCount > 0) {
        competenceContent += `\n\n---\n\n*Cette compétence est illustrée par ${competence.imageCount} images sur le site.*`;
      }
      
      docs.push({
        filename: `competence-${createSafeFileName(competence.slug)}.md`,
        content: competenceContent
      });
    });
    
    return docs;
  },

  // Générer la documentation de la homepage
  homepages: (homepages) => {
    const docs = [];
    
    if (homepages.length > 0) {
      const homepage = homepages[0];
      
      let homepageContent = `# ${homepage.title}\n\n`;
      homepageContent += `Cette page présente le profil et la présentation principale de Fernand Gras-Calvet.\n\n`;
      homepageContent += `---\n\n`;
      
      if (homepage.cv) {
        homepageContent += cleanMarkdown(homepage.cv);
      }
      
      if (homepage.hasPhoto) {
        homepageContent += `\n\n---\n\n*Cette page inclut une photo de profil.*`;
      }
      
      docs.push({
        filename: '00-homepage.md',
        content: homepageContent
      });
    }
    
    return docs;
  }
};

// Fonction principale de génération
async function generateAllDocs() {
  console.log('📝 Génération de la documentation...\n');
  
  const allDocs = [];
  const results = [];
  
  // Traiter chaque type de données
  for (const [type, generator] of Object.entries(generators)) {
    try {
      const cleanFile = path.join(CLEAN_DATA_DIR, `${type}-clean.json`);
      
      // Vérifier si le fichier existe
      if (!fs.existsSync(cleanFile)) {
        console.log(`⚠️  ${type}: fichier clean non trouvé, ignoré`);
        continue;
      }
      
      console.log(`🔄 Génération de la documentation pour ${type}...`);
      
      // Lire les données nettoyées
      const cleanData = JSON.parse(fs.readFileSync(cleanFile, 'utf8'));
      
      // Générer la documentation
      const docs = generator(cleanData);
      
      // Sauvegarder chaque document
      let savedCount = 0;
      docs.forEach(doc => {
        const docPath = path.join(DOCS_DIR, doc.filename);
        fs.writeFileSync(docPath, doc.content, 'utf8');
        savedCount++;
      });
      
      console.log(`✅ ${type}: ${docs.length} fichiers de documentation générés`);
      
      allDocs.push(...docs);
      results.push({
        type,
        success: true,
        itemCount: cleanData.length,
        docCount: docs.length,
        files: docs.map(d => d.filename)
      });
      
    } catch (error) {
      console.error(`❌ Erreur lors de la génération pour ${type}:`, error.message);
      results.push({
        type,
        success: false,
        error: error.message
      });
    }
  }
  
  // Générer un index général
  let masterIndex = `# Documentation complète - Fernand Gras-Calvet\n\n`;
  masterIndex += `Cette documentation a été générée automatiquement à partir des données Strapi.\n\n`;
  masterIndex += `**Généré le :** ${new Date().toLocaleString('fr-FR')}\n\n`;
  masterIndex += `## Structure de la documentation\n\n`;
  
  const successfulResults = results.filter(r => r.success);
  successfulResults.forEach(result => {
    masterIndex += `### ${result.type.charAt(0).toUpperCase() + result.type.slice(1)}\n`;
    masterIndex += `- ${result.itemCount} éléments source\n`;
    masterIndex += `- ${result.docCount} fichiers générés\n`;
    masterIndex += `- Fichiers : ${result.files.join(', ')}\n\n`;
  });
  
  masterIndex += `## Utilisation pour base vectorielle\n\n`;
  masterIndex += `Ces fichiers Markdown sont optimisés pour l'intégration dans une base de connaissances vectorielle :\n`;
  masterIndex += `- Contenu textuel uniquement (pas d'images)\n`;
  masterIndex += `- Structure hiérarchique claire\n`;
  masterIndex += `- Métadonnées préservées\n`;
  masterIndex += `- Format Markdown standard\n\n`;
  
  fs.writeFileSync(path.join(DOCS_DIR, 'README.md'), masterIndex, 'utf8');
  
  // Résumé final
  console.log('\n📊 Résumé de la génération:');
  console.log('============================');
  
  let totalDocs = 0;
  let totalItems = 0;
  
  results.forEach(result => {
    if (result.success) {
      console.log(`✅ ${result.type}: ${result.docCount} docs (${result.itemCount} éléments)`);
      totalDocs += result.docCount;
      totalItems += result.itemCount;
    } else {
      console.log(`❌ ${result.type}: ${result.error}`);
    }
  });
  
  console.log(`\n🎯 ${totalDocs + 1} fichiers générés au total (+ README.md)`);
  console.log(`📁 Documentation sauvegardée dans ${DOCS_DIR}/`);
  console.log(`🤖 Prêt pour intégration dans votre base vectorielle !`);
  
  // Sauvegarder le résumé
  const summary = {
    generatedAt: new Date().toISOString(),
    results: results,
    totalTypes: Object.keys(generators).length,
    successfulTypes: successfulResults.length,
    totalSourceItems: totalItems,
    totalDocuments: totalDocs + 1
  };
  
  fs.writeFileSync(
    path.join(DOCS_DIR, 'generation-summary.json'),
    JSON.stringify(summary, null, 2),
    'utf8'
  );
  
  console.log('📄 Résumé sauvegardé dans generation-summary.json');
}

// Exécuter le script
generateAllDocs().catch(console.error);
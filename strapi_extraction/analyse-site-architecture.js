const fs = require('fs');
const path = require('path');

// Configuration
const SITE_ROOT = '../'; // Depuis strapi_extraction vers la racine
const DOCS_DIR = './docs';
const OUTPUT_FILE = '99-site-architecture.md';

// Fonction pour lire récursivement les fichiers
function readDirectoryRecursive(dir, extensions = [], maxDepth = 3, currentDepth = 0) {
  const files = [];
  
  if (currentDepth >= maxDepth) return files;
  
  try {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        // Ignorer certains dossiers
        if (['node_modules', '.next', '.git', 'raw-data', 'clean-data', 'docs'].includes(item)) {
          continue;
        }
        files.push(...readDirectoryRecursive(fullPath, extensions, maxDepth, currentDepth + 1));
      } else if (stat.isFile()) {
        const ext = path.extname(item);
        if (extensions.length === 0 || extensions.includes(ext)) {
          files.push({
            path: fullPath,
            relativePath: path.relative(SITE_ROOT, fullPath),
            name: item,
            extension: ext,
            size: stat.size
          });
        }
      }
    }
  } catch (error) {
    console.warn(`Impossible de lire le dossier ${dir}:`, error.message);
  }
  
  return files;
}

// Analyser les pages Next.js
function analyzePages() {
  const pagesDir = path.join(SITE_ROOT, 'app');
  const pages = [];
  
  if (!fs.existsSync(pagesDir)) {
    return pages;
  }
  
  // Rechercher les fichiers page.tsx/page.js
  const pageFiles = readDirectoryRecursive(pagesDir, ['.tsx', '.ts', '.jsx', '.js'], 3)
    .filter(file => file.name.startsWith('page.'));
  
  pageFiles.forEach(file => {
    try {
      const content = fs.readFileSync(file.path, 'utf8');
      const dirName = path.dirname(file.relativePath).replace('app', '').replace(/\\/g, '/');
      const route = dirName === '' ? '/' : dirName;
      
      // Extraire des informations du contenu
      const hasGetData = content.includes('getHomepageData') || content.includes('getProjectsData') || content.includes('getCompetencesData');
      const hasForm = content.includes('form') || content.includes('Form');
      const hasCarousel = content.includes('carousel') || content.includes('Carousel');
      const hasMarkdown = content.includes('ReactMarkdown') || content.includes('markdown');
      
      pages.push({
        route,
        file: file.relativePath,
        hasGetData,
        hasForm,
        hasCarousel,
        hasMarkdown,
        size: file.size
      });
    } catch (error) {
      console.warn(`Erreur lors de l'analyse de ${file.path}:`, error.message);
    }
  });
  
  return pages.sort((a, b) => a.route.localeCompare(b.route));
}

// Analyser les composants
function analyzeComponents() {
  const componentsDir = path.join(SITE_ROOT, 'app/components');
  const components = [];
  
  if (!fs.existsSync(componentsDir)) {
    return components;
  }
  
  const componentFiles = readDirectoryRecursive(componentsDir, ['.tsx', '.ts', '.jsx', '.js'], 2);
  
  componentFiles.forEach(file => {
    try {
      const content = fs.readFileSync(file.path, 'utf8');
      const componentName = path.basename(file.name, path.extname(file.name));
      
      // Analyser le type de composant
      const isLayout = content.includes('children') && (content.includes('header') || content.includes('nav'));
      const isForm = content.includes('form') || content.includes('input') || content.includes('submit');
      const isCarousel = content.includes('carousel') || content.includes('slide') || content.includes('swiper');
      const isCard = content.includes('card') || componentName.toLowerCase().includes('card');
      const usesStrapi = content.includes('apiUrl') || content.includes('populate');
      
      components.push({
        name: componentName,
        file: file.relativePath,
        isLayout,
        isForm,
        isCarousel,
        isCard,
        usesStrapi,
        size: file.size
      });
    } catch (error) {
      console.warn(`Erreur lors de l'analyse de ${file.path}:`, error.message);
    }
  });
  
  return components.sort((a, b) => a.name.localeCompare(b.name));
}

// Analyser les utilitaires
function analyzeUtils() {
  const utilsDir = path.join(SITE_ROOT, 'app/utils');
  const utils = [];
  
  if (!fs.existsSync(utilsDir)) {
    return utils;
  }
  
  const utilFiles = readDirectoryRecursive(utilsDir, ['.tsx', '.ts', '.jsx', '.js'], 2);
  
  utilFiles.forEach(file => {
    try {
      const content = fs.readFileSync(file.path, 'utf8');
      const utilName = path.basename(file.name, path.extname(file.name));
      
      // Analyser le type d'utilitaire
      const isApiUtil = content.includes('fetch') || content.includes('api');
      const isDataUtil = content.includes('populate') || content.includes('strapi');
      const isHelperUtil = content.includes('export function') || content.includes('export const');
      
      utils.push({
        name: utilName,
        file: file.relativePath,
        isApiUtil,
        isDataUtil,
        isHelperUtil,
        size: file.size
      });
    } catch (error) {
      console.warn(`Erreur lors de l'analyse de ${file.path}:`, error.message);
    }
  });
  
  return utils.sort((a, b) => a.name.localeCompare(b.name));
}

// Analyser la configuration
function analyzeConfig() {
  const configs = [];
  
  // Fichiers de configuration à analyser
  const configFiles = [
    'package.json',
    'next.config.js',
    'next.config.mjs',
    'tailwind.config.js',
    'tailwind.config.ts',
    'tsconfig.json',
    'web.config'
  ];
  
  configFiles.forEach(configFile => {
    const configPath = path.join(SITE_ROOT, configFile);
    if (fs.existsSync(configPath)) {
      try {
        const content = fs.readFileSync(configPath, 'utf8');
        let description = '';
        
        switch (configFile) {
          case 'package.json':
            const pkg = JSON.parse(content);
            description = `Dependencies: ${Object.keys(pkg.dependencies || {}).length}, DevDependencies: ${Object.keys(pkg.devDependencies || {}).length}`;
            break;
          case 'web.config':
            description = 'Configuration IIS pour Windows Server';
            break;
          case 'next.config.js':
          case 'next.config.mjs':
            description = 'Configuration Next.js';
            break;
          case 'tailwind.config.js':
          case 'tailwind.config.ts':
            description = 'Configuration Tailwind CSS';
            break;
          case 'tsconfig.json':
            description = 'Configuration TypeScript';
            break;
        }
        
        configs.push({
          file: configFile,
          description,
          size: fs.statSync(configPath).size
        });
      } catch (error) {
        console.warn(`Erreur lors de l'analyse de ${configFile}:`, error.message);
      }
    }
  });
  
  return configs;
}

// Générer la documentation d'architecture
function generateArchitectureDoc() {
  console.log('🏗️  Analyse de l\'architecture du site...\n');
  
  const pages = analyzePages();
  const components = analyzeComponents();
  const utils = analyzeUtils();
  const configs = analyzeConfig();
  
  console.log(`📄 ${pages.length} pages trouvées`);
  console.log(`🧩 ${components.length} composants trouvés`);
  console.log(`🔧 ${utils.length} utilitaires trouvés`);
  console.log(`⚙️  ${configs.length} fichiers de configuration trouvés`);
  
  // Générer le contenu Markdown
  let content = `# Architecture et Navigation - Site Fernand Gras-Calvet\n\n`;
  content += `*Documentation générée automatiquement le ${new Date().toLocaleString('fr-FR')}*\n\n`;
  content += `---\n\n`;
  
  // Vue d'ensemble
  content += `## 🏠 Vue d'ensemble du site\n\n`;
  content += `**Site personnel et portfolio** de Fernand Gras-Calvet, étudiant à l'École 42 Perpignan.\n\n`;
  content += `### Technologies principales\n`;
  content += `- **Frontend :** Next.js, React, TypeScript, Tailwind CSS\n`;
  content += `- **Backend :** Strapi (Headless CMS)\n`;
  content += `- **Hébergement :** Windows Server 2025 + IIS\n`;
  content += `- **Base de données :** PostgreSQL/MySQL\n\n`;
  
  // Structure des pages
  content += `## 📄 Structure des pages (${pages.length} pages)\n\n`;
  if (pages.length > 0) {
    content += `| Route | Fichier | Fonctionnalités |\n`;
    content += `|-------|---------|----------------|\n`;
    
    pages.forEach(page => {
      const features = [];
      if (page.hasGetData) features.push('📊 Données Strapi');
      if (page.hasForm) features.push('📝 Formulaire');
      if (page.hasCarousel) features.push('🎠 Carousel');
      if (page.hasMarkdown) features.push('📝 Markdown');
      
      content += `| \`${page.route}\` | ${page.file} | ${features.join(', ') || 'Page statique'} |\n`;
    });
  } else {
    content += `*Aucune page trouvée dans le dossier app/*\n`;
  }
  content += `\n`;
  
  // Navigation et UX
  content += `## 🧭 Navigation et expérience utilisateur\n\n`;
  content += `### Sections principales\n`;
  content += `1. **Accueil** (\`/\`) - Présentation personnelle et CV\n`;
  content += `2. **Projets** - Portfolio des projets École 42\n`;
  content += `3. **Compétences** - Domaines d'expertise (IA, Web, 3D, Domotique)\n`;
  content += `4. **Contact** - Formulaire de contact\n\n`;
  
  content += `### Fonctionnalités interactives\n`;
  const hasCarousel = pages.some(p => p.hasCarousel) || components.some(c => c.isCarousel);
  const hasForm = pages.some(p => p.hasForm) || components.some(c => c.isForm);
  
  if (hasCarousel) content += `- 🎠 **Carousel d'images** pour présenter les projets\n`;
  if (hasForm) content += `- 📝 **Formulaire de contact** interactif\n`;
  content += `- 🔍 **Glossaire interactif** avec détection automatique de mots-clés\n`;
  content += `- 📱 **Design responsive** adaptatif\n`;
  content += `- ⚡ **Chargement rapide** grâce à Next.js\n\n`;
  
  // Composants
  if (components.length > 0) {
    content += `## 🧩 Composants React (${components.length} composants)\n\n`;
    
    const layoutComponents = components.filter(c => c.isLayout);
    const formComponents = components.filter(c => c.isForm);
    const carouselComponents = components.filter(c => c.isCarousel);
    const cardComponents = components.filter(c => c.isCard);
    const strapiComponents = components.filter(c => c.usesStrapi);
    
    if (layoutComponents.length > 0) {
      content += `### 🏗️ Composants de mise en page\n`;
      layoutComponents.forEach(comp => {
        content += `- **${comp.name}** - Layout principal avec navigation\n`;
      });
      content += `\n`;
    }
    
    if (strapiComponents.length > 0) {
      content += `### 📊 Composants connectés à Strapi\n`;
      strapiComponents.forEach(comp => {
        content += `- **${comp.name}** - Récupère et affiche des données du CMS\n`;
      });
      content += `\n`;
    }
    
    if (formComponents.length > 0) {
      content += `### 📝 Composants de formulaire\n`;
      formComponents.forEach(comp => {
        content += `- **${comp.name}** - Gestion des saisies utilisateur\n`;
      });
      content += `\n`;
    }
    
    if (carouselComponents.length > 0) {
      content += `### 🎠 Composants de carousel\n`;
      carouselComponents.forEach(comp => {
        content += `- **${comp.name}** - Affichage rotatif d'images\n`;
      });
      content += `\n`;
    }
  }
  
  // Utilitaires
  if (utils.length > 0) {
    content += `## 🔧 Utilitaires et helpers (${utils.length} fichiers)\n\n`;
    
    const apiUtils = utils.filter(u => u.isApiUtil);
    const dataUtils = utils.filter(u => u.isDataUtil);
    
    if (apiUtils.length > 0) {
      content += `### 🌐 Utilitaires API\n`;
      apiUtils.forEach(util => {
        content += `- **${util.name}** - Gestion des appels API\n`;
      });
      content += `\n`;
    }
    
    if (dataUtils.length > 0) {
      content += `### 📊 Utilitaires de données\n`;
      dataUtils.forEach(util => {
        content += `- **${util.name}** - Traitement des données Strapi\n`;
      });
      content += `\n`;
    }
  }
  
  // Flux de données
  content += `## 🔄 Flux de données\n\n`;
  content += `### Architecture Headless CMS\n`;
  content += `1. **Strapi** (Backend) stocke le contenu\n`;
  content += `2. **API REST** expose les données (\`/api/projects\`, \`/api/competences\`, etc.)\n`;
  content += `3. **Next.js** (Frontend) récupère et affiche les données\n`;
  content += `4. **Génération statique** pour les performances\n\n`;
  
  content += `### Endpoints Strapi utilisés\n`;
  content += `- \`/api/homepages?populate=*\` - Contenu de la page d'accueil\n`;
  content += `- \`/api/projects?populate=*\` - Liste des projets (17 projets)\n`;
  content += `- \`/api/competences?populate=*\` - Compétences (4 domaines)\n`;
  content += `- \`/api/messages\` - Messages du formulaire de contact\n\n`;
  
  // Configuration
  if (configs.length > 0) {
    content += `## ⚙️ Configuration et déploiement\n\n`;
    configs.forEach(config => {
      content += `- **${config.file}** - ${config.description}\n`;
    });
    content += `\n`;
  }
  
  // Guide pour le chatbot
  content += `## 🤖 Guide pour l'assistant IA\n\n`;
  content += `### Comment guider les visiteurs\n`;
  content += `- **Page d'accueil** : Présentation générale, CV, parcours\n`;
  content += `- **Section Projets** : Portfolio technique, projets École 42\n`;
  content += `- **Section Compétences** : Expertise IA, développement web, impression 3D, domotique\n`;
  content += `- **Formulaire de contact** : Pour prendre contact directement\n\n`;
  
  content += `### Phrases d'orientation suggérées\n`;
  content += `- *"Vous pouvez consulter mes projets dans la section dédiée"*\n`;
  content += `- *"Ma présentation complète se trouve sur la page d'accueil"*\n`;
  content += `- *"Pour en savoir plus sur mes compétences en [domaine], consultez la section Compétences"*\n`;
  content += `- *"N'hésitez pas à me contacter via le formulaire de contact"*\n\n`;
  
  // Métadonnées techniques
  content += `---\n\n`;
  content += `*Analyse générée automatiquement - ${pages.length} pages, ${components.length} composants, ${utils.length} utilitaires analysés*`;
  
  // Sauvegarder le fichier
  const outputPath = path.join(DOCS_DIR, OUTPUT_FILE);
  fs.writeFileSync(outputPath, content, 'utf8');
  
  console.log(`\n✅ Documentation d'architecture générée : ${OUTPUT_FILE}`);
  console.log(`📁 Sauvegardée dans : ${outputPath}`);
  console.log(`📊 ${content.length} caractères de documentation générés`);
  
  return {
    pages: pages.length,
    components: components.length,
    utils: utils.length,
    configs: configs.length,
    outputFile: OUTPUT_FILE,
    contentLength: content.length
  };
}

// Exécuter l'analyse
generateArchitectureDoc().catch(console.error);
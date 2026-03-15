const fs = require('fs');
const path = require('path');

// Configuration
const API_BASE_URL = 'https://api.fernandgrascalvet.com/api';
const OUTPUT_DIR = './extract/raw';

// Endpoints à extraire
const ENDPOINTS = [
  { name: 'projects', url: '/projects?populate=*' },
  { name: 'competences', url: '/competences?populate=*' },
  { name: 'homepages', url: '/homepages?populate=*' }
];

// Créer le dossier de sortie s'il n'existe pas
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Fonction pour extraire les données d'un endpoint
async function extractEndpoint(endpoint) {
  try {
    console.log(`🔄 Extraction de ${endpoint.name}...`);
    
    const response = await fetch(`${API_BASE_URL}${endpoint.url}`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Sauvegarder dans un fichier JSON
    const filename = `${endpoint.name}-raw.json`;
    const filepath = path.join(OUTPUT_DIR, filename);
    
    fs.writeFileSync(filepath, JSON.stringify(data, null, 2), 'utf8');
    
    console.log(`✅ ${endpoint.name}: ${data.data?.length || 1} éléments sauvegardés dans ${filename}`);
    
    return {
      endpoint: endpoint.name,
      success: true,
      count: data.data?.length || 1,
      file: filename
    };
    
  } catch (error) {
    console.error(`❌ Erreur lors de l'extraction de ${endpoint.name}:`, error.message);
    
    return {
      endpoint: endpoint.name,
      success: false,
      error: error.message
    };
  }
}

// Fonction principale
async function extractAllData() {
  console.log('🚀 Début de l\'extraction des données Strapi...\n');
  
  const results = [];
  
  // Extraire chaque endpoint
  for (const endpoint of ENDPOINTS) {
    const result = await extractEndpoint(endpoint);
    results.push(result);
    
    // Pause entre les requêtes pour éviter de surcharger l'API
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  // Résumé final
  console.log('\n📊 Résumé de l\'extraction:');
  console.log('================================');
  
  let totalSuccess = 0;
  let totalItems = 0;
  
  results.forEach(result => {
    if (result.success) {
      console.log(`✅ ${result.endpoint}: ${result.count} éléments`);
      totalSuccess++;
      totalItems += result.count;
    } else {
      console.log(`❌ ${result.endpoint}: ${result.error}`);
    }
  });
  
  console.log(`\n🎯 ${totalSuccess}/${ENDPOINTS.length} endpoints extraits avec succès`);
  console.log(`📁 ${totalItems} éléments au total sauvegardés dans ${OUTPUT_DIR}/`);
  
  // Sauvegarder un fichier de résumé
  const summary = {
    extractedAt: new Date().toISOString(),
    results: results,
    totalEndpoints: ENDPOINTS.length,
    successfulEndpoints: totalSuccess,
    totalItems: totalItems
  };
  
  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'extraction-summary.json'), 
    JSON.stringify(summary, null, 2), 
    'utf8'
  );
  
  console.log('📄 Résumé sauvegardé dans extraction-summary.json');
}

// Exécuter le script
extractAllData().catch(console.error);
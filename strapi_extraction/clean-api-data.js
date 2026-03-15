const fs = require('fs');
const path = require('path');

// Configuration
const RAW_DATA_DIR = './extract/raw';
const CLEAN_DATA_DIR = './extract/clean-data';

// Créer le dossier de sortie
if (!fs.existsSync(CLEAN_DATA_DIR)) {
  fs.mkdirSync(CLEAN_DATA_DIR, { recursive: true });
}

// Fonctions de nettoyage par type de contenu
const cleaners = {
  // Nettoyer les projets - garder seulement l'essentiel
  projects: (data) => {
    return data.data.map(project => ({
      id: project.id,
      name: project.name,
      description: project.description,
      slug: project.slug,
      resum: project.Resum, // Contenu détaillé principal
      link: project.link,
      order: project.order,
      // Garder seulement le nombre d'images (pour info)
      imageCount: project.picture ? project.picture.length : 0
    }));
  },

  // Nettoyer les compétences
  competences: (data) => {
    return data.data.map(competence => ({
      id: competence.id,
      name: competence.name,
      content: competence.content, // Contenu principal
      slug: competence.slug,
      order: competence.order,
      imageCount: competence.picture ? competence.picture.length : 0
    }));
  },

  // Nettoyer les messages (optionnel pour documentation)
  messages: (data) => {
    return data.data.map(message => ({
      id: message.id,
      name: message.name,
      email: message.email,
      message: message.message,
      // Extraire juste la date du message si présente
      sentDate: extractDateFromMessage(message.message)
    }));
  }
};

// Fonction utilitaire pour extraire la date des messages
function extractDateFromMessage(messageText) {
  const dateMatch = messageText.match(/📅 Envoyé le : (.+)/);
  return dateMatch ? dateMatch[1] : null;
}

// Fonction principale de nettoyage
async function cleanAllData() {
  console.log('🧹 Début du nettoyage des données...\n');
  
  const results = [];
  
  // Traiter chaque type de données
  for (const [type, cleaner] of Object.entries(cleaners)) {
    try {
      const rawFile = path.join(RAW_DATA_DIR, `${type}-raw.json`);
      
      // Vérifier si le fichier existe
      if (!fs.existsSync(rawFile)) {
        console.log(`⚠️  ${type}: fichier raw non trouvé, ignoré`);
        continue;
      }
      
      console.log(`🔄 Nettoyage de ${type}...`);
      
      // Lire les données brutes
      const rawData = JSON.parse(fs.readFileSync(rawFile, 'utf8'));
      
      // Nettoyer les données
      const cleanData = cleaner(rawData);
      
      // Calculer la réduction de taille
      const rawSize = fs.statSync(rawFile).size;
      const cleanJson = JSON.stringify(cleanData, null, 2);
      const cleanSize = Buffer.byteLength(cleanJson, 'utf8');
      const reduction = ((rawSize - cleanSize) / rawSize * 100).toFixed(1);
      
      // Sauvegarder les données nettoyées
      const cleanFile = path.join(CLEAN_DATA_DIR, `${type}-clean.json`);
      fs.writeFileSync(cleanFile, cleanJson, 'utf8');
      
      console.log(`✅ ${type}: ${cleanData.length} éléments nettoyés`);
      console.log(`   📦 Taille réduite de ${reduction}% (${rawSize} → ${cleanSize} bytes)`);
      
      results.push({
        type,
        success: true,
        itemCount: cleanData.length,
        rawSize,
        cleanSize,
        reduction: `${reduction}%`
      });
      
    } catch (error) {
      console.error(`❌ Erreur lors du nettoyage de ${type}:`, error.message);
      results.push({
        type,
        success: false,
        error: error.message
      });
    }
  }
  
  // Résumé final
  console.log('\n📊 Résumé du nettoyage:');
  console.log('=========================');
  
  let totalRawSize = 0;
  let totalCleanSize = 0;
  let successCount = 0;
  
  results.forEach(result => {
    if (result.success) {
      console.log(`✅ ${result.type}: ${result.itemCount} éléments (${result.reduction} de réduction)`);
      totalRawSize += result.rawSize;
      totalCleanSize += result.cleanSize;
      successCount++;
    } else {
      console.log(`❌ ${result.type}: ${result.error}`);
    }
  });
  
  const totalReduction = ((totalRawSize - totalCleanSize) / totalRawSize * 100).toFixed(1);
  
  console.log(`\n🎯 ${successCount}/${Object.keys(cleaners).length} types nettoyés avec succès`);
  console.log(`📦 Réduction totale: ${totalReduction}% (${totalRawSize} → ${totalCleanSize} bytes)`);
  console.log(`📁 Données nettoyées sauvegardées dans ${CLEAN_DATA_DIR}/`);
  
  // Sauvegarder le résumé
  const summary = {
    cleanedAt: new Date().toISOString(),
    results: results,
    totalTypes: Object.keys(cleaners).length,
    successfulTypes: successCount,
    totalReduction: `${totalReduction}%`,
    rawSize: totalRawSize,
    cleanSize: totalCleanSize
  };
  
  fs.writeFileSync(
    path.join(CLEAN_DATA_DIR, 'cleaning-summary.json'),
    JSON.stringify(summary, null, 2),
    'utf8'
  );
  
  console.log('📄 Résumé sauvegardé dans cleaning-summary.json');
}

// Exécuter le script
cleanAllData().catch(console.error);
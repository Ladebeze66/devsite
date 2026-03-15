const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const SCRIPTS_DIR = './';
const LOG_FILE = './logs/update-documentation.log';

// Liste des scripts à exécuter dans l'ordre
const SCRIPTS_SEQUENCE = [
  {
    name: 'extract-api-data.js',
    description: '🔄 Extraction des données Strapi',
    timeout: 30000 // 30 secondes
  },
  {
    name: 'clean-api-data.js',
    description: '🧹 Nettoyage des données',
    timeout: 10000 // 10 secondes
  },
  {
    name: 'generate-docs.js',
    description: '📝 Génération de la documentation',
    timeout: 15000 // 15 secondes
  },
  {
    name: 'analyse-site-architecture.js',
    description: '🏗️ Analyse de l\'architecture',
    timeout: 20000 // 20 secondes
  }
];

// Créer le dossier de logs
const logsDir = path.dirname(LOG_FILE);
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Fonction pour logger avec timestamp
function log(message, isError = false) {
  const timestamp = new Date().toLocaleString('fr-FR');
  const logMessage = `[${timestamp}] ${message}\n`;
  
  // Afficher dans la console
  if (isError) {
    console.error(message);
  } else {
    console.log(message);
  }
  
  // Écrire dans le fichier de log
  fs.appendFileSync(LOG_FILE, logMessage, 'utf8');
}

// Fonction pour exécuter un script
function executeScript(scriptConfig) {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(SCRIPTS_DIR, scriptConfig.name);
    
    // Vérifier que le script existe
    if (!fs.existsSync(scriptPath)) {
      const error = `❌ Script non trouvé: ${scriptPath}`;
      log(error, true);
      reject(new Error(error));
      return;
    }
    
    log(`${scriptConfig.description}...`);
    log(`   📄 Exécution de: ${scriptConfig.name}`);
    
    // Lancer le script
    const child = spawn('node', [scriptConfig.name], {
      cwd: SCRIPTS_DIR,
      stdio: ['pipe', 'pipe', 'pipe']
    });
    
    let stdout = '';
    let stderr = '';
    
    // Capturer la sortie standard
    child.stdout.on('data', (data) => {
      const output = data.toString();
      stdout += output;
      // Afficher en temps réel (optionnel)
      process.stdout.write(`   ${output}`);
    });
    
    // Capturer les erreurs
    child.stderr.on('data', (data) => {
      const error = data.toString();
      stderr += error;
      process.stderr.write(`   ❌ ${error}`);
    });
    
    // Gérer la fin du processus
    child.on('close', (code) => {
      if (code === 0) {
        log(`   ✅ ${scriptConfig.name} terminé avec succès`);
        resolve({
          script: scriptConfig.name,
          success: true,
          stdout,
          stderr,
          exitCode: code
        });
      } else {
        const error = `   ❌ ${scriptConfig.name} a échoué (code: ${code})`;
        log(error, true);
        if (stderr) log(`   Erreur: ${stderr}`, true);
        reject(new Error(error));
      }
    });
    
    // Gérer les erreurs de lancement
    child.on('error', (error) => {
      const errorMsg = `   ❌ Erreur lors du lancement de ${scriptConfig.name}: ${error.message}`;
      log(errorMsg, true);
      reject(new Error(errorMsg));
    });
    
    // Timeout de sécurité
    const timeout = setTimeout(() => {
      child.kill('SIGTERM');
      const timeoutMsg = `   ⏰ Timeout: ${scriptConfig.name} a dépassé ${scriptConfig.timeout}ms`;
      log(timeoutMsg, true);
      reject(new Error(timeoutMsg));
    }, scriptConfig.timeout);
    
    // Nettoyer le timeout si le processus se termine normalement
    child.on('close', () => {
      clearTimeout(timeout);
    });
  });
}

// Fonction principale
async function updateDocumentation() {
  const startTime = Date.now();
  
  // Initialiser le log
  log('🚀 Début de la mise à jour de la documentation');
  log('='.repeat(50));
  
  const results = [];
  let successCount = 0;
  
  try {
    // Exécuter chaque script dans l'ordre
    for (let i = 0; i < SCRIPTS_SEQUENCE.length; i++) {
      const script = SCRIPTS_SEQUENCE[i];
      
      log(`\n📋 Étape ${i + 1}/${SCRIPTS_SEQUENCE.length}: ${script.description}`);
      
      try {
        const result = await executeScript(script);
        results.push(result);
        successCount++;
        
        // Petite pause entre les scripts
        if (i < SCRIPTS_SEQUENCE.length - 1) {
          log('   ⏸️  Pause de 2 secondes...');
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
        
      } catch (error) {
        results.push({
          script: script.name,
          success: false,
          error: error.message
        });
        
        // Décider si on continue ou on s'arrête
        log(`\n❓ Échec de l'étape ${i + 1}. Continuer quand même ? (Les étapes suivantes pourraient échouer)`);
        
        // Pour l'automatisation, on continue mais on note l'erreur
        log('   ⚠️  Continuation automatique malgré l\'erreur...');
      }
    }
    
  } catch (error) {
    log(`❌ Erreur critique: ${error.message}`, true);
  }
  
  // Résumé final
  const endTime = Date.now();
  const duration = Math.round((endTime - startTime) / 1000);
  
  log('\n' + '='.repeat(50));
  log('📊 RÉSUMÉ DE LA MISE À JOUR');
  log('='.repeat(50));
  
  results.forEach((result, index) => {
    const stepNum = index + 1;
    if (result.success) {
      log(`✅ Étape ${stepNum}: ${result.script} - Succès`);
    } else {
      log(`❌ Étape ${stepNum}: ${result.script} - Échec`, true);
      if (result.error) {
        log(`   Erreur: ${result.error}`, true);
      }
    }
  });
  
  log(`\n🎯 ${successCount}/${SCRIPTS_SEQUENCE.length} étapes réussies`);
  log(`⏱️  Durée totale: ${duration} secondes`);
  
  if (successCount === SCRIPTS_SEQUENCE.length) {
    log('🎉 Mise à jour terminée avec succès !');
    log('📁 Documentation mise à jour dans ./docs/');
    
    // Compter les fichiers générés
    const docsDir = './docs';
    if (fs.existsSync(docsDir)) {
      const files = fs.readdirSync(docsDir).filter(f => f.endsWith('.md'));
      log(`📄 ${files.length} fichiers Markdown disponibles`);
    }
    
  } else {
    log('⚠️  Mise à jour terminée avec des erreurs', true);
    log('🔍 Consultez les logs ci-dessus pour plus de détails');
  }
  
  // Sauvegarder un résumé JSON
  const summary = {
    executedAt: new Date().toISOString(),
    duration: `${duration}s`,
    totalSteps: SCRIPTS_SEQUENCE.length,
    successfulSteps: successCount,
    results: results
  };
  
  fs.writeFileSync('./logs/last-update-summary.json', JSON.stringify(summary, null, 2), 'utf8');
  log('📄 Résumé sauvegardé dans ./logs/last-update-summary.json');
  
  return successCount === SCRIPTS_SEQUENCE.length;
}

// Fonction pour afficher l'aide
function showHelp() {
  console.log(`
📚 Script de mise à jour de la documentation
===========================================

Usage: node update-documentation.js [options]

Options:
  --help, -h     Afficher cette aide
  --dry-run      Simuler l'exécution sans lancer les scripts
  --verbose      Mode verbeux avec plus de détails

Séquence d'exécution:
${SCRIPTS_SEQUENCE.map((script, i) => `  ${i + 1}. ${script.description}`).join('\n')}

Fichiers générés:
  - ./docs/*.md                    Documentation Markdown
  - ./logs/update-documentation.log   Log détaillé
  - ./logs/last-update-summary.json   Résumé de la dernière exécution
`);
}

// Gestion des arguments de ligne de commande
const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
  showHelp();
  process.exit(0);
}

if (args.includes('--dry-run')) {
  console.log('🧪 Mode simulation - Aucun script ne sera exécuté');
  SCRIPTS_SEQUENCE.forEach((script, i) => {
    console.log(`${i + 1}. ${script.description} (${script.name})`);
  });
  process.exit(0);
}

// Exécuter la mise à jour
updateDocumentation()
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    log(`💥 Erreur fatale: ${error.message}`, true);
    process.exit(1);
  });
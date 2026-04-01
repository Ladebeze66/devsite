# Guide de Configuration RAGFlow - Site Fernand Gras-Calvet

*Guide mis à jour pour RAGFlow 0.24.0 avec modèles Ollama disponibles*

---

## 🎯 Configuration Hardware Recommandée

### **Setup Optimal :**
- **RTX 4090 (24GB)** : Vectorisation et embedding
- **RTX 2080Ti (11GB)** : Inference LLM pour autonomie
- **Modèles locaux** via Ollama

---

## 📊 Configuration Embedding

### **Modèle Embedding : qwen3-embedding:8b**

```bash
# Installation
ollama pull qwen3-embedding:8b

# Vérification
ollama show qwen3-embedding:8b
```

**Spécifications :**
- **Taille :** 8B paramètres
- **Dimension :** 4096 (à vérifier avec ollama show)
- **Max tokens :** **8192 tokens**
- **Batch size RTX 4090 :** 64-128
- **Performances :** Excellent pour le français et l'anglais

**Configuration RAGFlow :**
```yaml
Model: qwen3-embedding:8b
Max Tokens: 8192
Dimension: 4096
```

---

## 🤖 Configuration Chat Models

### **Pour RTX 4090 (24GB VRAM) :**

```bash
# Recommandé - Équilibre qualité/performance
ollama pull qwen2.5:14b

# Alternative haute qualité (si VRAM suffisante)
ollama pull qwen2.5:32b-q4_0

# Alternative rapide
ollama pull llama3.1:8b
```

### **Pour RTX 2080Ti (11GB VRAM) - Autonomie :**

```bash
# Recommandé pour l'autonomie
ollama pull qwen2.5:7b

# Alternatives fiables
ollama pull llama3.1:7b
ollama pull mistral:7b
```

**Limites de tokens :**
- `qwen2.5:7b/14b` : **32,768 tokens**
- `llama3.1:7b/8b` : **128,000 tokens** (limitez à 16384-32768 pour performance)
- `mistral:7b` : **32,768 tokens**

**Configuration RAGFlow Recommandée :**
```yaml
# Configuration Conservative (Recommandée)
qwen2.5:14b → Max tokens: 16384
qwen2.5:7b → Max tokens: 16384
llama3.1:8b → Max tokens: 16384

# Configuration Performance  
qwen2.5:14b → Max tokens: 32768
llama3.1:8b → Max tokens: 32768

# Configuration Maximum (Attention VRAM)
qwen2.5:14b → Max tokens: 65536
```

---

## 👁️ Configuration VLM (Vision-Language Models)

### **Modèles VLM Recommandés pour RAGFlow :**

#### **Option 1 : Qwen3-VL (Recommandé)**
```bash
# Modèles disponibles par taille
ollama pull qwen3-vl:2b    # Léger, RTX 2080Ti compatible
ollama pull qwen3-vl:4b    # Équilibré
ollama pull qwen3-vl:8b    # Haute qualité, RTX 4090
ollama pull qwen3-vl:32b   # Maximum qualité (si VRAM suffisante)
```

**Spécifications Qwen3-VL :**
- **Versions :** 2B, 4B, 8B, 30B, 32B, 235B
- **Max tokens :** **8192 tokens** (toutes versions)
- **Capacités :** Vision + Language + Tools + Thinking
- **Support :** Images, documents, diagrammes
- **Mise à jour :** Récente (4 mois)

**Configuration RAGFlow :**
```yaml
qwen3-vl:2b → Max tokens: 8192
qwen3-vl:4b → Max tokens: 8192  
qwen3-vl:8b → Max tokens: 8192
```

#### **Option 2 : Llama3.2-Vision**
```bash
ollama pull llama3.2-vision:11b   # Recommandé RTX 4090
ollama pull llama3.2-vision:90b   # Très haute qualité (multi-GPU)
```

**Spécifications Llama3.2-Vision :**
- **Versions :** 11B, 90B
- **Max tokens :** **8192 tokens**
- **Spécialité :** Raisonnement sur images
- **Performance :** Excellent pour l'analyse visuelle

**Configuration RAGFlow :**
```yaml
llama3.2-vision:11b → Max tokens: 8192
llama3.2-vision:90b → Max tokens: 8192
```

#### **Option 3 : MiniCPM-V (Efficace)**
```bash
ollama pull minicpm-v:8b    # Bon compromis performance/qualité
```

**Spécifications MiniCPM-V :**
- **Taille :** 8B paramètres
- **Avantage :** Optimisé pour l'efficacité
- **Usage :** Vision-language understanding

#### **Option 4 : LLaVA (Populaire)**
```bash
ollama pull llava:7b     # Version standard
ollama pull llava:13b    # Plus performant
ollama pull llava:34b    # Haute qualité
```

**Spécifications LLaVA :**
- **Versions :** 7B, 13B, 34B
- **Maturité :** Très stable, bien testé
- **Communauté :** Large adoption

### **Modèles VLM Spécialisés :**

#### **Pour OCR et Documents :**
```bash
# OCR spécialisé
ollama pull deepseek-ocr:3b
ollama pull glm-ocr

# Vision documentaire
ollama pull granite3.2-vision:2b
```

#### **Pour Edge/Léger :**
```bash
# Très léger pour edge computing
ollama pull moondream:1.8b
ollama pull llava-phi3:3.8b
```

### **Recommandations par GPU :**

**RTX 4090 (24GB) :**
- **Optimal :** `qwen3-vl:8b` ou `llama3.2-vision:11b`
- **Haute qualité :** `qwen3-vl:32b`
- **Multi-tâches :** `llava:13b`

**RTX 2080Ti (11GB) :**
- **Recommandé :** `qwen3-vl:4b` ou `minicpm-v:8b`
- **Léger :** `qwen3-vl:2b` ou `moondream:1.8b`
- **OCR :** `deepseek-ocr:3b`

### **Configuration VLM dans RAGFlow :**
```yaml
# VLM Model Settings
Provider: Ollama
Endpoint: http://localhost:11434
Model: qwen3-vl:8b  # Ajustez selon votre GPU
Max tokens: 4096-8192
Temperature: 0.1-0.3
Vision capabilities: Enabled
```

---

## 🔄 Configuration Reranker

### **Modèles Reranker Disponibles sur Ollama :**

#### **Option 1 : BGE Reranker V2-M3 (Recommandé)**
```bash
# Installation via utilisateur communautaire
ollama pull xitao/bge-reranker-v2-m3

# Alternative
ollama pull zyw0605688/bge-reranker-v2-m3
```

**Spécifications :**
- **Taille :** 568M paramètres (1.2GB)
- **Max tokens :** **8192 tokens**
- **Quantification :** F16
- **Performance :** Excellent pour le reranking multilingue

**Configuration RAGFlow :**
```yaml
Model: xitao/bge-reranker-v2-m3
Max tokens: 4096-8192
Top-K rerank: 5-8
```

#### **Option 2 : Jina Reranker V3 (Plus récent)**
```bash
# Télécharger le modèle GGUF depuis Hugging Face
# Puis l'importer dans Ollama (nécessite conversion manuelle)
```

**Spécifications :**
- **Taille :** 597M paramètres
- **Max tokens :** **131,000 tokens** (!!)
- **Langues :** 24 langues entraînées, 93 supportées
- **Performance :** +5.43% vs BGE-reranker-v2-m3

### **Configuration Reranker dans RAGFlow :**
```yaml
Model: xitao/bge-reranker-v2-m3
Max tokens: 8192
Top-K rerank: 5-8
```

---

## 🎯 Guide Max Tokens par Modèle (RTX 4090)

### **📊 Tableau de Référence Max Tokens :**

| Type | Modèle | Max Tokens | Recommandé RAGFlow |
|------|--------|------------|-------------------|
| **Embedding** | qwen3-embedding:8b | 8192 | **8192** |
| | nomic-embed-text | 8192 | **8192** |
| | mxbai-embed-large | 512 | **512** |
| **Chat** | qwen2.5:7b | 32768 | **16384** (démarrage) |
| | qwen2.5:14b | 32768 | **16384** (démarrage) |
| | llama3.1:8b | 131072 | **16384** (performance) |
| | mistral:7b | 32768 | **16384** |
| **VLM** | qwen3-vl:8b | 8192 | **8192** |
| | llama3.2-vision:11b | 8192 | **8192** |
| | minicpm-v:8b | 4096 | **4096** |
| **Reranker** | bge-reranker-v2-m3 | 8192 | **4096** (démarrage) |

### **🚀 Configurations Prédéfinies RTX 4090 :**

#### **Configuration Démarrage (Sécurisée) :**
```yaml
Embedding: 8192 tokens
Chat: 16384 tokens
VLM: 8192 tokens  
Reranker: 4096 tokens
VRAM utilisée: ~18GB
```

#### **Configuration Performance :**
```yaml
Embedding: 8192 tokens
Chat: 32768 tokens
VLM: 8192 tokens
Reranker: 8192 tokens
VRAM utilisée: ~20-22GB
```

#### **Configuration Maximum (Attention) :**
```yaml
Embedding: 8192 tokens
Chat: 65536 tokens
VLM: 16384 tokens
Reranker: 8192 tokens
VRAM utilisée: ~23GB (limite)
```

### **🔍 Comment Vérifier les Limites :**

#### **Méthode 1 : Ollama Show**
```bash
ollama show qwen3-embedding:8b
ollama show qwen2.5:14b
ollama show qwen3-vl:8b
```

#### **Méthode 2 : Test Progressif**
1. **Démarrez conservateur :** 4096 tokens
2. **Augmentez progressivement :** 8192 → 16384 → 32768
3. **Surveillez VRAM :** `nvidia-smi`
4. **Testez stabilité :** Plusieurs requêtes consécutives

### **⚠️ Signaux d'Alerte VRAM :**

**🔴 Trop élevé si :**
- Erreurs "CUDA out of memory"
- Réponses très lentes (>10s)
- `nvidia-smi` montre >22GB utilisés
- RAGFlow plante ou freeze

**🟡 Trop bas si :**
- Réponses tronquées
- Contexte perdu dans conversations longues
- Messages "context length exceeded"

**🟢 Optimal si :**
- Réponses fluides (<5s)
- VRAM stable 18-20GB
- Pas d'erreurs de mémoire
- Contexte préservé

---

## ⚙️ Configuration RAGFlow Interface

### **Étape 1 : Configuration des Modèles**

Dans RAGFlow > Settings > Models :

```yaml
# Embedding Model
Provider: Ollama
Endpoint: http://localhost:11434
Model: qwen3-embedding:8b
Dimension: 4096

# Chat Model
Provider: Ollama  
Endpoint: http://localhost:11434
Model: qwen2.5:14b  # ou 7b selon votre GPU

# Reranker Model
Provider: Ollama
Endpoint: http://localhost:11434
Model: xitao/bge-reranker-v2-m3
```

### **Étape 2 : Configuration Knowledge Base**

```yaml
# Parsing Settings
Parser: Markdown
Chunk size: 512-768 tokens
Chunk overlap: 80-100 tokens
Language: French/English

# Retrieval Settings
Top-K retrieval: 10-15
Rerank Top-K: 5-8
Similarity threshold: 0.7-0.8
```

### **Étape 3 : Configuration Chat**

```yaml
# Generation Settings
Max output tokens: 2048-4096
Temperature: 0.1-0.3 (précision)
Top-p: 0.9
Context window: 8192-16384
```

### **Configuration VLM (Optionnel)**

```yaml
# VLM Settings pour analyse d'images
Model: qwen3-vl:8b
Max tokens: 4096
Vision input: Enabled
Image analysis: Technical diagrams, screenshots, 3D prints
Temperature: 0.2 (précision pour analyse technique)
```

---

## 🚀 Optimisations Performance

### **RTX 4090 (Embedding & Vectorisation) :**
```yaml
Batch size: 64-128
Concurrent requests: 4-8
GPU memory allocation: 20GB
Precision: FP16
```

### **RTX 2080Ti (Chat Inference) :**
```yaml
Batch size: 16-32
Model quantization: Q4_0 ou Q4_K_M
Context length: Adaptatif selon besoin
GPU memory allocation: 9GB
```

---

## 🎨 Cas d'Usage VLM pour votre Site

### **Analyse d'Images Techniques :**
- **Impressions 3D** : Analyse des créations, matériaux, techniques
- **Captures d'écran** : Interface du site, code, configurations
- **Diagrammes** : Architecture système, flux de données
- **Projets visuels** : Screenshots de projets, interfaces

### **Support Visiteurs avec VLM :**
- **"Que vois-tu sur cette image ?"** → Analyse contextuelle
- **"Explique cette impression 3D"** → Description technique
- **"Comment fonctionne cette interface ?"** → Guide utilisateur
- **"Analyse ce code affiché"** → Explication technique

### **Intégration Multimodale :**
```yaml
# Configuration pour site portfolio
Text + Vision: Combine documentation markdown + images
Use cases: 
  - Analyse de captures d'écran du site
  - Description d'impressions 3D
  - Explication de diagrammes techniques
  - Support visuel pour projets
```

---

## 📁 Import de la Documentation

### **Structure à importer :**
```
strapi_extraction/docs/
├── 00-homepage.md                    # Présentation
├── 01-projects-index.md              # Index projets  
├── 02-competences-index.md           # Index compétences
├── 99-site-architecture.md           # Architecture site
├── project-*.md                      # 17 projets détaillés
├── competence-*.md                   # 4 compétences détaillées
└── README.md                         # Vue d'ensemble
```

### **Processus d'import :**
1. **Créer Knowledge Base** : "Site Fernand Gras-Calvet"
2. **Upload en batch** : Tous les fichiers .md
3. **Attendre indexation** : Embedding + chunking
4. **Vérifier chunks** : Dans l'interface RAGFlow
5. **Tester retrieval** : Questions de validation

---

## 🧪 Questions de Test Recommandées

### **Tests de base :**
```
"Quels sont les projets de Fernand ?"
"Parle-moi du projet push_swap en détail"
"Quelles sont ses compétences en intelligence artificielle ?"
"Comment est structuré le site web ?"
```

### **Tests de navigation :**
```
"Comment un visiteur peut-il voir les projets ?"
"Où trouve-t-on les informations sur l'impression 3D ?"
"Comment contacter Fernand ?"
"Quelle est l'architecture technique du site ?"
```

### **Tests de précision :**
```
"Combien de projets École 42 sont présentés ?"
"Quels langages de programmation utilise Fernand ?"
"Sur quel serveur est hébergé le site ?"
"Quelles technologies Next.js sont utilisées ?"
```

### **Tests VLM (si configuré) :**
```
"Analyse cette capture d'écran du site"
"Décris les impressions 3D visibles sur cette image"
"Que vois-tu dans ce diagramme d'architecture ?"
"Explique cette interface de développement"
```

---

## 📈 Monitoring et Optimisation

### **Métriques à surveiller :**
- **Temps de réponse** embedding : < 500ms
- **Temps de réponse** chat : < 3s
- **Précision retrieval** : > 80%
- **Satisfaction reranking** : Top-3 pertinence

### **Ajustements possibles :**
- **Chunk size** selon la précision
- **Similarity threshold** selon le recall
- **Temperature** selon la créativité souhaitée
- **Top-K** selon la diversité des réponses

---

## 🔧 Dépannage Courant

### **Problèmes fréquents :**

**1. Modèle reranker non trouvé :**
```bash
# Vérifier les modèles disponibles
ollama list

# Réinstaller si nécessaire
ollama pull xitao/bge-reranker-v2-m3
```

**2. VRAM insuffisante :**
- Utiliser modèles quantifiés (Q4_0, Q4_K_M)
- Réduire batch size
- Utiliser des modèles plus petits (7B au lieu de 14B)

**3. Réponses imprécises :**
- Ajuster similarity threshold
- Augmenter Top-K retrieval
- Vérifier la qualité des chunks

---

*Guide mis à jour le 15/03/2026 - Compatible RAGFlow 0.24.0*
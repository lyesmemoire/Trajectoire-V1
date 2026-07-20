# Sprint 5 - Secrets Manager

## Overview
Supprimer tous les secrets du code et utiliser un gestionnaire de secrets sécurisé. Prévoir l'intégration avec Vault, Doppler, 1Password, AWS Secrets, Azure, GCP.

## Problème Actuel
Les secrets sont actuellement stockés dans:
- `process.env` (variables d'environnement)
- Fichiers `.env` (non versionnés)
- Code en dur (à éviter absolument)

## Solutions Recommandées

### 1. Doppler (Recommandé pour démarrage)
**Avantages:**
- Simple à mettre en place
- Intégration CI/CD native
- Interface web intuitive
- Support multi-environnements
- Gratuit pour les petits projets

**Installation:**
```bash
# Installer Doppler CLI
npm install -g doppler

# Authentifier
doppler login

# Configurer le projet
doppler setup
```

**Utilisation:**
```bash
# Charger les secrets dans l'environnement
eval $(doppler secrets download --format=env)

# Dans le code
import { config } from 'dotenv';
import { doppler } from 'doppler';

const secrets = await doppler.getSecrets();
```

### 2. HashiCorp Vault (Pour entreprises)
**Avantages:**
- Très sécurisé
- Support multi-cloud
- Rotation automatique des secrets
- Audit complet

**Installation:**
```bash
# Installer Vault
# Utiliser le client Vault pour Node.js
npm install node-vault
```

**Utilisation:**
```typescript
import vault from 'node-vault';

const client = vault({
  endpoint: process.env.VAULT_ADDR,
  token: process.env.VAULT_TOKEN,
});

// Lire un secret
const secret = await client.read('secret/data/trajectoire/database');
const password = secret.data.data.password;
```

### 3. 1Password (Pour équipes)
**Avantages:**
- Interface utilisateur familière
- Intégration avec 1Password existant
- Support multi-plateforme
- CLI robuste

**Installation:**
```bash
# Installer 1Password CLI
# Utiliser op-js
npm install @1password/op-js
```

**Utilisation:**
```typescript
import { OnePassword } from '@1password/op-js';

const op = new OnePassword();
const secret = await op.getItem('Database Credentials', 'Trajectoire');
```

### 4. AWS Secrets Manager (Pour AWS)
**Avantages:**
- Intégration native AWS
- Rotation automatique
- Haute disponibilité
- Scalabilité

**Installation:**
```bash
npm install @aws-sdk/client-secrets-manager
```

**Utilisation:**
```typescript
import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';

const client = new SecretsManagerClient({ region: 'us-east-1' });
const command = new GetSecretValueCommand({ SecretId: 'trajectoire/database' });
const response = await client.send(command);
const secret = JSON.parse(response.SecretString || '{}');
```

### 5. Azure Key Vault (Pour Azure)
**Avantages:**
- Intégration native Azure
- Support HSM (Hardware Security Module)
- Rotation automatique
- Audit complet

**Installation:**
```bash
npm install @azure/keyvault-secrets @azure/identity
```

**Utilisation:**
```typescript
import { DefaultAzureCredential } from '@azure/identity';
import { SecretClient } from '@azure/keyvault-secrets';

const credential = new DefaultAzureCredential();
const client = new SecretClient('https://trajectoire.vault.azure.net', credential);
const secret = await client.getSecret('database-password');
```

### 6. Google Secret Manager (Pour GCP)
**Avantages:**
- Intégration native GCP
- Support IAM
- Rotation automatique
- Audit complet

**Installation:**
```bash
npm install @google-cloud/secret-manager
```

**Utilisation:**
```typescript
import { SecretManagerServiceClient } from '@google-cloud/secret-manager';

const client = new SecretManagerServiceClient();
const [version] = await client.accessSecretVersion({
  name: 'projects/my-project/secrets/database-password/versions/latest',
});
const secret = version.payload.data.toString();
```

## Architecture Recommandée

### Abstraction Layer
Créer une interface unifiée pour les secrets:

```typescript
// src/lib/secrets/SecretsManager.ts
export interface SecretsManager {
  getSecret(key: string): Promise<string>;
  getSecretJson(key: string): Promise<Record<string, any>>;
  setSecret(key: string, value: string): Promise<void>;
  deleteSecret(key: string): Promise<void>;
}

export class DopplerSecretsManager implements SecretsManager {
  // Implementation for Doppler
}

export class VaultSecretsManager implements SecretsManager {
  // Implementation for Vault
}

export class AWSSecretsManager implements SecretsManager {
  // Implementation for AWS Secrets Manager
}
```

### Configuration
```typescript
// src/lib/config/ConfigService.ts
import { SecretsManager } from '@/lib/secrets/SecretsManager';

let secretsManager: SecretsManager;

// Choisir le provider basé sur l'environnement
if (process.env.SECRETS_PROVIDER === 'doppler') {
  secretsManager = new DopplerSecretsManager();
} else if (process.env.SECRETS_PROVIDER === 'vault') {
  secretsManager = new VaultSecretsManager();
} else if (process.env.SECRETS_PROVIDER === 'aws') {
  secretsManager = new AWSSecretsManager();
}
```

## Migration Plan

### Phase 1: Doppler (Immédiat)
1. Créer un compte Doppler
2. Configurer les projets et environnements
3. Migrer les variables d'environnement vers Doppler
4. Mettre à jour le code pour utiliser Doppler
5. Supprimer les fichiers `.env`

### Phase 2: Vault (Si nécessaire)
1. Déployer Vault (ou utiliser Vault Cloud)
2. Configurer les policies
3. Migrer les secrets de Doppler vers Vault
4. Mettre à jour le code pour utiliser Vault
5. Configurer la rotation automatique

### Phase 3: Cloud Native (Si migration vers cloud)
1. Choisir le provider (AWS/Azure/GCP)
2. Migrer les secrets
3. Mettre à jour le code
4. Configurer l'intégration CI/CD

## Bonnes Pratiques

### 1. Jamais de secrets en dur
```typescript
// ❌ MAUVAIS
const apiKey = "sk-1234567890";

// ✅ BON
const apiKey = await secretsManager.getSecret('OPENAI_API_KEY');
```

### 2. Rotation automatique
Configurer la rotation automatique des secrets:
- Clés API
- Mots de passe base de données
- Certificats SSL

### 3. Audit
Logger tous les accès aux secrets:
- Qui a accédé
- Quand
- Quel secret
- Pourquoi

### 4. Principe du moindre privilège
- Limiter l'accès aux secrets
- Utiliser des rôles et permissions
- Révoquer l'accès quand nécessaire

### 5. Secrets temporaires
Utiliser des secrets temporaires quand possible:
- Tokens à courte durée de vie
- Credentials temporaires
- Certificats auto-signés

## Intégration CI/CD

### GitHub Actions
```yaml
- name: Load secrets from Doppler
  run: |
    eval $(doppler secrets download --format=env)
  
- name: Build
  run: npm run build
  env:
    # Les secrets sont maintenant disponibles
    DATABASE_URL: ${{ secrets.DATABASE_URL }}
```

### Docker
```dockerfile
# Utiliser des secrets Docker
RUN --mount=type=secret,id=doppler_token \
    eval $(doppler secrets download --format=env) && \
    npm run build
```

## Sécurité

### 1. Encryption
- Tous les secrets doivent être encryptés au repos
- TLS pour les communications
- Encryption des secrets en transit

### 2. Access Control
- MFA requis pour l'accès
- Audit des accès
- Révocation automatique

### 3. Backup
- Backup encrypté des secrets
- Récupération en cas de disaster
- Test de restauration régulier

## Monitoring

### Alertes
- Accès non autorisé
- Tentatives de rotation échouées
- Secrets expirés
- Secrets non utilisés

### Métriques
- Nombre de secrets
- Fréquence d'accès
- Taux de rotation
- Erreurs d'accès

## Conclusion

Le Secrets Manager garantit:
- ✅ Aucun secret en dur dans le code
- ✅ Rotation automatique des secrets
- ✅ Audit complet des accès
- ✅ Intégration multi-provider
- ✅ Sécurité renforcée
- ✅ Conformité RGPD/PCI-DSS

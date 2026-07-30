# Utilisation de Node 22 LTS (Alpine)
# Idéalement, en production SLSA niveau 4, il faut figer le SHA256 exact :
# FROM node:22-alpine@sha256:<digest>
FROM node:22-alpine

# Alpine possède déjà un utilisateur 'node' avec uid/gid 1000
RUN apk add --no-cache bash git jq

# Variables d'environnement pour la reproductibilité (SLSA / NIST SSDF)
ENV TZ=UTC
ENV LANG=C.UTF-8
ENV LC_ALL=C.UTF-8
ENV NODE_OPTIONS="--random-seed=42"
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# Configuration Corepack pour verrouiller pnpm
RUN corepack enable && corepack prepare pnpm@9.15.9 --activate

# Espace de travail
WORKDIR /workspace
RUN chown -R node:node /workspace /pnpm

# On bascule sur l'utilisateur 'node' (uid 1000)
USER node:node

# Copie des fichiers de configuration pour l'installation des dépendances
COPY --chown=node:node package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Si d'autres fichiers config existent pour le lock (comme .npmrc), on tente de les copier
COPY --chown=node:node .npmrc* ./

# Installation hermétique des dépendances au build (réseau disponible)
# --frozen-lockfile garantit l'exactitude des versions
RUN pnpm install --frozen-lockfile

# Copie du reste du code source
COPY --chown=node:node . .

# Définition du point d'entrée
ENTRYPOINT ["bash", "certification/docker/entrypoint.sh"]

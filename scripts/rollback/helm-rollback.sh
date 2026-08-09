#!/bin/bash

# Helm Rollback Script
# Rolls back a Helm release to a previous version

set -e

# Configuration
RELEASE_NAME=${RELEASE_NAME:-trajectoire}
NAMESPACE=${NAMESPACE:-trajectoire}

echo "Starting Helm rollback for ${RELEASE_NAME} in namespace ${NAMESPACE}"

# Show release history
echo "Release history:"
helm history ${RELEASE_NAME} -n ${NAMESPACE}

# Get current revision
CURRENT_REVISION=$(helm history ${RELEASE_NAME} -n ${NAMESPACE} | grep deployed | tail -1 | awk '{print $1}')
echo "Current revision: ${CURRENT_REVISION}"

# Ask for revision to rollback to
read -p "Enter revision to rollback to (or press Enter to rollback to previous): " REVISION

if [ -z "${REVISION}" ]; then
    echo "Rolling back to previous revision..."
    helm rollback ${RELEASE_NAME} -n ${NAMESPACE}
else
    echo "Rolling back to revision ${REVISION}..."
    helm rollback ${RELEASE_NAME} -n ${NAMESPACE} --revision ${REVISION}
fi

# Wait for rollout to complete
echo "Waiting for rollout to complete..."
helm status ${RELEASE_NAME} -n ${NAMESPACE} --wait

echo "Rollback completed successfully"

#!/bin/bash

# Kubernetes Rollback Script
# Rolls back a Kubernetes deployment to a previous version

set -e

# Configuration
NAMESPACE=${NAMESPACE:-trajectoire}
DEPLOYMENT_NAME=${DEPLOYMENT_NAME:-trajectoire-api}

echo "Starting Kubernetes rollback for ${DEPLOYMENT_NAME} in namespace ${NAMESPACE}"

# Get current revision
CURRENT_REVISION=$(kubectl rollout history deployment/${DEPLOYMENT_NAME} -n ${NAMESPACE} | tail -1 | awk '{print $1}')
echo "Current revision: ${CURRENT_REVISION}"

# Show rollback history
echo "Rollback history:"
kubectl rollout history deployment/${DEPLOYMENT_NAME} -n ${NAMESPACE}

# Ask for revision to rollback to
read -p "Enter revision to rollback to (or press Enter to rollback to previous): " REVISION

if [ -z "${REVISION}" ]; then
    echo "Rolling back to previous revision..."
    kubectl rollout undo deployment/${DEPLOYMENT_NAME} -n ${NAMESPACE}
else
    echo "Rolling back to revision ${REVISION}..."
    kubectl rollout undo deployment/${DEPLOYMENT_NAME} -n ${NAMESPACE} --to-revision=${REVISION}
fi

# Wait for rollout to complete
echo "Waiting for rollout to complete..."
kubectl rollout status deployment/${DEPLOYMENT_NAME} -n ${NAMESPACE} --timeout=5m

echo "Rollback completed successfully"

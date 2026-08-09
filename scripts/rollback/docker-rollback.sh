#!/bin/bash

# Docker Rollback Script
# Rolls back a Docker container to a previous image version

set -e

# Configuration
CONTAINER_NAME=${CONTAINER_NAME:-trajectoire-api}
IMAGE_NAME=${IMAGE_NAME:-trajectoire/api}

echo "Starting Docker rollback for ${CONTAINER_NAME}"

# Show current container info
echo "Current container:"
docker inspect ${CONTAINER_NAME} --format='{{.Config.Image}}' || echo "Container not running"

# List available images
echo "Available images:"
docker images ${IMAGE_NAME} --format "table {{.Repository}}:{{.Tag}}\t{{.CreatedAt}}\t{{.Size}}"

# Ask for image tag to rollback to
read -p "Enter image tag to rollback to: " IMAGE_TAG

if [ -z "${IMAGE_TAG}" ]; then
    echo "Error: Image tag is required"
    exit 1
fi

FULL_IMAGE="${IMAGE_NAME}:${IMAGE_TAG}"

# Check if image exists
if ! docker image inspect ${FULL_IMAGE} >/dev/null 2>&1; then
    echo "Error: Image ${FULL_IMAGE} not found"
    exit 1
fi

# Stop current container
echo "Stopping current container..."
docker stop ${CONTAINER_NAME} || true
docker rm ${CONTAINER_NAME} || true

# Start new container with previous image
echo "Starting container with image ${FULL_IMAGE}..."
docker run -d \
    --name ${CONTAINER_NAME} \
    --restart unless-stopped \
    -p 3000:3000 \
    --env-file .env \
    ${FULL_IMAGE}

echo "Rollback completed successfully"
echo "New container status:"
docker ps --filter name=${CONTAINER_NAME}

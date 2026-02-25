#!/bin/bash
set -e  # зупиняє скрипт при помилці

echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin

cd my-transfer
docker build -t transfer-react .
docker tag transfer-react:latest ellr2/transfer-react:latest
docker push ellr2/transfer-react:latest
echo "Done ---client---!"

cd ..\WebApiTransfer
docker build -t transfer-api .
docker tag transfer-api:latest ellr2/transfer-api:latest
docker push ellr2/transfer-api:latest

echo "Done ---api---!"

read -p "Press any key to exit..."

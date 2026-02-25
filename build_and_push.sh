#!/bin/bash
set -e  # зупиняє скрипт при помилці

cd my-transfer-ts
docker build -t transfer-react .
docker tag transfer-react:latest novakvova/transfer-react:latest
docker push novakvova/transfer-react:latest
echo "Done ---client---!"

cd ..\WebApiTransfer
docker build -t transfer-api .
docker tag transfer-api:latest novakvova/transfer-api:latest
docker push novakvova/transfer-api:latest

echo "Done ---api---!"

read -p "Press any key to exit..."

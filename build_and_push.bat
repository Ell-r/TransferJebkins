@echo off

REM ==== WEB ====
cd my-transfer
docker build -t transfer-react --build-arg VITE_API_BASE_URL=http://3.123.20.53:5898 .
docker tag transfer-react:latest ellr2/transfer-react:latest
docker push ellr2/transfer-react:latest

REM ==== API ====
cd ..\WebApiTransfer
docker build -t transfer-api .
docker tag transfer-api:latest ellr2/transfer-api:latest
docker push ellr2/transfer-api:latest

echo DONE
pause

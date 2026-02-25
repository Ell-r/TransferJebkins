# Build Docker image in ubuntu
```
wsl --list --verbose
wsl -d Ubuntu-24.04
mc
ifconfig

git clone https://github.com/P32DockerSimple/OneMVCProject.git

cd WebApiTransfer
ls
docker images

docker build -t tranfer-api .
docker login

docker images

docker tag tranfer-api:latest novakvova/tranfer-api:latest
docker images

docker push novakvova/tranfer-api:latest

docker rmi novakvova/tranfer-api:latest
docker rmi tranfer-api

docker ps -a
docker stop 
docker rm

```


# Pull postgres image run container Ubuntu 24.04
```
docker pull postgres:18.1

docker images

docker run --name container-postgres \
	--restart=always \
	-e POSTGRES_PASSWORD=mimi45Wh**xaxalala \
	-e POSTGRES_USER=halosh \
	-p 5028:5432 \
	-v /data/postgresql/data:/var/lib/postgresql \
	-d postgres:18.1

docker stop container-postgres
docker rm container-postgres
``` 

#Pull and Run project ASP.NET Core with Docker Hub
```
docker images
docker pull novakvova/tranfer-api
docker images
docker run -d --restart=always -v /data/tansfer-api:/app/images --name tranfer-api_container -p 5898:8080 novakvova/tranfer-api
docker ps -a
```


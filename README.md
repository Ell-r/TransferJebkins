docker compose up -d

docker exec -it front /bin/sh

exit 

docker compose down --volumes --rmi all

docker stop $(docker ps -aq)
 
docker rm $(docker ps -aq)
 

#Encoding files

# Run app
```
dos2unix build_and_push.sh
chmod +x build_and_push.sh
./build_and_push.sh
```

# image docker hub
```
docker compose pull
docker compose up -d
```

# my-domains
```
server ip - 63.177.248.142
transferapi - server - 127.0.0.1:5898
transfer - front - 127.0.0.1:3987

transfer.itstep.click

transferapi.itstep.click
``` 

# Option dns in server AWS
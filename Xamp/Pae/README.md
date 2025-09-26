
sudo apt-get install php-mysql

docker run -d \
--name mariadb-pae \
-e MARIADB_ROOT_PASSWORD=12345 \
-e MARIADB_DATABASE=pae \
-p 3306:3306 \
mariadb:10.4


ionic g page pages/denuncias
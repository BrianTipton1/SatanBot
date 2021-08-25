#!/usr/bin/env bash

set -e
cp /home/ubuntu/.env /home/ubuntu/SatanBot/.env
cd /home/ubuntu/SatanBot
docker-compose up -d --build
docker rmi $(docker images -f dangling=true -q)
#!/bin/bash
cd /home/ubuntu/SatanBot
docker build -t satan-bot .
docker run satan-bot
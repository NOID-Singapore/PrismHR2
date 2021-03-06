#!/usr/bin/env bash

WORKDIR=/home/ec2-user/workspace/PrismHR2

# Change CWD
cd ${WORKDIR}

$(aws ecr get-login --no-include-email --region ap-southeast-1)
docker build -f deploy/api/App.Dockerfile -t prismhr .

# Tagging the image
docker tag prismhr 795110723357.dkr.ecr.ap-southeast-1.amazonaws.com/prismhr2

sleep 10

# Pushing the image
docker push 795110723357.dkr.ecr.ap-southeast-1.amazonaws.com/prismhr2

# cleaning the image
docker image prune -f

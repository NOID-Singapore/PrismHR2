#!/usr/bin/env bash

WORKDIR=/home/ec2-user/workspace/PrismHR
S3_BUCKET=prismhr.dev.noid.com.sg
CLOUDFRONT_ID=E2AZUYMFRNH1BV

# Change CWD
cd ${WORKDIR}

# build the image
# Building the image will also upload to s3
docker build -f deploy/client/DeployClient.Dockerfile -t client --build-arg S3_BUCKET=s3://${S3_BUCKET} .

# docker delete all container
docker container prune --force

# Delete the image
docker image rm client

# Invalidate cloudfront
aws cloudfront create-invalidation --distribution-id ${CLOUDFRONT_ID} --paths "/*"

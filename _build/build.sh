#!/bin/bash
set -o xtrace
set -o errexit

cd "$(dirname "${0}")"

image_name=section-io.github.io-build-environment

docker build "--tag=${image_name}" ./

cid=$(
  docker create \
    --env AWS_ACCESS_KEY_ID \
    --env AWS_SECRET_ACCESS_KEY \
    "${image_name}" \
    bash /src/_build/inner-build.sh "${@}"
)

docker cp ../ "${cid}:/src"

docker start --attach "${cid}"

docker rm -f "${cid}"

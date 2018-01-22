#!/bin/bash
set -o xtrace
set -o errexit

cd "$(dirname "${0}")"
script_root="$(pwd)"

image_name=section-io.github.io-build-environment

docker build "--tag=${image_name}" ./

docker rm -f "${image_name}"
docker run -d --name "${image_name}" -p 3000:3000 -p 3001:3001 --volume "${script_root}/../:/src/" "${image_name}" sleep infinity
docker exec -it "${image_name}" /src/_build/inner-build.sh
docker exec -it "${image_name}" bash

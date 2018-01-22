#!/bin/bash
set -o xtrace
set -o errexit

cd /src

rm -rf /src/node_modules
cp -r /src/* /work/

cd /work/

bundle install

# Setting progress to false speeds up install
npm set progress=false && npm install --no-bin-links

gulp build

if [ "--publish" == "${1}" ]
then
    gulp publish
fi

FROM ubuntu:16.04

RUN sed 's@/archive.ubuntu.com/@/archive.ubuntu.com.section.io/@' -i /etc/apt/sources.list

COPY nodesource.gpg.key /

RUN printf 'deb http://deb.nodesource.com/node_6.x xenial main' >/etc/apt/sources.list.d/nodesource.list && \
  apt-key add /nodesource.gpg.key && \
  apt-get update && \
  apt-get install --assume-yes \
    build-essential \
    ca-certificates \
    git \
    graphicsmagick \
    nodejs \
    ruby \
    ruby-dev \
    software-properties-common \
    zlib1g-dev && \
  ln -s /usr/bin/nodejs /usr/local/bin/node && \
  gem install --verbose --no-ri --no-rdoc bundler && \
  npm install --global gulp

# Baseline gem and npm install for speed at publish time.
# Occasionally re-copy package.json and Gemfile* from ../ to ./ to reconcile
COPY package.json Gemfile* /work/
RUN cd /work/ && bundle install && npm set progress=false && npm install

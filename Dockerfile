FROM node:16.17.0

WORKDIR /usr/src/app
COPY package*.json ./


RUN npm install
RUN npm install ts-node -g
RUN apt update -y && apt upgrade -y && \
    apt-get install -y wget build-essential libreadline-gplv2-dev  libncursesw5-dev  libssl-dev  libsqlite3-dev tk-dev libgdbm-dev libc6-dev libbz2-dev libffi-dev zlib1g-dev && \
    cd /usr/src && \
    wget https://www.python.org/ftp/python/3.8.10/Python-3.8.10.tgz && \
    tar xzf Python-3.8.10.tgz && \
    cd Python-3.8.10 && \
    ./configure --enable-optimizations && \
    make altinstall
RUN apt-get install python3-pip -y
RUN python3 -m pip install wenxin-api
RUN python3 -m pip install python-decouple
# RUN ln -s /usr/bin/pip3 /usr/bin/pip && \
    # ln -s /usr/bin/python3.8 /usr/bin/python

COPY . .

EXPOSE 3000
CMD [ "npm", "run", "start" ]
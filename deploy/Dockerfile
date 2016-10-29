# FROM centos:centos7
# # Enable Extra Packages for Enterprise Linux (EPEL) for CentOS
# RUN yum install -y epel-release
# RUN yum install -y make
# RUN yum install -y nodejs npm

FROM ubuntu:latest
RUN apt-get update
RUN apt-get install -y curl python make g++
RUN curl --silent --location https://deb.nodesource.com/setup_4.x | bash -
RUN apt-get install -y nodejs

ADD . /src
RUN cd /src; npm install

CMD ["node", "/src/gluto.js"]

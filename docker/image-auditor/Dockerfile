FROM node:lts

COPY src /opt/app/
WORKDIR /opt/app
RUN npm install

ENTRYPOINT ["node","/opt/app/auditor.js"]

FROM node:12.18.1

COPY src /opt/app/
WORKDIR /opt/app
RUN npm install

CMD ["node","/opt/app/auditor.js"]

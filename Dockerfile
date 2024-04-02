FROM node:21.1.0
ENV DockerHOME=/home/app/15min/
WORKDIR $DockerHOME
COPY package*.json ./
ENV NODE_ENV=production
RUN npm install -g react-scripts@5.0.1
RUN npm install

COPY . $DockerHOME

RUN npm run build

EXPOSE 3000

# Uruchom serwer WWW
CMD [ "npm", "start" ]

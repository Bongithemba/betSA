FROM node:lts-alpine
ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --production --silent && mv node_modules ../
COPY . .
EXPOSE 3000
# RUN echo "172.17.0.1 host.docker.internal" >> /etc/hosts
RUN chown -R node /usr/src/app
USER node
CMD ["node", "index.js"]

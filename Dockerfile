# FROM node:10.13-alpine as build
# ENV NODE_ENV production
# WORKDIR /usr/src/app
# COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
# RUN npm install --silent && mv node_modules ../
# RUN npm install -g "@angular/cli" --silent
# COPY . .
# EXPOSE 4200
# CMD ng serve

FROM node:13.3.0 AS compile-image

RUN npm install -g yarn

WORKDIR /opt/ng
COPY  package.json yarn.lock ./
RUN yarn install

ENV PATH="./node_modules/.bin:$PATH" 

COPY . ./
RUN ng build

FROM nginx
COPY /nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=compile-image /opt/ng/dist/calories-tracker-FE /usr/share/nginx/html
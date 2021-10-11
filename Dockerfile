# Stage 0
FROM node

WORKDIR /usr/src/app

COPY package*.json ./
COPY yarn.lock ./
RUN yarn

COPY . .
RUN yarn build

# Stage 1
FROM nginx

ADD default.conf /etc/nginx/conf.d/
COPY --from=0 /usr/src/app/build /usr/share/nginx/html

EXPOSE 80 443

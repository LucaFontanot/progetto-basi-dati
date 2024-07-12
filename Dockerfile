FROM node:22 AS build
RUN mkdir /usr/src/build
WORKDIR /usr/src/build
COPY ./frontend /usr/src/build
RUN npm i
RUN npm run build

FROM node:22
RUN apt update && apt install mariadb-client -y
RUN mkdir /usr/src/app
WORKDIR /usr/src/app
COPY ./code /usr/src/app
RUN mkdir /usr/src/app/app/
COPY --from=build /usr/src/build/dist/ /usr/src/app/app/
RUN npm i
CMD ["npm", "run", "start"]
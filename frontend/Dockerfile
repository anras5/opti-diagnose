FROM node:latest
LABEL authors="filipmarciniak"

WORKDIR /app
COPY . .

RUN npm install

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]
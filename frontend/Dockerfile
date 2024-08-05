FROM node:20.11-alpine
WORKDIR /src
COPY package*.json ./
RUN npm install
COPY . .
CMD ["npm", "start"]  # Ensure this is correct for your application

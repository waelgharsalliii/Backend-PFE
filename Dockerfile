# Use the official Node.js lts-alpine3.17 image as a base
FROM node:latest

###### Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Expose port 3000 (assuming your backend runs on port 3000)
EXPOSE 3000

# Command to run the backend server
CMD ["npm","start"]

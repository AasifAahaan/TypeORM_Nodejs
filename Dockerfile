# Use official Node.js v20.18.0 image from Docker Hub
FROM node:20.18.0

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Install TypeScript, ts-node, and nodemon globally
RUN npm install -g typescript ts-node nodemon

# Copy the rest of the application files
COPY . .

# Expose port for the app
EXPOSE 3000

# Command to run the app with nodemon for development
CMD ["npm", "run", "dev"]

FROM node:20-alpine

#Set working dir 
WORKDIR /app

#Set node.js env to development so when npm install runs it installs all dependencies including devDependencies
ENV NODE_ENV=development

#copy package.json and package-lock.json first, as long as files don't chaange, Docker won't need to rerun npm install on every build
COPY package*.json ./

#installl dependencies
RUN npm install

#copy rest of frontend src code into container
COPY . .

#Vite default port 5173, expose so docker can map it
EXPOSE 5173

#command to run when container starts
CMD ["npm", "run", "dev"]

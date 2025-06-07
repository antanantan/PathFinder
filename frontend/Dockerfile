From node:20-alpine

#Set working dir 
WORKDIR /app

#copy package.json and package-lock.json first, as long as files don't chaange, Docker won't need to rerun npm install on every build
COPY package*.json ./

#installl dependencies
RUN npm install

#copy rest of frontend src code into container
COPY . .

#Vite default port 5173, expose so docker can map it
EXPOSE 5173

#command to start Vite dev server, --host flag to make it accessible outside the container
CMD ["npm", "run", "dev", "--", "--host"]

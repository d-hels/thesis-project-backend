# 1️⃣ Use Node 20
FROM node:24

# 2️⃣ Set working directory
WORKDIR /app

# 3️⃣ Copy package.json & package-lock.json
COPY package*.json ./

# 4️⃣ Install dependencies including devDependencies
RUN npm install

# 5️⃣ Copy all project files
COPY . .

# 6️⃣ Build TypeScript (use build, not dev)
RUN npm run build

# 7️⃣ Expose port
EXPOSE 3000

# 8️⃣ Start compiled JS
CMD ["node", "dist/index.js"]

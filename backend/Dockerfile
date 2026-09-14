FROM node:22-alpine

WORKDIR /app

# Copy package files AND prisma folder first
COPY package*.json ./
COPY prisma ./prisma/

# Now npm ci can safely run 'prisma generate'
RUN npm ci

# Copy rest of the code
COPY . .

# Build TypeScript
RUN npm run build

EXPOSE 5000

CMD ["npm", "start"]

FROM node:18-alpine

WORKDIR /app

# Install network tools
RUN apk add --no-cache iputils net-tools

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy source code
COPY ./src ./src

# Create a directory for logs
RUN mkdir -p /app/logs

# Set environment variables
ENV NODE_ENV=production
ENV LOG_LEVEL=info

# Start the agent
CMD ["node", "src/agent/index.js"]

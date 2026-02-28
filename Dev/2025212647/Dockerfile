FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY src/ ./src/

# 创建数据目录（用于挂载卷）
RUN mkdir -p /app/data

VOLUME [ "/app/data" ]

EXPOSE 3000

CMD ["node", "src/index.js"]

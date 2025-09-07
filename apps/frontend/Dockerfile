FROM node:24-alpine AS builder

WORKDIR /app

COPY packages/shared-types ./packages/shared-types
RUN cd packages/shared-types && npm install && npm run build

COPY apps/frontend/package*.json ./
COPY apps/frontend/tsconfig.json ./
COPY apps/frontend/vite.config.ts ./
COPY apps/frontend/tailwind.config.js ./
COPY apps/frontend/postcss.config.js ./
COPY apps/frontend/index.html ./

RUN npm install

RUN mkdir -p node_modules/@video-dashboard && \
    ln -sf ../../packages/shared-types node_modules/@video-dashboard/shared-types

COPY apps/frontend/src ./src

RUN npm run build

FROM nginx:alpine AS production

COPY --from=builder /app/dist /usr/share/nginx/html

COPY <<EOF /etc/nginx/conf.d/default.conf
server {
    listen 80;
    server_name localhost;
    
    location / {
        root /usr/share/nginx/html;
        index index.html index.htm;
        try_files \$uri \$uri/ /index.html;
    }
    
    location /api {
        proxy_pass http://backend:8000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

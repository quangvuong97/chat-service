# --- Build FE ---
FROM node:20.12.0 AS frontend-builder
WORKDIR /fe
RUN git clone https://github.com/quangvuong97/web-chat.git .
# Cài đặt các package và build FE
RUN yarn install
RUN yarn build

# --- Build BE ---
FROM node:20.10.0 AS backend-builder
WORKDIR /app
COPY . .
RUN yarn install && yarn run build

# --- Final Stage ---
FROM node:20.12.0

# Cài serve để chạy FE
RUN yarn global add serve

# Copy FE
WORKDIR /fe
COPY --from=frontend-builder /fe/build .

# Copy BE
WORKDIR /app
COPY --from=backend-builder /app/dist ./dist
COPY --from=backend-builder /app/node_modules ./node_modules
COPY --from=backend-builder /app/.env .
COPY --from=backend-builder /app/yarn.lock .
COPY --from=backend-builder /app/docker-entry.sh /entry.sh
RUN chmod +x /entry.sh

EXPOSE 3000 5000
CMD ["/entry.sh"]

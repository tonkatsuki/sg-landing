
# Dockerfile for Hugo site
FROM klakegg/hugo:ext-alpine AS builder
WORKDIR /src
COPY . .
RUN hugo --minify

# Stage 2
FROM caddy:2.4.6-alpine
COPY --from=builder /src/public /srv
COPY Caddyfile /etc/caddy/Caddyfile

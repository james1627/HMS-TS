# Stage 1: Install dependencies
FROM oven/bun:1-alpine AS base
WORKDIR /usr/src/app

COPY dist /usr/src/app/
# Run the container as a non-root user for security
USER bun

# Expose your application's port
EXPOSE 3000

# Execute the application
ENTRYPOINT [ "bun", "index.html" ]

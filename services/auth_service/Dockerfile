# Stage 1: Build
FROM rust:1.85 AS builder

# Create app directory
WORKDIR /app


# Install strip tool (optional if copied already stripped)
RUN apt-get update && apt-get install -y binutils && rm -rf /var/lib/apt/lists/*

# Cache dependencies
COPY Cargo.toml Cargo.lock ./
COPY shared/ shared/
COPY services/ services/

# Build the release binary for auth_service
RUN cargo build --release -p auth_service

# Strip the binary
RUN strip /app/target/release/auth_service

# Stage 2: Minimal runtime image
# FROM ubuntu:22.04
FROM debian:bookworm-slim

# Install libssl3 for OpenSSL compatibility
RUN apt-get update && apt-get install -y libssl3 ca-certificates && rm -rf /var/lib/apt/lists/*

# Create a non-root user
RUN useradd -m appuser

# Copy the built binary from the builder stage
COPY --from=builder /app/target/release/auth_service /usr/local/bin/auth_service

# Set ownership and permissions
RUN chown appuser:appuser /usr/local/bin/auth_service

# Switch to non-root user
USER appuser

# Set working directory
WORKDIR /home/appuser

# Start the service
CMD ["auth_service"]

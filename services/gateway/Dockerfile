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
RUN cargo build --release -p gateway

# Strip the binary
RUN strip /app/target/release/gateway

# Stage 2: Minimal runtime image
FROM debian:bookworm-slim

# Install libssl3 for OpenSSL compatibility
RUN apt-get update && apt-get install -y libssl3 && rm -rf /var/lib/apt/lists/*

# Create a non-root user
RUN useradd -m appuser

# Copy the built binary from the builder stage
COPY --from=builder /app/target/release/gateway /usr/local/bin/gateway

# Copy the frontend view directory into the image
COPY view /app/view

# Set ownership and permissions
RUN chown appuser:appuser /usr/local/bin/gateway

# Switch to non-root user
USER appuser

# Set working directory
WORKDIR /home/appuser

# Start the service
CMD ["gateway"]

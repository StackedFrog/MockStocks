decrypt:
	@echo "Attempting to decrypt secrets..."
	@if sops -d secrets.enc.env > .env 2>/dev/null; then \
		echo "Secrets decrypted successfully."; \
	else \
		echo "Decryption failed. Using default env."; \
		cp .env.default .env; \
	fi

re-build:
	sudo docker compose -p prod build $(SERV) --no-cache

 # Prod Deployment
prod_up: decrypt
	sudo docker compose -p prod up

prod_down:
	sudo docker compose -p prod down


# Produciton build
build-frontend:
	cd frontend && npm install && npm run build

prod_build:
	sudo docker compose -p prod build

prod_build_no_cach:
	sudo docker compose build --no-cache

build_pipe: build-frontend prod_build

prune:
	sudo docker system prune -a --volumes


data:
	cat ./sql/populate_db.sql | docker exec -i dev-db-1 psql -U postgres -d dev_db


# Dev
dev_up: decrypt
	sudo docker compose -p dev -f docker-compose.dev.yaml up

dev_down:
	sudo docker compose -p dev -f docker-compose.dev.yaml down



start_windows: create_env
	docker compose -f docker-compose.dev.yaml up

stop_windows:
	docker compose -f docker-compose.dev.yaml down

format_frontend:
	cd frontend && npm run lint

format_backend:
	cargo fmt

fmt: format_backend format_frontend

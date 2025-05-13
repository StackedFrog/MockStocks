decrypt:
	@echo "Attempting to decrypt secrets..."
	@if sops -d secrets.enc.env > .env 2>/dev/null; then \
		echo "Secrets decrypted successfully."; \
	else \
		echo "Decryption failed. Using default env."; \
		cp .env.default .env; \
	fi

dev_up: decrypt
	sudo docker compose -f docker-compose.dev.yaml up

dev_down:
	sudo docker compose -f docker-compose.dev.yaml down

start_windows: create_env
	docker compose -f docker-compose.dev.yaml up

stop_windows: 
	docker compose -f docker-compose.dev.yaml down

create_env:
	cp .env.default .env;

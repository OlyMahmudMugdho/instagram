.PHONY: install build start deploy clean

install:
	@echo "Installing dependencies..."
	npm install
	cd backend && npm install
	cd frontend && npm install

build:
	@echo "Building frontend..."
	cd frontend && npm run build

start:
	@echo "Starting backend server..."
	cd backend && node server.js

deploy: build start

clean:
	@echo "Cleaning up..."
	rm -rf frontend/.next
	rm -rf node_modules
	rm -rf backend/node_modules
	rm -rf frontend/node_modules

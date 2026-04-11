install:
	@npm install

build:
	@echo 'building from ./tsconfig.app.json'
	@./node_modules/.bin/tsc --project ./tsconfig.app.json

lint--prettier:
	@echo 'running prettier'
	@./node_modules/.bin/prettier . --check

lint--oxlint:
	@./node_modules/.bin/oxlint

lint: lint--prettier build lint--oxlint

.PHONY: tests
tests:
	@node --test

.PHONY: coverage
coverage: build
	@node --experimental-test-coverage --test --test-reporter=lcov --test-reporter-destination=coverage/lcov.info

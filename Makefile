DOCKER_COMPOSER_PREFIX = @USER=$(shell id -u):$(shell id -g) docker compose

up:
	${DOCKER_COMPOSER_PREFIX} up -d

down:
	${DOCKER_COMPOSER_PREFIX} down

logs:
	${DOCKER_COMPOSER_PREFIX} logs -f

shell:
	${DOCKER_COMPOSER_PREFIX} exec ts-node sh

install:
	${DOCKER_COMPOSER_PREFIX} exec node npm install

build:
	@echo 'building from ./tsconfig.app.json'
	${DOCKER_COMPOSER_PREFIX} exec node ./node_modules/.bin/tsc --project ./tsconfig.app.json

lint--prettier:
	@echo 'running prettier'
	${DOCKER_COMPOSER_PREFIX} exec ts-node ./node_modules/.bin/prettier . --check

lint--eslint:
	@echo 'checking eslint for fixable issues'
	${DOCKER_COMPOSER_PREFIX} exec ts-node ./node_modules/.bin/eslint --cache './*.ts' assert tests --fix-dry-run
	@echo 'checking eslint for all issues'
	${DOCKER_COMPOSER_PREFIX} exec ts-node ./node_modules/.bin/eslint --cache './*.ts' assert tests

lint: lint--prettier lint--tsc lint--eslint

lint-fix:
	@echo 'fixing prettier issues'
	${DOCKER_COMPOSER_PREFIX} exec ts-node ./node_modules/.bin/prettier . --write
	@echo 'fixing eslint issues'
	${DOCKER_COMPOSER_PREFIX} exec ts-node ./node_modules/.bin/eslint --cache './*.ts' assert tests --fix

.PHONY: tests
tests: build
	${DOCKER_COMPOSER_PREFIX} exec ts-node npm test

.PHONY: coverage
coverage: build
	${DOCKER_COMPOSER_PREFIX} exec ts-node ./node_modules/.bin/c8 npm test

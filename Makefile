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

lint--prettier:
	@echo 'running prettier'
	${DOCKER_COMPOSER_PREFIX} exec ts-node ./node_modules/.bin/prettier . --check

lint--eslint:
	@echo 'checking eslint for fixable issues'
	${DOCKER_COMPOSER_PREFIX} exec ts-node ./node_modules/.bin/eslint --cache './*.ts' --fix-dry-run
	@echo 'checking eslint for all issues'
	${DOCKER_COMPOSER_PREFIX} exec ts-node ./node_modules/.bin/eslint --cache './*.ts'

lint: lint--prettier lint--eslint

lint-fix:
	@echo 'fixing prettier issues'
	${DOCKER_COMPOSER_PREFIX} exec ts-node ./node_modules/.bin/prettier . --write
	@echo 'fixing eslint issues'
	${DOCKER_COMPOSER_PREFIX} exec ts-node ./node_modules/.bin/eslint --cache './*.ts' --fix

.PHONY: tests
tests: build-lib
	${DOCKER_COMPOSER_PREFIX} exec ts-node npm test

.PHONY: coverage
coverage: build-lib
	${DOCKER_COMPOSER_PREFIX} exec ts-node ./node_modules/.bin/c8 npm test

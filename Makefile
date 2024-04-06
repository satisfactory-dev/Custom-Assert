DOCKER_IMAGE ?= node:21-alpine

DOCKER_PREFIX_NO_LOADER = @docker run --rm -it \
	-u $(shell id -u):$(shell id -g) \
	-v $(shell pwd)/:/app \
	-v ${HOME}/.npm/:/.npm/ \
	-v /etc/passwd:/etc/passwd:ro \
	-v /etc/group:/etc/group:ro \
	-w /app/

DOCKER_PREFIX = ${DOCKER_PREFIX_NO_LOADER} -e NODE_OPTIONS='--enable-source-maps --no-warnings=ExperimentalWarning --loader ts-node/esm'

DOCKER_COMPOSER_PREFIX = @USER=$(shell id -u):$(shell id -g) docker compose

up:
	${DOCKER_COMPOSER_PREFIX} up -d

down:
	${DOCKER_COMPOSER_PREFIX} down

logs:
	${DOCKER_COMPOSER_PREFIX} logs -f

shell:
	${DOCKER_PREFIX} --entrypoint sh ${DOCKER_IMAGE}

install:
	${DOCKER_PREFIX_NO_LOADER} ${DOCKER_IMAGE} npm install

build:
	@echo 'building from ./tsconfig.app.json'
	${DOCKER_PREFIX_NO_LOADER} ${DOCKER_IMAGE} ./node_modules/.bin/tsc --project ./tsconfig.app.json

lint--prettier:
	@echo 'running prettier'
	${DOCKER_PREFIX} ${DOCKER_IMAGE} ./node_modules/.bin/prettier . --check

lint--eslint:
	@echo 'checking eslint for fixable issues'
	${DOCKER_COMPOSER_PREFIX} exec ts-node ./node_modules/.bin/eslint --cache './*.ts' assert tests --fix-dry-run
	@echo 'checking eslint for all issues'
	${DOCKER_COMPOSER_PREFIX} exec ts-node ./node_modules/.bin/eslint --cache './*.ts' assert tests

lint: lint--prettier lint--tsc lint--eslint

lint-fix:
	@echo 'fixing prettier issues'
	${DOCKER_PREFIX} ${DOCKER_IMAGE} ./node_modules/.bin/prettier . --write
	@echo 'fixing eslint issues'
	${DOCKER_COMPOSER_PREFIX} exec ts-node ./node_modules/.bin/eslint --cache './*.ts' assert tests --fix

.PHONY: tests
tests: build
	${DOCKER_COMPOSER_PREFIX} exec ts-node npm test

tests--only-unstaged: build
	${DOCKER_COMPOSER_PREFIX} exec ts-node ./node_modules/.bin/ts-node ./tests--only-these.ts "$(shell git diff HEAD --name-only)"

tests--only-unstaged: build
	${DOCKER_PREFIX} ${DOCKER_IMAGE} ./node_modules/.bin/ts-node ./tests--only-these.ts '$(shell git diff HEAD --name-only)'

.PHONY: coverage
coverage: build
	${DOCKER_COMPOSER_PREFIX} exec ts-node ./node_modules/.bin/c8 npm test

coverage--only-unstaged: build
	${DOCKER_PREFIX} ${DOCKER_IMAGE} ./node_modules/.bin/c8 ./node_modules/.bin/ts-node ./tests--only-these.ts '$(shell git diff HEAD --name-only)'

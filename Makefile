DOCKER_IMAGE ?= node:21-alpine

DOCKER_PREFIX_NO_LOADER = @docker run --rm -it \
	-u $(shell id -u):$(shell id -g) \
	-v $(shell pwd)/:/app \
	-v ${HOME}/.npm/:/.npm/ \
	-w /app/

DOCKER_PREFIX = ${DOCKER_PREFIX_NO_LOADER} -e NODE_OPTIONS='--no-warnings=ExperimentalWarning --loader ts-node/esm'

shell:
	${DOCKER_PREFIX} --entrypoint sh ${DOCKER_IMAGE}

install:
	${DOCKER_PREFIX_NO_LOADER} ${DOCKER_IMAGE} npm install

lint:
	${DOCKER_PREFIX} ${DOCKER_IMAGE} ./node_modules/.bin/prettier . --check
	${DOCKER_PREFIX} ${DOCKER_IMAGE} ./node_modules/.bin/eslint . --fix-dry-run

lint-fix:
	${DOCKER_PREFIX} ${DOCKER_IMAGE} ./node_modules/.bin/prettier . --write

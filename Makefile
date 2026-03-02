install:
	@NODE_OPTIONS='' npm install

build:
	@echo 'building from ./tsconfig.app.json'
	@NODE_OPTIONS='' ./node_modules/.bin/tsc --project ./tsconfig.app.json

lint--prettier:
	@echo 'running prettier'
	@./node_modules/.bin/prettier . --check

lint--eslint:
	@NODE_OPTIONS='' ./node_modules/.bin/tsc --project ./tsconfig.eslint.json
	@echo 'checking eslint for all issues with config'
	@./node_modules/.bin/eslint --config eslint.config.js.mjs --cache './**/*.mjs'
	@echo 'checking eslint for all issues'
	@./node_modules/.bin/eslint --cache './**/*.ts'

lint: lint--prettier build lint--eslint

.PHONY: tests
tests:
	@node --test "**/*.spec.ts"

.PHONY: coverage
coverage: build
	@./node_modules/.bin/c8 node --test "**/*.spec.ts"

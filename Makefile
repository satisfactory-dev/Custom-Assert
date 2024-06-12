install:
	@NODE_OPTIONS='' npm install

build:
	@echo 'building from ./tsconfig.app.json'
	@NODE_OPTIONS='' ./node_modules/.bin/tsc --project ./tsconfig.app.json

lint--prettier:
	@echo 'running prettier'
	@./node_modules/.bin/prettier . --check

lint--eslint:
	@echo 'checking eslint for fixable issues'
	@./node_modules/.bin/eslint --cache './*.ts' assert tests --fix-dry-run
	@echo 'checking eslint for all issues'
	@./node_modules/.bin/eslint --cache './*.ts' assert tests

lint: lint--prettier build lint--eslint

lint-fix:
	@echo 'fixing prettier issues'
	@./node_modules/.bin/prettier . --write
	@echo 'fixing eslint issues'
	@./node_modules/.bin/eslint --cache './*.ts' assert tests --fix

.PHONY: tests
tests: build
	@npm test

tests--only-unstaged: build
	@./node_modules/.bin/ts-node ./tests--only-these.ts '$(shell git diff HEAD --name-only)'

.PHONY: coverage
coverage: build
	@./node_modules/.bin/c8 npm test

coverage--only-unstaged: build
	@./node_modules/.bin/c8 ./node_modules/.bin/ts-node ./tests--only-these.ts '$(shell git diff HEAD --name-only)'

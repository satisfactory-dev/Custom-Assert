# Notes

-   Very alpha.

## Current Plan for Development:

-   If [the relevant QA Site post](https://questions.satisfactorygame.com/post/65e5367dcd33105bd53f931f) gets resolved via a public announcement and/or the inclusion of a license:
    -   generated files will be included in the repo
    -   Docs.json _may_ be included
    -   Docs.utf8.json _may_ be included
-   skipping improving performance of validation (that's in a separate branch for now)
-   the schema-based results matcher has been abstracted
    -   portions of the schema that use the `object_string` keyword should parse the object string then validate the resultant object according to the schema chunk within the keyword
    -   `$ref` objects should return a result for that particular type etc.

# Using

## Requirements

-   Docker
    -   only tested with Docker for windows & git bash terminals

## Instructions

1. Checkout locally
2. Run `make up install`

### IDE Integration

-   [Docs.json.ts.dic](Docs.json.ts.dic) can be used by JetBrains' IDEs to suppress false-positive matches in the spellchecker as a result of the contents of `Docs.json`
    -   refer to JetBrains' own documentation for adding `.dic` files to the spell checking.
-   may need to add the `NODE_OPTIONS` environment variable from the `ts-node` service listed in [docker-compose.yml](docker-compose.yml)

# License

[Multi-licensed, see LICENSE.md](LICENSE.md)

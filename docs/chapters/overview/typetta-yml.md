# Config Reference

Typetta relies on a configuration file named typetta.yml or typetta.json to manage all possible options, input, and output document types. The CLI automatically detects the defined config file and generates code accordingly.

In addition, you can also define a path to your config file with the --config options, like so:
```
npx typetta generate --config ./custom/config.yml
```

  - [typetta.yml format](#typettayml-format)
  - [Configuration options](#configuration-options)

## typetta.yml format
Here's an example for a minimal configuration file:

```yaml
schema: src/**/**.typedefs.ts
outputDir: src/generated
```

By default all the generators are enabled and generate in the given output directory. You can define different options for each generator creating a more complex configuration file like the following:
```yaml
schema: 
  - src/typedefs/user.ts
  - src/typedefs/post.ts
generateTypes:
  output: src/types.generated.ts
generateORM:
  output: src/typetta.generated.ts
generateGraphQLOperations:
  operations: false
  resolvers: false
  resolversTypes:
    output: src/resolvers.generated.ts
scalars:
  Date: Date
  URL: string
```

## Configuration options
Here are the supported options that you can define in the config file:

- `schema` **(required)**: a URL to your GraphQL endpoint, a local path to .graphql file, a glob pattern to your GraphQL schema files, or a JavaScript file that exports the schema to generate code from. This can also be an array that specifies multiple schemas to generate code from.

- `outputDir`: path to a local directory for generated code. If not overidden by the output param generation option, every generated file is written to this path (default to `./`).

- `generateTypes`: a boolean (default to `true`) to enable/disable the base type generation or an object that represents a set of relevant options for that specific generator. Below are the possible options that can be specified:

  - `output`: output path for generated code, it overrides the `outputDir` configuration for this specific file.
  
  - `codegenConfig`: a generic configuration object passed to the GraphQL Code Generator plugin below, useful for advanced customizations.

- `generateORM`: a boolean (default to `true`) to enable/disable the Entity Manager and DAOs generation or an object that represents a set of relevant options for that specific generator. Below are the possible options that can be specified:

  - `output`: output path for generated code, it overrides the `outputDir` configuration for this specific file.

  - `typesImport`: a relative path to the types file used to import basic types.
  
  - `codegenConfig`: a generic configuration object passed to the GraphQL Code Generator plugin below, useful for advanced customizations.

- `generateGraphQLOperations`: a boolean (default to `true`) to enable/disable the generation of the GraphQL CRUD operations and relative resolvers or an object that represents a set of relevant options for that specific generator. Below are the possible options that can be specified:

  - `operations`: a boolean (default to `true`) to enable/disable the GraphQL operations generation or an object that represents a set of relevant options for that specific generator. Below are the possible options that can be specified:

    - `output`: output path for generated code, it overrides the `outputDir` configuration for this specific file.

    - `codegenConfig`: a generic configuration object passed to the GraphQL Code Generator plugin below, useful for advanced customizations.

  - `resolversTypes`: a boolean (default to `true`) to enable/disable the GraphQL resolvers types generation or an object that represents a set of relevant options for that specific generator. Below are the possible options that can be specified:

      - `output`: output path for generated code, it overrides the `outputDir` configuration for this specific file.

      - `typesImport`: a relative path to the types file used to import basic types.

      - `ormImport`: a relative path to the Typetta ORM file used to import basic the Entity Manager and DAOs.

      - `codegenConfig`: a generic configuration object passed to the GraphQL Code Generator plugin below, useful for advanced customizations.

  - `resolvers`: a boolean (default to `true`) to enable/disable the GraphQL resolvers generation or an object that represents a set of relevant options for that specific generator. Below are the possible options that can be specified:

      - `output`: output path for generated code, it overrides the `outputDir` configuration for this specific file.

      - `resolversTypesImport`: a relative path to the resolvers types file.

      - `ormImport`: a relative path to the Typetta ORM file used to import basic the Entity Manager and DAOs.

      - `codegenConfig`: a generic configuration object passed to the GraphQL Code Generator plugin below, useful for advanced customizations.

  - `context`: an optional object to configure the context of generated resolvers.

    - `type`: the type of the context object in the generated GraphQL resolvers
  
    - `path`: path to the Entity Manager instance inside the context object of generated GraphQL resolvers

- `scalars`: a map to extend or override the built-in scalars and custom GraphQL scalars to a custom TypeScript type. See [GraphQL Code Generator](https://www.graphql-code-generator.com/plugins/typescript){:target="_blank"} for more details.


import { Config } from '../types'
import { err } from '../utils'
import { generate } from '@graphql-codegen/cli'
import { Types } from '@graphql-codegen/plugin-helpers'
import chalk from 'chalk'
import fs from 'fs'
import path from 'path'
import yaml from 'yaml'

type GenerateArgs = {
  config?: string
}

export default async (args: GenerateArgs): Promise<void> => {
  const { config, basePath } = loadConfig(args.config) || { basePath: './' }
  if (!config) {
    err('Error: Typetta configuration not found.')
  } else {
    const outputPath = path.join(path.resolve(basePath), config?.outputDir)
    try {
      console.log()
      if (config.generateGraphQLOperations !== false) {
        await generate(
          {
            schema: config?.schema,
            generates: {
              [outputPath + '/operations.ts']: {
                plugins: [config.typettaGeneratorPath ?? '@twinlogix/typetta'],
                config: {
                  namingConvention: 'keep',
                  ...(config.generateGraphQLOperations !== undefined && config.generateGraphQLOperations !== true ? config.generateGraphQLOperations.operationsCodegenConfig : {}),
                  scalars: config.scalars,
                  generationOutput: 'operations',
                },
              },
            },
            hooks: {
              afterAllFileWrite: 'prettier --write',
            },
            silent: true,
          },
          true,
        )
        console.log(`- GraphQL operations generation ${chalk.bold.green('completed')}.`)
      }

      const generates: Types.Config['generates'] = {}
      if (config.generateTypes !== false) {
        generates[outputPath + '/model.types.ts'] = {
          plugins: ['typescript'],
          config: {
            enumsAsConst: true,
            ...(config.generateTypes !== undefined && config.generateTypes !== true ? config.generateTypes.codegenConfig : {}),
            scalars: config.scalars,
          },
        }
      }
      if (config.generateORM !== false) {
        generates[outputPath + '/typetta.ts'] = {
          plugins: [config.typettaGeneratorPath ?? '@twinlogix/typetta'],
          config: {
            tsTypesImport: './model.types',
            namingConvention: 'keep',
            defaultIdGenerationStrategy: 'generator',
            ...(config.generateORM !== undefined && config.generateORM !== true ? config.generateORM.codegenConfig : {}),
            scalars: config.scalars,
            generationOutput: 'dao',
          },
        }
      }
      if (config.generateGraphQLOperations !== false) {
        generates[outputPath + '/resolvers.types.ts'] = {
          plugins: [
            {
              add: {
                content: ["import { PartialDeep } from 'type-fest'", "import * as types from './model.types'"],
              },
            },
            'typescript-resolvers',
          ],
          config: {
            ...(config.generateGraphQLOperations !== undefined && config.generateGraphQLOperations !== true ? config.generateGraphQLOperations.resolversTypesCodegenConfig : {}),
            resolverTypeWrapperSignature: 'PartialDeep<T>',
            namespacedImportName: 'types',
            ...(config.generateGraphQLOperations !== true
              ? {
                  contextType: config.generateGraphQLOperations?.context?.type,
                  daoContextPath: config.generateGraphQLOperations?.context?.path,
                }
              : {
                  contextType: './typetta#DAOContext',
                }),
          },
        }
        generates[outputPath + '/resolvers.ts'] = {
          plugins: [config.typettaGeneratorPath ?? '@twinlogix/typetta'],
          config: {
            ...(config.generateGraphQLOperations !== undefined && config.generateGraphQLOperations !== true ? config.generateGraphQLOperations.resolversCodegenConfig : {}),
            generationOutput: 'resolvers',
            tsTypesImport: './resolvers.types',
            ...(config.generateGraphQLOperations !== true
              ? {
                  contextType: config.generateGraphQLOperations?.context?.type,
                  daoContextPath: config.generateGraphQLOperations?.context?.path,
                }
              : {
                  contextType: './typetta#DAOContext',
                }),
          },
        }
      }

      const operationsSchema: Types.Schema[] = config.generateGraphQLOperations !== false ? [path.join(outputPath, 'operations.ts')] : []
      const schema: Types.Schema[] = operationsSchema.concat(config.schema || [])

      await generate(
        {
          schema,
          generates,
          hooks: {
            afterAllFileWrite: 'prettier --write',
          },
          silent: true,
        },
        true,
      )
      if (config.generateTypes !== false) {
        console.log(`- TypeScript types generation ${chalk.bold.green('completed')}.`)
      }
      if (config.generateORM !== false) {
        console.log(`- DAOContext generation ${chalk.bold.green('completed')}.`)
      }
      if (config.generateGraphQLOperations !== false) {
        console.log(`- GraphQL resolvers generation ${chalk.bold.green('completed')}.`)
      }
      console.log()
    } catch (e) {
      console.error(chalk.red('Error: generation failed due to the following error...'))
      console.log()
      console.log(e)
      console.log()
      process.exit(1)
    }
  }
}

const loadConfig = (configPathParam?: string): { config: Config; basePath: string } | undefined => {
  if (configPathParam) {
    const configPath = path.resolve(configPathParam)
    if (!fs.existsSync(configPath)) err(`Error: file not found ${configPath}.`)
    return { config: loadConfigFromPath(configPath), basePath: path.dirname(configPath) }
  } else {
    const defaultFilenames = ['typetta.yml', 'typetta.yaml', 'typetta.json']
    for (const filename in defaultFilenames) {
      const filePath = path.resolve(filename)
      if (fs.existsSync(filePath)) return { config: loadConfigFromPath(filePath), basePath: './' }
    }
  }
  err(`Error: Typetta configuration file not found.`)
}

const loadConfigFromPath = (path: string): Config => {
  const content = fs.readFileSync(path)
  if (path.toLocaleLowerCase().endsWith(`.json`)) {
    return JSON.parse(content.toString())
  } else {
    return yaml.parse(content.toString())
  }
}

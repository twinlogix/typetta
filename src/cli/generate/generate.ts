import { Config, GenerateConfig, GenerateGraphQLOperations } from '../types'
import { err } from '../utils'
import { generate } from '@graphql-codegen/cli'
import { Types } from '@graphql-codegen/plugin-helpers'
import chalk from 'chalk'
import fs from 'fs'
import { isObject } from 'lodash'
import path from 'path'
import yaml from 'yaml'

type GenerateArgs = {
  config?: string
  watch?: boolean
}

export default async (args: GenerateArgs): Promise<void> => {
  const { config, basePath: userBasePath } = loadConfig(args.config) || {}
  if (!config) {
    err('Error: Typetta configuration not found.')
  } else {
    const basePath = path.resolve(userBasePath || './')
    const outputDirPath = path.join(basePath, config?.outputDir)
    try {
      console.log()
      const operationsConfig = getGraphQLStepConfig(config.generateGraphQLOperations, 'operations')
      const operationsOutputPath = getOutputPath(operationsConfig, basePath, path.join(outputDirPath, 'operations.ts'))
      const operationsSchema: Types.Schema[] = config.generateGraphQLOperations !== false ? [operationsOutputPath] : []
      if (config.generateGraphQLOperations !== false) {
        const generateConfigs = {
          schema: config?.schema,
          generates: {
            [operationsOutputPath]: {
              plugins: [config.typettaGeneratorPath ?? '@twinlogix/typetta'],
              config: {
                namingConvention: 'keep',
                ...getCodegenConfig(operationsConfig),
                scalars: config.scalars,
                generationOutput: 'operations',
              },
            },
          },
          hooks: {
            afterAllFileWrite: 'prettier --write',
          },
          silent: true,
        }
        if (args.watch) {
          generate({ ...generateConfigs, watch: true }, true)
        } else {
          await generate({ ...generateConfigs }, true)
          console.log(`- GraphQL operations generation ${chalk.bold.green('completed')}.`)
        }
      }

      const generates: Types.Config['generates'] = {}
      if (config.generateTypes !== false) {
        generates[getOutputPath(config.generateTypes, basePath, path.join(outputDirPath, 'model.types.ts'))] = {
          plugins: ['typescript'],
          config: {
            enumsAsConst: true,
            ...getCodegenConfig(config.generateTypes),
            scalars: config.scalars,
          },
        }
      }
      if (config.generateORM !== false) {
        generates[getOutputPath(config.generateTypes, basePath, path.join(outputDirPath, 'typetta.ts'))] = {
          plugins: [config.typettaGeneratorPath ?? '@twinlogix/typetta'],
          config: {
            tsTypesImport: './model.types',
            namingConvention: 'keep',
            defaultIdGenerationStrategy: 'generator',
            ...getCodegenConfig(config.generateORM),
            scalars: config.scalars,
            generationOutput: 'dao',
          },
        }
      }
      if (config.generateGraphQLOperations !== false) {
        const resolversTypesConfig = getGraphQLStepConfig(config.generateGraphQLOperations, 'resolversTypes')
        generates[getOutputPath(resolversTypesConfig, basePath, path.join(outputDirPath, 'resolvers.types.ts'))] = {
          plugins: [
            {
              add: {
                content: ["import { PartialDeep } from 'type-fest'", "import * as types from './model.types'"],
              },
            },
            'typescript-resolvers',
          ],
          config: {
            ...getCodegenConfig(resolversTypesConfig),
            resolverTypeWrapperSignature: 'PartialDeep<T>',
            namespacedImportName: 'types',
            ...(isObject(config.generateGraphQLOperations)
              ? {
                  contextType: config.generateGraphQLOperations?.context?.type,
                  entityManagerPath: config.generateGraphQLOperations?.context?.path,
                }
              : {
                  contextType: './typetta#EntityManager',
                }),
          },
        }
        const resolversConfig = getGraphQLStepConfig(config.generateGraphQLOperations, 'resolvers')
        generates[getOutputPath(resolversConfig, basePath, path.join(outputDirPath, 'resolvers.ts'))] = {
          plugins: [config.typettaGeneratorPath ?? '@twinlogix/typetta'],
          config: {
            ...getCodegenConfig(resolversConfig),
            generationOutput: 'resolvers',
            tsTypesImport: './resolvers.types',
            ...(config.generateGraphQLOperations !== true && config.generateGraphQLOperations !== undefined
              ? {
                  contextType: config.generateGraphQLOperations?.context?.type,
                  entityManagerPath: config.generateGraphQLOperations?.context?.path,
                }
              : {
                  contextType: './typetta#EntityManager',
                }),
          },
        }
      }

      const schema: Types.Schema[] = operationsSchema.concat(config.schema || [])

      const generateConfig = {
        schema,
        generates,
        hooks: {
          afterAllFileWrite: 'prettier --write',
        },
        silent: true,
      }
      if (args.watch) {
        generate({ ...generateConfig, watch: true }, true)
      } else {
        await generate({ ...generateConfig }, true)
        if (config.generateTypes !== false) {
          console.log(`- TypeScript types generation ${chalk.bold.green('completed')}.`)
        }
        if (config.generateORM !== false) {
          console.log(`- EntityManager generation ${chalk.bold.green('completed')}.`)
        }
        if (config.generateGraphQLOperations !== false) {
          console.log(`- GraphQL resolvers generation ${chalk.bold.green('completed')}.`)
        }
        console.log()
      }
    } catch (e) {
      console.error(chalk.red('Error: generation failed due to the following error...'))
      console.log()
      console.log(e)
      console.log()
      process.exit(1)
    }
  }
}
const getGraphQLStepConfig = (config: boolean | GenerateGraphQLOperations | undefined, step: 'operations' | 'resolvers' | 'resolversTypes'): boolean | undefined | GenerateConfig => {
  if (isObject(config)) {
    return config[step]
  } else {
    return config
  }
}

const getOutputPath = (config: boolean | undefined | GenerateConfig, basePath: string, defaultPath: string): string => {
  if (isObject(config) && config.output) {
    return path.join(basePath, config.output)
  } else {
    return defaultPath
  }
}

const getCodegenConfig = (config: boolean | undefined | GenerateConfig): Record<string, unknown> => {
  if (isObject(config) && config.codegenConfig) {
    return config.codegenConfig
  } else {
    return {}
  }
}

const loadConfig = (configPathParam?: string): { config: Config; basePath: string } | undefined => {
  if (configPathParam) {
    const configPath = path.resolve(configPathParam)
    if (!fs.existsSync(configPath)) err(`Error: file not found ${configPath}.`)
    return { config: loadConfigFromPath(configPath), basePath: path.dirname(configPath) }
  } else {
    const defaultFilenames = ['typetta.yml', 'typetta.yaml', 'typetta.json']
    for (const filename of defaultFilenames) {
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

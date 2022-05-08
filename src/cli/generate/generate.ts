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

export default async (args: GenerateArgs) => {
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
              [outputPath + '/operations.graphql']: {
                plugins: [config.typettaGeneratorPath ?? '@twinlogix/typetta'],
                config: {
                  namingConvention: 'keep',
                  ...(config.generateORM !== undefined && config.generateORM !== true ? config.generateORM : {}),
                  scalars: config.scalars,
                  generationOutput: 'inputs',
                },
              },
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
            ...(config.generateTypes !== undefined && config.generateTypes !== true ? config.generateTypes : {}),
            scalars: config.scalars,
          },
        }
      }
      if (config.generateORM !== false) {
        generates[outputPath + '/dao.ts'] = {
          plugins: [config.typettaGeneratorPath ?? '@twinlogix/typetta'],
          config: {
            tsTypesImport: './model.types',
            namingConvention: 'keep',
            defaultIdGenerationStrategy: 'generator',
            ...(config.generateORM !== undefined && config.generateORM !== true ? config.generateORM : {}),
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
                content: ["import * as types from './model.types'"],
              },
            },
            'typescript-resolvers',
          ],
          config: {
            resolverTypeWrapperSignature: 'PartialDeep<T>',
            contextType: './dao#DAOContext', // TODO
            namespacedImportName: 'types',
          },
        }
        generates[outputPath + '/resolvers.ts'] = {
          plugins: [config.typettaGeneratorPath ?? '@twinlogix/typetta'],
          config: {
            generationOutput: 'resolvers',
            tsTypesImport: './resolvers.types',
          },
        }
      }

      let schema: Types.Schema[] = []
      if (config.generateGraphQLOperations !== false) {
        schema.push('./operations.graphql')
      }
      schema = schema.concat(config.schema || [])
      await generate(
        {
          schema,
          generates,
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

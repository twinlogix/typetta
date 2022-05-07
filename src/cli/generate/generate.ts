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
      const generates: Types.Config['generates'] = {}
      if (config.generateTypes) {
        generates[outputPath + '/model.types.ts'] = {
          plugins: ['typescript'],
          config: {
            ...(config.generateTypes !== undefined && config.generateTypes !== true ? config.generateTypes : {}),
            scalars: config.scalars,
          },
        }
      }
      if (config.generateORM) {
        generates[outputPath + '/dao.ts'] = {
          plugins: ['@twinlogix/typetta'],
          config: {
            ...(config.generateORM !== undefined && config.generateORM !== true ? config.generateORM : {}),
            scalars: config.scalars,
          },
        }
      }
      await generate(
        {
          schema: config?.schema,
          generates,
          silent: true,
        },
        true,
      )
    } catch (e) {
      console.log()
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

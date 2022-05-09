import { Config } from '../types'
import { err, TYPETTA_COLOR } from '../utils'
import { Answers, getQuestions } from './questions'
import chalk from 'chalk'
import dedent from 'dedent'
import fs from 'fs'
import inquirer from 'inquirer'
import path from 'path'
import yaml from 'yaml'

export default async (projectDirectory = './'): Promise<void> => {
  const projectDirectoryPath = checkProjectDirectory(projectDirectory)

  console.log()
  console.log(dedent`
    Welcome to ${chalk.bold.underline.hex(TYPETTA_COLOR)('Typetta')}!
    Answer few questions and we will setup everything for you.
  `)
  console.log()

  const answers = await inquirer.prompt<Answers>(getQuestions())

  const packagePath = checkPackage(projectDirectoryPath)
  const configPath = createConfig(projectDirectoryPath, answers)
  updatePackage(packagePath, answers)

  console.log()
  console.log(dedent`
    Config file generated at ${chalk.bold(configPath)}
    
      ${chalk.bold('$ npm install')} to install required dependencies.
      ${chalk.bold(`$ npm run ${answers.script}`)} to generate types and helpers.
  `)
  console.log()
  console.log(`Typetta initialization ${chalk.bold.green('completed')}.`)
  console.log()
}

const checkProjectDirectory = (projectDirectory: string): string => {
  const root = path.resolve(projectDirectory)
  if (!fs.existsSync(root)) err(`Error: path ${root} does not exist.`)
  return root
}

const checkPackage = (projectDirectoryPath: string): string => {
  const packageJson = path.join(projectDirectoryPath, 'package.json')
  if (!fs.existsSync(packageJson)) err(`Error: no package.json found in ${projectDirectoryPath}.`)
  return packageJson
}

const createConfig = (projectDirectoryPath: string, answers: Answers): string => {
  const config: Config = {
    schema: answers.schema,
    outputDir: answers.output_dir,
    generateTypes: answers.types === false ? false : undefined,
    generateORM: answers.orm === false ? false : undefined,
    generateGraphQLOperations: answers.graphql === false ? false : undefined,
  }
  const ext = answers.config.toLocaleLowerCase().endsWith('.json') ? 'json' : 'yml'
  const content = ext === 'json' ? JSON.stringify(config) : new yaml.Document(config).toString()
  const configPath = path.join(projectDirectoryPath, answers.config)
  fs.writeFileSync(configPath, content, { encoding: 'utf-8' })

  return configPath
}

const updatePackage = async (packagePath: string, answers: Answers) => {
  const pkgContent = fs.readFileSync(packagePath, { encoding: 'utf-8' })
  const pkg = JSON.parse(pkgContent)

  if (!pkg.scripts) {
    pkg.scripts = {}
  }

  pkg.scripts[answers.script] = `typetta generate --config ${answers.config}`

  // plugin
  if (!pkg.devDependencies) {
    pkg.devDependencies = {}
  }

  fs.writeFileSync(packagePath, JSON.stringify(pkg, null, 2))
}

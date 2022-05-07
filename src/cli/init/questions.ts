import chalk from 'chalk'
import inquirer from 'inquirer'

export type Answers = {
  schema: string
  output_dir: string
  types: boolean
  orm: boolean
  graphql: boolean
  script: string
  config: string
}

export function getQuestions(): inquirer.QuestionCollection {
  return [
    {
      type: 'input',
      name: 'schema',
      message: 'Where is your schema?:',
      suffix: chalk.gray(' (path or url)'),
      default: '**/*.typedefs.ts',
      validate: (str: string) => str.length > 0,
    },
    {
      type: 'input',
      name: 'output_dir',
      message: 'Where to generate types and helpers:',
      default: 'src/generated',
      validate: (str: string) => str.length > 0,
    },
    {
      type: 'confirm',
      name: 'types',
      message: 'Would you like to generate entity types?',
    },
    {
      type: 'confirm',
      name: 'orm',
      message: 'Would you like to generate the ORM?',
    },
    {
      type: 'confirm',
      name: 'graphql',
      message: 'Would you like to generate GraphQL operations?',
    },
    {
      type: 'input',
      name: 'script',
      message: 'What script in package.json should run the generation?',
      validate: (str: string) => str.length > 0,
      default: 'generate',
    },
    {
      type: 'input',
      name: 'config',
      message: 'How to name the Typetta config file?',
      default: 'typetta.yml',
      validate: (str: string) => {
        const isNotEmpty = str.length > 0
        const hasCorrectExtension = ['json', 'yaml', 'yml'].some((ext) => str.toLocaleLowerCase().endsWith(`.${ext}`))

        return isNotEmpty && hasCorrectExtension
      },
    },
  ]
}

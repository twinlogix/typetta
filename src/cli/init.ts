import chalk from 'chalk'
import fs from 'fs'
import path from 'path'
import yaml from 'yaml'

const TYPETTA_DIRNAME = '.typetta'
const CODEGEN_FILENAME = 'codegen.yml'
const SRC_DIRNAME = 'src'
const TYPEDEFS_FILENAME = 'model.typedefs.ts'
const TYPES_GENERATED_FILENAME = 'types.generated.ts'
const DAOCONTEXT_GENERATED_FILENAME = 'dao-context.generated.ts'

export default (projectDirectory = './') => {
  console.log()

  checkProjectDirectory(projectDirectory)

  const root = path.resolve(projectDirectory)
  const typettaDirectory = path.join(root, TYPETTA_DIRNAME)
  const codegenFilePath = path.join(typettaDirectory, CODEGEN_FILENAME)
  const srcDirectory = path.join(root, SRC_DIRNAME)
  const typedefsFilePath = path.join(srcDirectory, TYPEDEFS_FILENAME)

  console.log(`Setting up Typetta in ${chalk.green(root)}.`)

  if (!fs.existsSync(srcDirectory)) {
    fs.mkdirSync(srcDirectory)
  }
  fs.writeFileSync(typedefsFilePath, exampleTypeDefs())

  fs.mkdirSync(typettaDirectory)
  fs.writeFileSync(codegenFilePath, buildCodeGen())

  console.log(`GraphQL code generation setup ${chalk.green('completed')}.`)
  console.log()
}

const checkProjectDirectory = (projectDirectory: string) => {
  const err = (msg: string) => {
    console.error(chalk.red(msg))
    console.log()
    process.exit(1)
  }
  const root = path.resolve(projectDirectory)
  if (!fs.existsSync(root)) err(`Error: path ${root} does not exist.`)

  const typettaDirectory = path.join(root, TYPETTA_DIRNAME)
  if (fs.existsSync(typettaDirectory)) err(`Error: directory ${TYPETTA_DIRNAME} already exists in ${root}.`)

  const srcDirectory = path.join(root, SRC_DIRNAME)
  const typedefsFilePath = path.join(srcDirectory, TYPEDEFS_FILENAME)
  if (fs.existsSync(typedefsFilePath)) err(`Error: directory ${srcDirectory} already contains a ${TYPEDEFS_FILENAME} file.`)

  const typesGeneratedFilePath = path.join(srcDirectory, TYPES_GENERATED_FILENAME)
  if (fs.existsSync(typesGeneratedFilePath)) err(`Error: directory ${srcDirectory} already contains a ${TYPES_GENERATED_FILENAME} file.`)

  const daoContextGeneratedFilePath = path.join(srcDirectory, DAOCONTEXT_GENERATED_FILENAME)
  if (fs.existsSync(daoContextGeneratedFilePath)) err(`Error: directory ${srcDirectory} already contains a ${DAOCONTEXT_GENERATED_FILENAME} file.`)
}

const buildCodeGen = () => {
  const yamlDocument = new yaml.Document()
  yamlDocument.contents = {
    schema: ['./*.graphql', './**.typedefs.ts'],
    overwrite: true,
    generates: {
      [`${SRC_DIRNAME}/types.generated.ts`]: {
        plugins: ['typescript'],
      },
      [`${SRC_DIRNAME}/dao-context.generated.ts`]: {
        plugins: ['@twinlogix/typetta'],
        config: {
          tsTypesImport: './types.generated',
        },
      },
    },
  }
  return yamlDocument.toString()
}

const exampleTypeDefs = () => `import { gql } from 'graphql-tag'

export default gql\`
  type User @entity {
    id: ID! @id
    firstName: String!
    lastName: String!
    posts: [Post!] @foreignRef
  }

  type Post @entity {
    id: ID! @id
    authorId: ID!
    author: User! @innerRef
    content: String!
  }
\``

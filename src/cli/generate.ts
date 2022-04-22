import { generate } from '@graphql-codegen/cli'
import chalk from 'chalk'
import { fstatSync } from 'fs'
import fs from 'fs'
import path from 'path'
import yaml from 'yaml'

const TYPETTA_DIRNAME = '.typetta'
const CODEGEN_FILENAME = 'codegen.yml'

export default async () => {
  checkCodegen()
  const typettaDirectory = path.join(path.resolve(), TYPETTA_DIRNAME)
  const codegenFilePath = path.join(typettaDirectory, CODEGEN_FILENAME)
  const codegenConfg = yaml.parse(fs.readFileSync(codegenFilePath).toString())
  await generate(codegenConfg)
}

const checkCodegen = () => {
  const err = (msg: string) => {
    console.error(chalk.red(msg))
    process.exit(1)
  }
  const root = path.resolve()
  const typettaDirectory = path.join(root, TYPETTA_DIRNAME)
  const codegenFilePath = path.join(typettaDirectory, CODEGEN_FILENAME)
  if (!fs.existsSync(codegenFilePath)) err(`Error: ${codegenFilePath} not found.`)
}

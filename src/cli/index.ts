#!/usr/bin/env node
import generate from './generate/generate'
import init from './init/init'
import { TYPETTA_COLOR } from './utils'
import chalk from 'chalk'
import { Command } from 'commander'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const packageJson = require('../../package.json')

const program = new Command('typetta')
  .version(packageJson.version)
  .description(`${chalk.bold.underline.hex(TYPETTA_COLOR)('The offical CLI (Command Line Interface) for the Typetta framework.')}`)
  .usage('<command> [options]')
  .addHelpCommand(false)
  .helpOption(false)

program
  .command('init')
  .argument('[project-directory]', "[project-directory] where you'd like to setup Typetta")
  .description('Setup a new Typetta project or add Typetta to an existing one.')
  .action(init)

program
  .command('generate')
  .option('-c, --config <config>', 'The Typetta configuration file.')
  .option('-w, --watch', 'The generate command will continue to watch and re-generate.')
  .description('Generate types and ORM files.')
  .action(generate)

program.parse(process.argv)

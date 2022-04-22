#!/usr/bin/env node
import packageJson from '../../package.json'
import init from './init'
import { Command } from 'commander'

const program = new Command('typetta')
  .version(packageJson.version)
  .description('The offical Command Line Interface for the Typetta framework.')
  .usage('<command>')
  .addHelpCommand(false)
  .helpOption(false)

program
  .command('init')
  .argument('<project-directory>', "<project-directory> where you'd like to setup Typetta", './')
  .description('Setup a new Typetta project or add Typetta to an existing one.')
  .action(init)

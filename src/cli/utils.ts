import chalk from 'chalk'

export const TYPETTA_COLOR = '#bf1c31'

export const err = (msg: string) => {
  console.error(chalk.red(msg))
  console.log()
  process.exit(1)
}

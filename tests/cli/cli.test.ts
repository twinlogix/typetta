import { exec, ExecException } from 'child_process'
import fs from 'fs'
import path from 'path'

type CLIResponse = { error: ExecException | null; stdout: string; stderr: string }

const cli = (args: string[], cwd: string): Promise<CLIResponse> => {
  return new Promise<CLIResponse>((resolve) => {
    exec(`node ${path.resolve('./lib/src/cli/index')} ${args.join(' ')}`, { cwd }, (error, stdout, stderr) => {
      resolve({
        error,
        stdout,
        stderr,
      })
    })
  })
}

beforeAll(() => {
  fs.mkdirSync('.cli-test')
})

test('cli', async () => {
  const result = await cli(['init'], './.cli-test')
  expect(result.error).toBe(null)
})

afterAll(() => {
  fs.rmdirSync('.cli-test', { recursive: true })
})

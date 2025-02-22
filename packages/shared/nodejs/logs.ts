import { exec } from 'node:child_process'
import fs from 'node:fs'

import { checkAndCreateDir, checkFile, joinPath } from './index'

const logcat = {
  path: '',
  // format(type: 'info' | 'error' | 'warn' | 'debug', message: string) {
  //   return `[${dateFormat(new Date())}] [${type.toUpperCase()}] ${message}\n`
  // },
  log(message: string) {
    fs.appendFile(this.path, `${message}\n`, (error) => {
      if (error) console.error('write color error:', error)
    })
  },
}
export const createSimpleLogcat = async (path: string, name: string) => {
  const instence = Object.create(logcat) as typeof logcat
  await checkAndCreateDir(path)
  instence.path = joinPath(path, name)
  return (message: string) => {
    instence.log(message)
  }
}

export const readLastLines = async (filePath: string, lineCount = 100) => {
  if (!(await checkFile(filePath))) return ''
  return new Promise<string>((resolve, reject) => {
    let command

    if (process.platform === 'win32') {
      // Windows 系统下使用 PowerShell 来获取文件的最后100行
      command = `powershell -Command "Get-Content ${filePath} | Select-Object -Last ${lineCount}"`
    } else {
      // Linux/macOS 系统下使用 tail 命令
      command = `tail -n ${lineCount} ${filePath}`
    }

    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error('exec error:', error)
        reject(error)
        return
      }
      if (stderr) {
        console.error('stderr:', stderr)
        reject(new Error(stderr))
        return
      }
      resolve(stdout)
    })
  })
}

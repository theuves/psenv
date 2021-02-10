#!/usr/bin/env node
const fs = require('fs')
const minimist = require('minimist')
const { version } = require('./package.json')
const getParameters = require('./get-parameters')
const opts = minimist(process.argv.slice(2))
const path = opts._[0]

if (opts.v || opts.version) {
  logInfo(`v${version}`)
}

if (!path || options.help) {
  logInfo(`Usage: psenv <PATH> [OPTION]...

Options:
  --output=FILENAME  write to a file (e.g. --output=.env)
  --to-upper-case    convert the name to upper case (e.g. name to NAME)
  --recursive        retrieve all parameters within a hierarchy
  --is-dotenv        output with the format NAME=value
  --is-cmd           output for Windows Command Prompt (cmd.exe)
  -h, --help         print this message
  -v, --version      print the current version of psenv`)
}

if (!path) {
  logInfo(`Usage: psenv <PATH> [OPTION]...
Try 'psenv --help' to more information.`)
}

getParameters(path, opts.recursive)
  .then(processParameters)
  .catch(() => logError('Unable to get parameters.'))

function processParameters(parameters) {
  const variables = parameters
    .flat() // The initial 'parameters' value will be a array of arrays
    .map(({ name, value }) => toVariable(name, value))
    .join('\n')

  if (opts.output) {
    fs.writeFile(opts.output, raw, (error) => {
      if (error) logError(`Unable to create the file.`)
      logInfo('File is created successfully.')
    })
  } else {
    logInfo(variables)
  }
}

function toVariable(name, value) {
  name = getName(name)
  if (opts.toUpperCase)
    name = name.toUpperCase()
  if (opts.output || opts.isDotenv)
    return `${name}=${value}`
  if (opts.isCmd)
    return `set "${name}=${value}"`
  return `export ${name}=${value}`
}

/*
 * Get the "environment variable" name from path
 * @example
 * getName('/foo/bar/BAZ')
 * // 'BAZ'
 */
function getName(path) {
  return path
    .split('/')
    .reverse()[0]
}

function logInfo(message) {
  console.log(message)
  process.exit(0)
}

function logError(message) {
  console.error('[error] %s', message)
  process.exit(1)
}
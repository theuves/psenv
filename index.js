#!/usr/bin/env node
const fs = require('fs')
const minimist = require('minimist')
const { version } = require('./package.json')
const getParameters = require('./get-parameters')
const opts = minimist(process.argv.slice(2))
const paths = opts._

if (opts.v || opts.version) {
  logInfo(`v${version}`)
}

if (opts.h || opts.help) {
  logInfo(`Usage: psenv [OPTION]... <PATH>...

Options:
  --output=FILENAME  write to a file (e.g. --output=.env)
  --to-upper-case    convert the name to upper case (e.g. name to NAME)
  --recursive        retrieve all parameters within a hierarchy
  --is-dotenv        output with the format NAME=value
  --is-cmd           output for Windows Command Prompt (cmd.exe)
  -h, --help         print this message
  -v, --version      print the current version of psenv`)
}

if (paths.length === 0) {
  logInfo(`Usage: psenv [OPTION]... <PATH>...
Try 'psenv --help' for more information.`)
}

// Every path must starts with a slash ('/')
for (let path of paths) {
  if (!path.startsWith('/'))
    logError(`Invalid path: ${path}`)
}

getParameters(paths, opts.recursive)
  .then(processParameters)
  .catch(() => logError('Unable to get parameters.'))

function processParameters(parameters) {
  const variables = parameters
    .flat() // The initial 'parameters' value will be a array of arrays
    .map(({ Name, Value }) => toVariable(Name, Value))
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
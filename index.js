#!/usr/bin/env node
const fs = require('fs');
const minimist = require('minimist');
const { version } = require('./package.json');
const getParameters = require('./get-parameters');
const opts = minimist(process.argv.slice(2));
const path = opts._[0];

if (!path) {
  logError(`Usage: psenv <PATH> [OPTION]...
Try 'psenv --help' to more information.`);
}

if (opts.v || opts.version) {
  logMessage("v%s", version);
}

if (!path || options.help) {
  logMessage(`Usage: psenv <PATH> [OPTION]...

Options:
  --output=FILENAME  Write to a file (e.g. --output=.env)
  --to-upper-case    Convert the name to upper case (e.g. name to NAME)
  --recursive        Retrieve all parameters within a hierarchy
  --is-dotenv        Output with the format NAME=value
  --is-cmd           Output for Windows Command Prompt (cmd.exe)
  -h, --help         Print this message
  -v, --version      Print the current version of psenv`);
}

getParameters(path, opts.recursive)
  .then(processParameters)
  .catch(() => logError('Unable to get parameters.'));

function logMessage(message) {
  console.log(message);
  process.exit(0);
}

function logError(message) {
  console.error(`[error] ${message}`);
  process.exit(1);
}

function processParameters(parameters) {
  const variables = parameters
    .flat() // The initial 'parameters' value will be Array of Arrays
    .map(({ name, value }) => toVariable(name, value))
    .join('\n');

  if (opts.output) {
    fs.writeFile(opts.output, raw, (error) => {
      if (error) logError(`Unable to create the file.`);
      logMessage('File is created successfully.');
    })
  } else {
    logMessage(variables);
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
 * getName('/foo/bar/BAZ') === 'BAZ'
 */
function getName(path) {
  return path
    .split('/')
    .reverse()[0];
}

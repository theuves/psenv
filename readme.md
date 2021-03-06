# `psenv`

> AWS SSM Parameter Store to environment variables.

![NPM downloads per month](https://img.shields.io/npm/dm/psenv-cli)
![NPM version](https://img.shields.io/npm/v/psenv-cli)
![License](https://img.shields.io/npm/l/psenv-cli)

A command-line tool to get parameters from [AWS Systems Manager Parameter Store](https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-parameter-store.html) as environment variables. Useful to pass environment variables to containers in [ECS](https://aws.amazon.com/pt/ecs/?whats-new-cards.sort-by=item.additionalFields.postDateTime&whats-new-cards.sort-order=desc&ecs-blogs.sort-by=item.additionalFields.createdDate&ecs-blogs.sort-order=desc) when you haven't an implementation in the code or when you don't want to pass the parameters to [task definition via `Secret`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-secret.html) (with `valueFrom`).

## Installation

- [NPM](https://www.npmjs.com/) &mdash; `npm install --global psenv-cli`
- [Yarn](https://yarnpkg.com/) &mdash; `yarn global add psenv-cli`

## Usage

Type `psenv --help`.

```
Usage: psenv <PATH> [OPTION]...

Options:
    --output=FILENAME   Write to a file (e.g. --output=.env)
    --to-upper-case     Convert the name to upper case (e.g. name to NAME)
    --recursive         Retrieve all parameters within a hierarchy
    --is-dotenv         Output with the format NAME=value
    --is-cmd            Output for Windows Command Prompt (cmd.exe)
    -h, --help          Print this message
    -v, --version       Print the current version of psenv
```

## Example

Suppose you have the following parameters in the Parameter Store:

| Name             | Value         |
|:-----------------|:--------------|
| `/dev/NODE_ENV`  | `development` |
| `/dev/name`      | `foo`         |
| `/prod/NODE_ENV` | `production`  |
| `/prod/name`     | `bar`         |

```bash
$ psenv /dev
export NODE_ENV='development'
export name='foo'
```

### `--output=FILENAME`

> Write to a file (e.g. `--output=.env`).

```bash
$ psenv /dev --output=.env.development
File is created successfully.

$ cat .env.development
NODE_ENV='development'
name='foo'
```

### `--to-upper-case`

> Convert the name to upper case (e.g. `name` to `NAME`).

```bash
$ psenv /dev --to-upper-case
export NODE_ENV='development'
export NAME='foo'
```

### `--recursive`

> Retrieve all parameters within a hierarchy.

```bash
$ psenv / --recursive
export NODE_ENV='development'
export name='foo'
export NODE_ENV='production'
export name='bar'
```

### `--is-dotenv`

> Output with the format `NAME=value`.

```bash
$ psenv /dev --is-dotenv
NODE_ENV='development'
name='foo'
```

### `--is-cmd`

> Output for Windows Command Prompt (cmd.exe).

```bash
$ psenv /dev --is-cmd
set "NODE_ENV=development"
set "name=foo"
```

## License

Copyright &copy; 2021 by [Matheus Alves](https://theuves.me/).

Licensed under MIT license.

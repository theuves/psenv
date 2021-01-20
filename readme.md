# psenv

> AWS SSM Parameter Store to environment variables.

## Installation

```bash
npm install psenv-cli
```

### Usage

```
Usage: psenv <PATH> [OPTION]...

Options:
    --filename=FILENAME   Export to a .env file (default name is ".env")
    --to-upper-case       Convert the name to uppercase (e.g. name to NAME)
    --recursive           Retrieve all parameters within a hierarchy
    --is-dotenv           Output with the format "NAME=value"
    --is-cmd              Output for Windows Command Prompt (cmd.exe)
    -h, --help            Print this message
    -v, --version         Print the current version of psenv
```

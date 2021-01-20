let path;

const options = {
	filename: undefined,
    toUpperCase: false,
    recursive: false,
	isDotEnv: false,
    isCmd: false,
};

const args = process.argv.slice(2);

for (let arg of args) {
    switch (arg) {
		case '--to-upper-case': {
			options.toUpperCase = true;
			break;
        }
        case '--recursive': {
			options.recursive = true;
			break;
		}
		case '--is-dotenv': {
			options.isDotEnv = true;
			break;
		}
        case '--is-cmd': {
            options.isCmd = true;
            break;
		}
        default: {
            const name = arg.split('=')[0];
            const value = arg.split('=').slice(1).join('=');

            if (name === '--filename') {
                options.filename = value || '.env';
                continue;
            }
            if (arg.startsWith('-')) {
                console.error(`[error] Invalid option: '${arg}'`);
                process.exit(1);
            }
            if (path) {
                console.error(`[error] Invalid argument: '${arg}'`);
                process.exit(1);
            }

            path = arg;
        }
    }
}

const allArgsWithIsPrefix = args.filter(arg => arg.startsWith('--is-'));

if (allArgsWithIsPrefix.length > 0 && options.filename) {
    const invalidOption = allArgsWithIsPrefix[0];
    console.error(`[error] --filename could not be used with ${invalidOption}`);
    process.exit(1);
}

if (allArgsWithIsPrefix.length > 1) {
    const conflicts = allArgsWithIsPrefix.slice(0, 2);
    console.error(`[error] Conflict between ${conflicts.join(' and ')}.`);
    process.exit(1);
}

if (!path) {
    console.log(`Usage: psenv <PATH> [OPTION]...

Options:
    --filename=FILENAME   Export to a .env file (default name is ".env")
    --to-upper-case       Convert the name to uppercase (e.g. name to NAME)
    --recursive           Retrieve all parameters within a hierarchy
    --is-dotenv           Output with the format "NAME=value"
    --is-cmd              Output for Windows Command Prompt (cmd.exe)`);
    process.exit(1);
}

if (!path.startsWith('/')) {
    console.error(`[error] Path must starts with '/'.`);
    process.exit(1);
}

const getParameters = require('./get-parameters');

getParameters(path, options.recursive).then((allParameters) => {
    const variables = allParameters.flat().map(({name, value}) => {
        name = name.split('/').reverse()[0];

        if (options.toUpperCase) {
            name = name.toUpperCase();
        }
        if (options.filename || options.isDotEnv) {
            return `${name}=${value}`;
        }
        if (options.isCmd) {
            return `set "${name}=${value}"`;
        }

        return `export ${name}=${value}`;
    })

    const raw = variables.join('\n');

    if (options.filename) {
        const fs = require('fs');

        fs.writeFile(options.filename, raw, (error) => {
            if (error) {
                console.error(`[error] Unable to create the file.`);
                process.exit(1);
            }

            console.log('File is created successfully.');
            process.exit(0);
        }); 
    } else {
        console.log(raw);
    }
}).catch(() => {
    console.error(`[error] Unable to get parameters.`);
    process.exit(1);
})
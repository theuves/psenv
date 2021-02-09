const SSM = require('aws-sdk/clients/ssm');

const ssm = new SSM();

function getParameters(path, isRecursive = false) {
    return new Promise((resolve, reject) => {
        const allParameters = [];

        const getParametersByPath = (path, nextToken = undefined) => {
            const options = {
                Path: path,
                WithDecryption: true,
                Recursive: isRecursive,
                NextToken: nextToken,
            };

            ssm.getParametersByPath(options, (err, data) => {
                if (err) {
                    reject(new Error('Unable to get the parameters.'));
                    return;
                }

                const parameters = data
                    .Parameters
                    .map(({ Name, Value }) => ({
                        name: Name,
                        value: Value,
                    }));

                allParameters.push(parameters);

                if (data.NextToken) {
                    getParametersByPath(path, data.NextToken);
                } else {
                    resolve(allParameters);
                    return;
                }
            });
        }

        getParametersByPath(path);
    });
}

module.exports = getParameters;
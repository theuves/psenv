const AWSSSM = require('aws-sdk/clients/ssm')
const ssmClient = new AWSSSM()

module.exports = function getParameters(path, isRecursive = false) {
  return new Promise((resolve, reject) => {
    const allParameters = []
    const getParametersByPath = (path, nextToken = undefined) => {
      const options = {
        Path: path,
        WithDecryption: true,
        Recursive: isRecursive,
        NextToken: nextToken,
      }

      ssmClient.getParametersByPath(options, (err, data) => {
        if (err) {
          reject(new Error('Unable to get the parameters.'))
        } else {
          const parameters = data
            .Parameters
            .map(({ Name, Value }) => ({
              name: Name,
              value: Value,
            }))

          allParameters.push(parameters)
          if (data.NextToken) getParametersByPath(path, data.NextToken)
          else resolve(allParameters)
        }
      })
    }

    getParametersByPath(path)
  })
}
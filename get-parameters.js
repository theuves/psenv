const AWSSSM = require('aws-sdk/clients/ssm')
const ssmClient = new AWSSSM()

module.exports = function getParameters(paths, isRecursive = false) {
  return new Promise((resolve, reject) => {
    let index = 0
    const parameters = []
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
          if (data.NextToken) {
            getParametersByPath(path, data.NextToken)
          } else {
            parameters.push(data.Parameters)
            if (paths.length - 1 === index) {
              resolve(parameters)
            } else {
              index += 1
              getParametersByPath(paths[index])
            }
          }
        }
      })
    }
    getParametersByPath(paths[index])
  })
}
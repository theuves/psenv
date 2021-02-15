const AWSSSM = require('aws-sdk/clients/ssm')
const ssmClient = new AWSSSM()

module.exports = function getParameters(paths, isRecursive = false) {
  return new Promise((resolve, reject) => {
    let index = 0
    const parameters = []
    const getParametersByPath = (path, nextToken = undefined) => {
      const opts = {
        Path: path,
        WithDecryption: true,
        Recursive: isRecursive,
        NextToken: nextToken,
      }
      ssmClient.getParametersByPath(opts, (err, data) => {
        if (err) {
          reject(new Error('Unable to get the parameters.'))
        } else {
          // If the path has more than 10 parameters then will be returned a
          // token (.NextToken) to get the next 10 parameters, and so on
          if (data.NextToken) {
            getParametersByPath(path, data.NextToken)
          } else {
            parameters.push(data.Parameters)
            if (index > paths.length - 1) {
              index++
              getParametersByPath(paths[index])
            } else {
              resolve(parameters)
            }
          }
        }
      })
    }
    getParametersByPath(paths[index])
  })
}
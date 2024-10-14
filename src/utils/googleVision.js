const AWS = require('aws-sdk');
const lambda = new AWS.Lambda();

exports.invokeGoogleVision = async (s3Url) => {
  const params = {
    FunctionName: process.env.LAMBDA_FUNCTION_NAME,
    Payload: JSON.stringify({ s3Url }),
  };

  const result = await lambda.invoke(params).promise();
  return JSON.parse(result.Payload);
};

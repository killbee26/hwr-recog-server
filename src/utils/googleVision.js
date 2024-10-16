const AWS = require('aws-sdk');
const lambda = new AWS.Lambda();

exports.invokeGoogleVision = async (s3Key) => {
  const params = {
    FunctionName: process.env.LAMBDA_FUNCTION_NAME,
    Payload: JSON.stringify({ s3Key }),
  };

  const result = await lambda.invoke(params).promise();
  return JSON.parse(result.Payload);
};

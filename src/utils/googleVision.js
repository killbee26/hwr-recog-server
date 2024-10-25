const AWS = require('aws-sdk');
const lambda = new AWS.Lambda({region : "eu-north-1"});
require('dotenv').config();

exports.invokeGoogleVision = async (s3Key) => {

  console.log("function name: ",process.env.LAMBDA_FUNCTION_NAME)
  const params = {
    FunctionName: process.env.LAMBDA_FUNCTION_NAME,
    Payload: JSON.stringify({ s3Key }),
  };

  const result = await lambda.invoke(params).promise();
  console.log(result.Payload);
  return JSON.parse(result.Payload);
};

import { Lambda } from 'aws-sdk';

const lambda = new Lambda();
const lambdaFunction = process.env.LAMBDA_FUNCTION_NAME as string;
export const invokeGoogleVision = async (s3Url: string) => {
  const params = {
    FunctionName: lambdaFunction,
    Payload: JSON.stringify({ s3Url }),
  };

  const result = await lambda.invoke(params).promise();
  return JSON.parse(result.Payload as string);
};

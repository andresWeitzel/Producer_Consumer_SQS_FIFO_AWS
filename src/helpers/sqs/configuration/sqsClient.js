//External
const { SQSClient } = require("@aws-sdk/client-sqs");
//Environment Vars
const ACCESS_KEY = process.env.AWS_ACCESS_KEY_RANDOM_VALUE;
const SECRET_KEY = process.env.AWS_SECRET_KEY_RANDOM_VALUE;
const REGION = process.env.REGION;
const ENDPOINT = process.env.SQS_URL;


/**
 * @description create and configure sqs client
 * @returns a sqs client
 */
const sqsClient = async () => {
  try {
    const client = new SQSClient({
      accessKeyId: ACCESS_KEY,
      secretAccessKey: SECRET_KEY,
      region: REGION,
      endpoint: ENDPOINT,
    });

    return client;

  } catch (error) {
    console.error(
      `ERROR in sqsClient() function. Caused by ${error} . Specific stack is ${error.stack} `
    );
  }
};

module.exports = { sqsClient };

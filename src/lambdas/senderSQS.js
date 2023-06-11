//Environment Vars
const REGION = process.env.AWS_REGION;
const ACCESS_KEY = process.env.AWS_ACCESS_KEY_RANDOM_VALUE;
const SECRET_KEY = process.env.AWS_SECRET_KEY_RANDOM_VALUE;
const ENDPOINT = process.env.SQS_URL;
const QUEUE_FIFO_ONE_URL = process.env. QUEUE_FIFO_ONE_URL; 


module.exports.handler = async (event) => {

  const AWS = require("aws-sdk");
  
  const SQS = new AWS.SQS({
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_KEY,
    endpoint: ENDPOINT
  });

  try {

    const queueParams = {
      Entries: [
        {
          Id: "1",
          MessageBody: "this is a message body",
        }
      ],
      QueueUrl: QUEUE_FIFO_ONE_URL
    }

    const result = await SQS.sendMessageBatch(queueParams).promise();
    console.log(JSON.stringify(result, null, 2));
  } catch (e) {
    console.error(e);
  }
};

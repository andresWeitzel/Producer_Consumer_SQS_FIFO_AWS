//External
const { GetQueueAttributesCommand } = require("@aws-sdk/client-sqs");
//Environment Vars
const QUEUE_FIFO_ONE_URL = process.env.QUEUE_FIFO_ONE_URL;
//Enums
const { statusCode } = require("../enums/http/statusCode");
//Helpers
const { requestResult } = require("../helpers/http/requestResult");
const { sqsClient } = require("../helpers/sqs/configuration/sqsClient");
//Const-vars
let client;
let msg;
let code;

module.exports.handler = async (event) => {
  try {
    client = await sqsClient();

    const command = new GetQueueAttributesCommand({
      QueueUrl: QUEUE_FIFO_ONE_URL,
      AttributeNames: [
        'ApproximateNumberOfMessages',
        'ApproximateNumberOfMessagesDelayed',
        'ApproximateNumberOfMessagesNotVisible',
        'CreatedTimestamp',
        'LastModifiedTimestamp',
        'QueueArn',
        'VisibilityTimeout'
      ]
    });

    console.log("Getting queue attributes with command:", JSON.stringify(command, null, 2));
    const response = await client.send(command);
    console.log("Queue attributes received:", JSON.stringify(response, null, 2));

    if (response && response.Attributes) {
      return await requestResult(statusCode.OK, {
        message: "Queue information retrieved successfully",
        queueInfo: {
          url: QUEUE_FIFO_ONE_URL,
          approximateNumberOfMessages: response.Attributes.ApproximateNumberOfMessages,
          approximateNumberOfMessagesDelayed: response.Attributes.ApproximateNumberOfMessagesDelayed,
          approximateNumberOfMessagesNotVisible: response.Attributes.ApproximateNumberOfMessagesNotVisible,
          createdTimestamp: new Date(parseInt(response.Attributes.CreatedTimestamp)).toISOString(),
          lastModifiedTimestamp: new Date(parseInt(response.Attributes.LastModifiedTimestamp)).toISOString(),
          queueArn: response.Attributes.QueueArn,
          visibilityTimeout: response.Attributes.VisibilityTimeout
        }
      });
    } else {
      return await requestResult(
        statusCode.BAD_REQUEST,
        "BAD REQUEST. UNABLE TO RETRIEVE QUEUE INFORMATION"
      );
    }
  } catch (error) {
    code = statusCode.INTERNAL_SERVER_ERROR;
    msg = `Error in LIST SQS lambda. Caused by ${error}`;
    console.error(`${msg}. Stack error type : ${error.stack}`);

    return await requestResult(code, msg);
  }
}; 
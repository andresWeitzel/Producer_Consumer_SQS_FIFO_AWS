//External
const { SendMessageCommand } = require("@aws-sdk/client-sqs");
//Environment Vars
const QUEUE_FIFO_ONE_URL = process.env.QUEUE_FIFO_ONE_URL;
//Enums
const { statusCode } = require("../enums/http/statusCode");
const { value } = require("../enums/general/values");
//Helpers
const { requestResult } = require("../helpers/http/requestResult");
const { generateUuidV4 } = require("../helpers/math/generateUuid");
const { sqsClient } = require("../helpers/sqs/configuration/sqsClient");
//Const-vars
let client;
let uuid;
let msg;
let code;

module.exports.handler = async (event) => {
  try {
    client = await sqsClient();

    uuid = await generateUuidV4();
    const body = JSON.parse(event.body);

    const command = new SendMessageCommand({
      QueueUrl: QUEUE_FIFO_ONE_URL,
      MessageBody: JSON.stringify(body.message),
      MessageDeduplicationId: uuid,
      MessageGroupId: "group1",
      MessageAttributes: {
        "StringValue": {
          DataType: "String",
          StringValue: "Example for sender an object inside de MessageAttributes"
        }
      }
    });

    console.log("Sending message with command:", JSON.stringify(command, null, 2));
    const response = await client.send(command);
    console.log("Message sent successfully:", JSON.stringify(response, null, 2));

    if (response != value.IS_NULL || response != value.IS_UNDEFINED) {
      return await requestResult(statusCode.OK, {
        message: "Message sent successfully",
        messageId: response.MessageId,
        messageDeduplicationId: uuid,
        messageGroupId: "group1"
      });
    } else {
      return await requestResult(
        statusCode.BAD_REQUEST,
        "BAD REQUEST. UNABLE TO SEND MESSAGE TO QUEUE"
      );
    }
  } catch (error) {
    code = statusCode.INTERNAL_SERVER_ERROR;
    msg = `Error in SENDER SQS lambda. Caused by ${error}`;
    console.error(`${msg}. Stack error type : ${error.stack}`);

    return await requestResult(code, msg);
  }
};

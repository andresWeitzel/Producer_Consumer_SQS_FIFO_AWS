//External
const { SendMessageCommand } = require("@aws-sdk/client-sqs");
//Environment Vars
const QUEUE_FIFO_ONE_URL = process.env.QUEUE_FIFO_ONE_URL;
//Enums
const { statusCode } = require("../enums/http/statusCode");
const { value } = require("../enums/general/values");
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

    const command = new SendMessageCommand({
      QueueUrl: QUEUE_FIFO_ONE_URL,
      DelaySeconds: 0,
      MessageDeduplicationId: "STRING_VALUE",
      MessageGroupId: "STRING_VALUE",
      MessageBody:
        "Information about current NY Times fiction bestseller for week of 12/11/2016.",
      MessageAttributes: {
        Title: {
          DataType: "String",
          StringValue: "The Whistler",
        },
        Author: {
          DataType: "String",
          StringValue: "John Grisham",
        },
        WeeksOn: {
          DataType: "Number",
          StringValue: "6",
        },
      },
    });

    const response = await client.send(command);

    if (response != value.IS_NULL || response != value.IS_UNDEFINED) {
      return await requestResult(statusCode.OK, command);
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

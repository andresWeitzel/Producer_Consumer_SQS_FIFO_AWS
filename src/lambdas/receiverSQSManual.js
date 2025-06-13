//External
const { DeleteMessageCommand, ReceiveMessageCommand } = require("@aws-sdk/client-sqs");
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

const deleteMessage = async (receiptHandle) => {
  try {
    const command = new DeleteMessageCommand({
      QueueUrl: QUEUE_FIFO_ONE_URL,
      ReceiptHandle: receiptHandle,
    });
    await client.send(command);
    return true;
  } catch (error) {
    console.error("Error deleting message:", error);
    return false;
  }
};

const receiveMessage = async () => {
  try {
    const command = new ReceiveMessageCommand({
      QueueUrl: QUEUE_FIFO_ONE_URL,
      MaxNumberOfMessages: 1,
      WaitTimeSeconds: 2,
      VisibilityTimeout: 30,
      MessageAttributeNames: ["All"],
      AttributeNames: ["All"]
    });
    const response = await client.send(command);
    return response.Messages?.[0];
  } catch (error) {
    console.error("Error receiving message:", error);
    return null;
  }
};

const processMessage = async (message) => {
  try {
    console.log("Processing message manually:", message);
    return {
      messageId: message.MessageId,
      body: message.Body,
      attributes: message.MessageAttributes,
      processedAt: new Date().toISOString(),
      processingType: "manual"
    };
  } catch (error) {
    console.error("Error processing message:", error);
    return null;
  }
};

exports.handler = async (event) => {
  try {
    client = await sqsClient();
    const processedMessages = [];

    // Obtener y procesar el mensaje de la cola
    const message = await receiveMessage();
    if (message) {
      const processedMessage = await processMessage(message);
      if (processedMessage) {
        const deleted = await deleteMessage(message.ReceiptHandle);
        if (deleted) {
          processedMessages.push(processedMessage);
        }
      }
    }

    return await requestResult(statusCode.OK, {
      message: processedMessages.length > 0 ? "Message processed manually" : "No messages available to process",
      processedMessages
    });
  } catch (error) {
    code = statusCode.INTERNAL_SERVER_ERROR;
    msg = `Error in RECEIVER SQS MANUAL lambda. Caused by ${error}`;
    console.error(`${msg}. Stack error type : ${error.stack}`);

    return await requestResult(code, msg);
  }
}; 
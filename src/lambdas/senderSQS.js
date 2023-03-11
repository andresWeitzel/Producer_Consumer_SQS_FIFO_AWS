//Environment Vars
const REGION = process.env.REGION;
const RECEIVER_QUEUE_URL = process.env.RECEIVER_QUEUE_URL;

//External
var AWS = require("aws-sdk");

//Helpers
const { requestResult } = require("../helpers/http/bodyResponse");
const { statusCode } = require("../enums/http/statusCode");

//Const/Vars
const sqs = new AWS.SQS({
  region: REGION,
});
const queueUrl = RECEIVER_QUEUE_URL;
let accountId;
let response;

module.exports.handler = function (event, context, callback) {
  
  response = null;
  accountId = context.invokedFunctionArn.split(":")[4];

  // response and status of HTTP endpoint
  var responseBody = {
    message: "",
  };

  // SQS message parameters
  var params = {
    MessageBody: event.body,
    QueueUrl: queueUrl,
    MessageAttributes: {
        AttributeName: {
          StringValue: "Attribute Value",
          DataType: "String",
        },
      },
  };

  sqs.sendMessage(params, async function (err, data) {
    if (err) {
      let msg = "Failed to send message" + err;

      response = await requestResult(
        statusCode.INTERNAL_SERVER_ERROR,
        msg,
        event
      );

      console.log(msg);
    } else {
      console.log("data:", data.MessageId);
      responseBody.message = "Sent to " + queueUrl;
      responseBody.QueueUrl = data.QueueUrl;
      responseBody.messageId = data.MessageId;

      response = await requestResult(statusCode.OK, responseBody, event);
    }

    callback(null, response);
  });
};

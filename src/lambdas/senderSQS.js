//External
const { SendMessageCommand, SQSClient } = require("@aws-sdk/client-sqs");

//Environment Vars
const REGION = process.env.AWS_REGION;
const ACCESS_KEY = process.env.AWS_ACCESS_KEY_RANDOM_VALUE;
const SECRET_KEY = process.env.AWS_SECRET_KEY_RANDOM_VALUE;
const ENDPOINT = process.env.SQS_URL;
const QUEUE_FIFO_ONE_URL = process.env. QUEUE_FIFO_ONE_URL; 

module.exports.handler = async (event) => {

  try {

    
  const client = new SQSClient({ 
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_KEY,
    endpoint: ENDPOINT });
    

  const command = new SendMessageCommand({
    QueueUrl: QUEUE_FIFO_ONE_URL,
    DelaySeconds: 10,
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
    }
  });


    const response = await client.send(command);
    console.log(response);

  } catch (e) {
    console.error(e);
  }
};
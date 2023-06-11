module.exports.handler = async (event) => {
  const AWS = require("aws-sdk");
  const SQS = new AWS.SQS({
    accessKeyId: "local",
    secretAccessKey: "local",
    endpoint: "127.0.0.1:9324"
  });

  try {

    const queueParams = {
      Entries: [
        {
          Id: "1",
          MessageBody: "this is a message body",
        }
      ],
      QueueUrl: 'http://127.0.0.1:9324/queue/fifoQueueOne'
    }

    const result = await SQS.sendMessageBatch(queueParams).promise();
    console.log(JSON.stringify(result, null, 2));
  } catch (e) {
    console.error(e);
  }
};

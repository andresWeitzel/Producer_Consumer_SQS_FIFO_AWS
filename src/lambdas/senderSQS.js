
//External
var AWS = require('aws-sdk');
AWS.config.update({ region:'eu-west-1' });

//Environment Vars
const {REGION} =  require(process.env.REGION);
const {RECEIVER_QUEUE_URL} =  require(process.env.RECEIVER_QUEUE_URL);

//Const/Vars
const sqs = new AWS.SQS({
    region: REGION
});
const queueUrl = RECEIVER_QUEUE_URL;
let accountId;


exports.handler = function(event, context, callback) {
    accountId = context.invokedFunctionArn.split(":")[4];

    // response and status of HTTP endpoint
    var responseBody = {
        message: ''
    };
    var responseCode = 200;

    // SQS message parameters
    var params = {
        MessageBody: event.body,
        QueueUrl: queueUrl
    };

    sqs.sendMessage(params, function(err, data) {
        if (err) {
            console.log('error:', "failed to send message" + err);
            var responseCode = 500;
        } else {
            console.log('data:', data.MessageId);
            responseBody.message = 'Sent to ' + queueUrl;
            responseBody.messageId = data.MessageId;
        }
        var response = {
            statusCode: responseCode,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(responseBody)
        };

        callback(null, response);
    });
}
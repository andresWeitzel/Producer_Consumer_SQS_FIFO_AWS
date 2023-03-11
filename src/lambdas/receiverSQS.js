//Helpers
const { requestResult } = require("../helpers/http/bodyResponse");
const { statusCode } = require("../enums/http/statusCode");

module.exports.handler = async (event) => {
  try {
    for (const record of event.Records) {
      const messageAttributes = record.messageAttributes;
      console.log(
        "Message Attribute: ",
        messageAttributes.AttributeName.stringValue
      );
      console.log("Message Body: ", record.body);
    }

    return await requestResult(statusCode.OK, 'Successful', event);
  } catch (error) {
    console.log(error);
    return await requestResult(statusCode.INTERNAL_SERVER_ERROR, error, event);
  }
};

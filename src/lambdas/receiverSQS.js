//Enums
const { statusCode } = require("../enums/http/statusCode");
const { value } = require("../enums/general/values");
//Helpers
const { requestResult } = require("../helpers/http/requestResult");
//Const-vars
let record;
let msg;
let code;

module.exports.handler = async (event) => {
  try { 

    console.log(JSON.stringify(event.Records, null, 2));

  } catch (error) {
    code = statusCode.INTERNAL_SERVER_ERROR;
    msg = `Error in RECEIVER SQS lambda. Caused by ${error}`;
    console.error(`${msg}. Stack error type : ${error.stack}`);

    
    return await requestResult(code, msg);
  }
};
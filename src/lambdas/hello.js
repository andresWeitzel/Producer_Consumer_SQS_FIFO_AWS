'use strict';

module.exports.test = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: process.env.HELLO_TEST,
        input: event,
      },
      null,
      2
    ),
  };

};
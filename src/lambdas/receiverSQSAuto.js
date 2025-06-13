//External
const { SendMessageCommand, DeleteMessageCommand } = require("@aws-sdk/client-sqs");
//Environment Vars
const QUEUE_FIFO_ONE_URL = process.env.QUEUE_FIFO_ONE_URL;
//Enums
const { statusCode } = require("../enums/http/statusCode");
//Helpers
const { requestResult } = require("../helpers/http/requestResult");
const { sqsClient } = require("../helpers/sqs/configuration/sqsClient");
//Const-vars
let client;
let msg;
let code;

const sendMessage = async (body) => {
  try {
    const command = new SendMessageCommand({
      QueueUrl: QUEUE_FIFO_ONE_URL,
      MessageBody: JSON.stringify(body),
      MessageGroupId: "auto-process-group",
      MessageDeduplicationId: Date.now().toString()
    });
    const response = await client.send(command);
    return response;
  } catch (error) {
    console.error("Error sending message:", error);
    return null;
  }
};

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

const processMessage = async (message) => {
  try {
    console.log("Processing message automatically:", message);
    // Aquí puedes agregar tu lógica de procesamiento específica
    // Por ejemplo: guardar en base de datos, enviar notificaciones, etc.
    
    // Simulamos un procesamiento exitoso
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      messageId: message.messageId,
      body: message.body,
      attributes: message.messageAttributes,
      processedAt: new Date().toISOString(),
      processingType: "automatic"
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

    // Si hay un body en el evento, significa que es una petición para enviar un mensaje
    if (event.body) {
      const body = JSON.parse(event.body);
      console.log("Sending message:", body);
      const sendResult = await sendMessage(body);
      
      if (sendResult) {
        return await requestResult(statusCode.OK, {
          message: "Message queued for automatic processing",
          details: {
            messageId: sendResult.MessageId,
            status: "queued",
            estimatedProcessingTime: "1-2 seconds",
            processingType: "automatic"
          }
        });
      }
    }

    // Si hay Records, significa que es un evento de SQS para procesar mensajes
    if (event.Records && Array.isArray(event.Records)) {
      for (const record of event.Records) {
        console.log("Received message:", record);
        
        // Procesar el mensaje
        const processedMessage = await processMessage(record);
        if (processedMessage) {
          // Si el procesamiento fue exitoso, eliminar el mensaje de la cola
          const deleted = await deleteMessage(record.receiptHandle);
          if (deleted) {
            processedMessages.push(processedMessage);
            console.log("Message processed and deleted successfully:", processedMessage);
          }
        }
      }

      return await requestResult(statusCode.OK, {
        message: processedMessages.length > 0 ? "Messages processed automatically" : "No messages to process",
        processedMessages
      });
    }

    return await requestResult(statusCode.BAD_REQUEST, {
      message: "Invalid request. Either provide a body to send a message or process existing messages."
    });
  } catch (error) {
    code = statusCode.INTERNAL_SERVER_ERROR;
    msg = `Error in RECEIVER SQS AUTO lambda. Caused by ${error}`;
    console.error(`${msg}. Stack error type : ${error.stack}`);

    return await requestResult(code, msg);
  }
}; 
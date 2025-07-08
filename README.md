
![Index app](./doc/assets/Producer_Consumer_SQS_FIFO_AWS.drawio.png)

<div align="right">

  <img width="25" height="25" src="./doc/assets/icons/devops/png/aws.png" />
  <img width="25" height="25" src="./doc/assets/icons/aws/png/lambda.png" />
  <img width="27" height="27" src="./doc/assets/icons/devops/png/postman.png" />
  <img width="29" height="27" src="./doc/assets/icons/devops/png/git.png" />
  <img width="28" height="27" src="./doc/assets/icons/aws/png/api-gateway.png" />
  <img width="23" height="25" src="./doc/assets/icons/aws/png/sqs.png" />
  <img width="27" height="25" src="./doc/assets/icons/aws/png/parameter-store.png" />
  <img width="27" height="27" src="./doc/assets/icons/backend/javascript-typescript/png/nodejs.png" />

</div>

<br>

<br>


<div align="right"> 
  <a href="https://github.com/andresWeitzel/Producer_Consumer_SQS_FIFO_AWS/blob/master/translation/README.es.md">
    <img src="./doc/assets/translation/arg-flag.jpg" width="65" height="40" />
  </a> 
  <a href="https://github.com/andresWeitzel/Producer_Consumer_SQS_FIFO_AWS/blob/master/README.md">
    <img src="./doc/assets/translation/eeuu-flag.jpg" width="65" height="40" />
  </a> 
</div>

<br>

<br>

<div align="center">

# Producer_Consumer_SQS_FIFO_AWS ![(status-completed)](./doc/assets/icons/badges/status-completed.svg)

</div>

Communication between producer and consumer with manual and automatic processing using AWS SQS FIFO queues, implemented with Systems Manager Parameter Store, Api-Gateway, Serverless-Framework, Lambda, NodeJs, aws sdk-v3, ElasticMQ, among others.

* [Postman Collection](./postman/Producer_Consumer_SQS.postman_collection.json) 
* [Functional tests playlist](https://www.youtube.com/watch?v=sGK_4FQBdP8&list=PLCl11UFjHurCkJNddrHBJ_TUfMlrHuWyb) <a href="https://www.youtube.com/watch?v=sGK_4FQBdP8&list=PLCl11UFjHurCkJNddrHBJ_TUfMlrHuWyb" target="_blank"> <img src="./doc/assets/social-networks/yt.png" width="25" /></a>


<br>

## Table of Contents 📜

<details>
<summary>See</summary>

<br>

### Section 1) Description, Technologies and References

* [1.0) Project Description.](#10-project-description-)
* [1.1) Project Execution.](#11-project-execution-)
* [1.2) Configure the serverless project from scratch](#12-configure-the-serverless-project-from-scratch-)
* [1.3) Technologies.](#13-technologies-)

### Section 2) Endpoints and Examples

* [2.0) Endpoints and resources.](#20-endpoints-and-resources-)
* [2.1) Message Processing Patterns.](#21-message-processing-patterns-)

### Section 3) Functionality Test and References

* [3.0) Functionality Test.](#30-functionality-test-)
* [3.1) References.](#31-references-)

</details>


<br>

## Section 1) Description, Technologies and Dependencies 


### 1.0) Description [🔝](#table-of-contents-) 

<details>
  <summary>Ver</summary>
 
 <br>

### 1.0.0) Description General

 This project implements a communication system between producer and consumer using AWS SQS FIFO queues, with support for manual and automatic message processing.

* [Project playlist](https://www.youtube.com/watch?v=sGK_4FQBdP8&list=PLCl11UFjHurCkJNddrHBJ_TUfMlrHuWyb)
* `Important` : For the use of queues of type FIFO, according to the option of using elasticmq as a server, it is necessary to have version 0.15.4 of the .jar or later for the correct execution of the same.


### 1.0.1) Description Architecture and Operation

<details>
<summary><b>System Architecture</b></summary>

> Detailed description of the system architecture and components.

### Main Components

#### 1. API Gateway
- **Function**: Entry point for all HTTP requests
- **Endpoints**:
  - `/sender-queue`: Sending messages
  - `/list-queue`: Queue status query
  - `/receive-queue`: Message processing (manual/automatic)
- **Security**: API Key Validation

#### 2. Lambda Functions
- **senderSQS.js**:
  - Sends messages to the FIFO queue
  - Generates a unique MessageGroupId
  - Handles message attributes
  - Returns MessageId

- **receiverSQS.js**:
  - Manual message processing
  - Receives specific messages by ReceiptHandle
  - Deletes messages after processing
  - Returns processing details

- **receiverSQSAuto.js**:
  - Automatic message processing
  - Processes up to 10 messages at a time
  - Handles errors and retries
  - Deletes processed messages

#### 3. SQS FIFO Queue
- **Type**: First-In-First-Out Queue
- **Features**:
  - Guaranteed message order
  - MessageGroupId grouping
  - Controlled duplication
  - Configurable retention

#### 4. Systems Manager Parameter Store
- **Function**: Secure storage of credentials
- **Parameters**:
  - AWS credentials
  - Queue URLs
  - Environment configurations

### Processing Flows

#### 1. Manual Flow
1. Client sends message via `/sender-queue`
2. Lambda senderSQS processes and sends to SQS
3. Client queries status via `/list-queue`
4. Client processes specific message via `/receive-queue`
5. Lambda receiverSQS processes and deletes the message

#### 2. Automatic Flow
1. Client sends message via `/receive-queue`
2. Lambda receiverSQSAuto activates automatically
3. Processes messages in batches
4. Deletes processed messages
5. Returns processing results

### Security and Monitoring

#### 1. Security
- API Key for authentication
- Credentials in Parameter Store
- Specific IAM roles
- Message validation

#### 2. Monitoring
- CloudWatch Logs
- SQS Metrics
- Lambda Traces
- Queue Status

### Local Development

#### 1. ElasticMQ
- Emulates SQS locally
- Configuration in `.elasticmq/elasticmq.config`
- Default port 9324

#### 2. Serverless Offline
- Emulates AWS locally
- Endpoints at `localhost:3000`
- Local environment variables

#### 3. Postman
- Collection for testing
- Configurable environment
- Automated tests
</details>


<br>

</details>


### 1.1) Project Execution [🔝](#table-of-contents-)

<details>
  <summary>Ver</summary>

* We create a working environment through some ide, we can or cannot create a root folder for the project, we position ourselves over it
```git
cd 'projectRootName'
```
* Once we have created a working environment through some ide, we clone the project
```git
git clone https://github.com/andresWeitzel/Producer_Consumer_SQS_FIFO_AWS
```
* We position ourselves over the project
```git
cd 'projectName'
```
* We install the LTS version of [Nodejs(v18)](https://nodejs.org/en/download)
* We install the Serverless Framework globally if we haven't already. I recommend version three since it's free and doesn't ask for credentials. The latest version (four) can be used without any problems, although it requires a paid version.
```git
npm install -g serverless@3
```
* We verify the Serverless Framework version installed
```git
sls -v
```
* We install all necessary packages
```git
npm i
```
* The following script configured in the package.json of the project is responsible for
   * Launching serverless-offline (serverless-offline)
 ```git
  "scripts": {
    "serverless-offline": "sls offline start",
    "start": "npm run serverless-offline"
  },
```
* We launch the app from terminal.
```git
npm start
```
* If we get a message indicating that port 9324 is already in use, we can terminate all dependent processes and restart the app
```git
npx kill-port 9324
```
* We launch the app from terminal.
```git
npm start
```
 
 
<br>

</details>

### 1.2) Configure the serverless project from scratch [🔝](#table-of-contents-)

<details>
  <summary>Ver</summary>
 
 <br>

* `Important: ` The example base described later can be visualized in another repository. Go to [SQS-offline-example-aws](https://github.com/andresWeitzel/SQS-offline-example-aws) 
* We create a working environment through some ide, we can or cannot create a root folder for the project, we position ourselves over it
```git
cd 'projectRootName'
```
* Once we have created a working environment through some ide, we clone the project
```git
git clone https://github.com/andresWeitzel/Producer_Consumer_SQS_FIFO_AWS
```
* We position ourselves over the project
```git
cd 'projectName'
```
* We install the latest LTS version of [Nodejs(v18)](https://nodejs.org/en/download)
* We install Serverless Framework globally if we haven't done it
```git
npm install -g serverless
```
* We verify the Serverless Framework version installed
```git
sls -v
```
* We initialize a serverles template
```git
serverless create --template aws-nodejs
```
* We initialize a project npm
```git
npm init -y
```
* We install serverless offline and add the plugin to the .yml
```git
npm i serverless-offline --save-dev
```
* We install serverless ssm and add the plugin to the .yml
```git
npm i serverless-offline-ssm --save-dev
```
* We install the @aws-sdk/client-sqs plugin for sqs use.
```git
npm i @aws-sdk/client-sqs
```
* We set all project environment variables
```git
  # Keys
  X_API_KEY : 'f98d8cd98h73s204e3456998ecl9427j'
  BEARER_TOKEN : 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'

  #GRAL CONFIG
  AWS_REGION : 'us-east-1'
  AWS_ACCESS_KEY_RANDOM_VALUE: 'xxxx'
  AWS_SECRET_KEY_RANDOM_VALUE: 'xxxx'

  #SQS CONFIG
  SQS_HOST: 127.0.0.1
  SQS_PORT: 9324
  SQS_API_VERSION: "latest"
  SQS_URL: 'http://127.0.0.1:9324'

  #QUEUE CONFIG
  QUEUE_FIFO_ONE_NAME : 'queue-one.fifo'
  QUEUE_FIFO_ONE_URL: 'http://127.0.0.1:9324/queue/queue-one.fifo'

  # SERVERLESS CONFIG
  SERVERLESS_HTTP_PORT : 4000
  SERVERLESS_LAMBDA_PORT : 4002
  ```
* We install [serverless SQS](https://www.npmjs.com/package/serverless-offline-sqs) and add the plugin to the .yml
```git
npm i serverless-offline-sqs --save-dev
```
* [Download the .jar](https://github.com/softwaremill/elasticmq) for the execution of elasticmq in local. Click on the download (runs stand-alone (download)) part.
* We create a directory in the project root to store the elasticmq server.
```git
mkdir .elasticmq
```
* We include the .jar inside and create a necessary configuration file.
```git
cd .elasticmq
mkdir elasticmq.config
```
* For simplification reasons, we start from a preset file. This is configurable based on queue names, region, ports, etc
```git
include classpath("application.conf")

node-address {
    protocol = http
    host = localhost
    port = 9324
    context-path = ""
}

rest-sqs {
    enabled = true
    bind-port = 9324
    bind-hostname = "127.0.0.1"
    sqs-limits = strict
}

queues {
    "queue-one-deadletter.fifo" {
        defaultVisibilityTimeout = 10 seconds
        delay = 0 seconds
        receiveMessageWait = 0 seconds
        fifo = true
        contentBasedDeduplication = true
    }
    
    "queue-one.fifo" {
        defaultVisibilityTimeout = 10 seconds
        delay = 0 seconds
        receiveMessageWait = 0 seconds
        deadLettersQueue {
            name = "queue-one-deadletter.fifo"
            maxReceiveCount = 3
        }
        fifo = true
        contentBasedDeduplication = true
    }
}

// Generate node-address on the first available port

aws {
    region = us-east-1
    accountId = 000000000000
}
```
* Based on this config, we declare the same in the .yml so that for each serverless execution, resources are created, the previous config of the elasticmq.config file is for the server to take elastic.mq
* We set the queue resources in the .yml
```git
resources:
  Resources:
    QueueFifoOne:
      Type: AWS::SQS::Queue
      Properties:
        QueueName: queue-one.fifo
        FifoQueue: true
        ContentBasedDeduplication: true
        VisibilityTimeout: 30
        MessageRetentionPeriod: 345600
        DelaySeconds: 0
        ReceiveMessageWaitTimeSeconds: 0
        RedrivePolicy:
          deadLetterTargetArn: !GetAtt QueueFifoOneDeadLetter.Arn
          maxReceiveCount: 3

    QueueFifoOneDeadLetter:
      Type: AWS::SQS::Queue
      Properties:
        QueueName: queue-one.fifo-deadletter-queue
        FifoQueue: true
        ContentBasedDeduplication: true
        VisibilityTimeout: 30
        MessageRetentionPeriod: 1209600
        DelaySeconds: 0
        ReceiveMessageWaitTimeSeconds: 0
```
* Then we set serverless-offline-sqs
```git  
serverless-offline-sqs:
    autoCreate: true
    apiVersion: "2012-11-05"
    endpoint: http://127.0.0.1:9324
    region: us-east-1
    accessKeyId: test
    secretAccessKey: test
    skipCacheInvalidation: false
```
* Then we set serverless-offline-elasticmq
```git  
  serverless-offline-elasticmq:
    port: 9324
    host: 127.0.0.1
    queues:
      - name: queue-one.fifo
        fifo: true
        contentBasedDeduplication: true
        visibilityTimeout: 30
        delay: 0
        receiveMessageWait: 0
        deadLettersQueue:
          name: queue-one.fifo-deadletter-queue
          maxReceiveCount: 3
      - name: queue-one.fifo-deadletter-queue
        fifo: true
```
* Etc.....
* We set the lambda in the .yml...summarizing...we would end up with the serverless.yml of the following way
```git
service: producer-consumer-sqs-fifo-aws

frameworkVersion: '3'

provider:
  name: aws
  runtime: nodejs18.x
  stage: ${opt:stage, 'dev'}
  region: ${opt:region, 'us-east-1'}
  timeout: 30
  environment:
    QUEUE_FIFO_ONE_URL: http://127.0.0.1:9324/queue/queue-one.fifo
    AWS_REGION: ${self:provider.region}
    SQS_URL: http://127.0.0.1:9324
    SSM_URL: http://127.0.0.1:4583
    AWS_ACCESS_KEY_RANDOM_VALUE: test
    AWS_SECRET_KEY_RANDOM_VALUE: test

functions:
  senderSQS:
    handler: src/lambdas/senderSQS.handler
    timeout: 30
    events:
      - http:
          path: sender-queue
          method: post
          cors: true
          request:
            parameters:
              headers:
                x-api-key: true
                Content-Type: true

  listSQS:
    handler: src/lambdas/listSQS.handler
    timeout: 30
    events:
      - http:
          path: list-queue
          method: get
          cors: true
          request:
            parameters:
              headers:
                x-api-key: true

  receiverSQSManual:
    handler: src/lambdas/receiverSQSManual.handler
    timeout: 30
    events:
      - http:
          path: receive-queue
          method: post
          cors: true
          request:
            parameters:
              headers:
                x-api-key: true
                Content-Type: true

  receiverSQSAuto:
    handler: src/lambdas/receiverSQSAuto.handler
    timeout: 30
    events:
      - http:
          path: process-auto
          method: post
          cors: true
          request:
            parameters:
              headers:
                x-api-key: true
                Content-Type: true

resources:
  Resources:
    QueueFifoOne:
      Type: AWS::SQS::Queue
      Properties:
        QueueName: queue-one.fifo
        FifoQueue: true
        ContentBasedDeduplication: true
        VisibilityTimeout: 30
        MessageRetentionPeriod: 345600
        DelaySeconds: 0
        ReceiveMessageWaitTimeSeconds: 0
        RedrivePolicy:
          deadLetterTargetArn: !GetAtt QueueFifoOneDeadLetter.Arn
          maxReceiveCount: 3

    QueueFifoOneDeadLetter:
      Type: AWS::SQS::Queue
      Properties:
        QueueName: queue-one.fifo-deadletter-queue
        FifoQueue: true
        ContentBasedDeduplication: true
        VisibilityTimeout: 30
        MessageRetentionPeriod: 1209600
        DelaySeconds: 0
        ReceiveMessageWaitTimeSeconds: 0

plugins:
  - serverless-offline
  - serverless-offline-ssm
  - serverless-offline-sqs
  - serverless-offline-elasticmq

custom:
  serverless-offline:
    httpPort: 4000
    lambdaPort: 4002
    noPrependStageInUrl: true
  serverless-offline-ssm:
    stages:
      - dev
    port: 4583
  serverless-offline-sqs:
    autoCreate: true
    apiVersion: "2012-11-05"
    endpoint: http://127.0.0.1:9324
    region: us-east-1
    accessKeyId: test
    secretAccessKey: test
    skipCacheInvalidation: false
  serverless-offline-elasticmq:
    port: 9324
    host: 127.0.0.1
    queues:
      - name: queue-one.fifo
        fifo: true
        contentBasedDeduplication: true
        visibilityTimeout: 30
        delay: 0
        receiveMessageWait: 0
        deadLettersQueue:
          name: queue-one.fifo-deadletter-queue
          maxReceiveCount: 3
      - name: queue-one.fifo-deadletter-queue
        fifo: true

    

```
* We install the dependency for running scripts in parallel
``` git
npm i concurrently
``` 
* The following script configured in the package.json of the project is responsible for
* Launching the elasticmq server
* Launching serverless-offline
```git
  "scripts": {
    "serverless-offline": "sls offline start",
    "queue-start": "java -Dconfig.file=.elasticmq/elasticmq.config -jar .elasticmq/elasticmq-server-0.15.4.jar",
    "start": "concurrently --kill-others \"npm run queue-start\" \"npm run serverless-offline\""
  },
```
* Etc, etc, etc.
* We launch the app from terminal.
```git
npm start
```
* If we get a message indicating that port 9324 is already in use, we can terminate all dependent processes and restart the app
```git
npx kill-port 9324
```
* We launch the app from terminal.
```git
npm start
```
* `Important: ` The example base described can be visualized in another repository. Go to [SQS-offline-example-aws](https://github.com/andresWeitzel/SQS-offline-example-aws)


</details>


### 1.3) Technologies [🔝](#table-of-contents-) 

<details>
  <summary>Ver</summary>
 
 <br>
 
### Technologies Implemented

| **Technologies** | **Version** | **Finality** |               
| ------------- | ------------- | ------------- |
| [SDK](https://www.serverless.com/framework/docs/guides/sdk/) | 4.3.2  | Automatic Module Injection for Lambdas |
| [Serverless Framework Core v3](https://www.serverless.com//blog/serverless-framework-v3-is-live) | 3.23.0 | Core AWS Services |
| [Serverless Plugin](https://www.serverless.com/plugins/) | 6.2.2  | Libraries for Modular Definition |
| [Systems Manager Parameter Store (SSM)](https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-parameter-store.html) | 3.0 | Environment Variable Management |
| [Amazon Simple Queue Service (SQS)](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/welcome.html) | 7.0 | Distributed Messaging Service | 
| [Elastic MQ](https://github.com/softwaremill/elasticmq) | 1.3 | Interfaces Compatible with SQS (msg memory) | 
| [Amazon Api Gateway](https://docs.aws.amazon.com/apigateway/latest/developerguide/welcome.html) | 2.0 | Gestor, Autenticación, Control y Procesamiento de la Api | 
| [NodeJS](https://nodejs.org/en/) | 14.18.1  | JS Library |
| [VSC](https://code.visualstudio.com/docs) | 1.72.2  | IDE |
| [Postman](https://www.postman.com/downloads/) | 10.11  | Http Client |
| [CMD](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/cmd) | 10 | System Symbol for Command Line | 
| [Git](https://git-scm.com/downloads) | 2.29.1  | Version Control |



</br>


### Plugins Implemented.

| **Plugin** | **Download** |               
| -------------  | ------------- |
| serverless-offline |  https://www.serverless.com/plugins/serverless-offline |
| serverless-offline-ssm |  https://www.npmjs.com/package/serverless-offline-ssm |
| serverless-offline-sqs | https://www.npmjs.com/package/serverless-offline-sqs |


</br>

### VSC Extensions Implemented.

| **Extension** |              
| -------------  | 
| Prettier - Code formatter |
| YAML - Autoformatter .yml (alt+shift+f) |
| DotENV |

<br>

</details>




<br>


## Section 2) Endpoints and Examples. 


### 2.0) Endpoints and resources [🔝](#table-of-contents-)

<details>
  <summary>Ver</summary>
 
 <br>

We include a Postman collection to facilitate testing of the endpoints. The collection is located in:

```
/collections/Producer_Consumer_SQS.postman_collection.json
``` 

<br>

#### Send Message (POST /sender-queue)

> Sends a message to the SQS FIFO queue.

**Request (Postman):**
```
POST http://localhost:3000/dev/sender-queue
Headers:
  x-api-key: 123456789
  Content-Type: application/json
Body:
{
    "message": "Test message",
    "data": {
        "key": "value",
        "timestamp": "2024-06-12T15:25:58.849Z",
        "metadata": {
            "source": "test",
            "priority": "high"
        }
    }
}
```

**Response (200 OK):**
```json
{
    "message": {
        "message": "Message sent successfully",
        "messageId": "e34d83db-907a-46d4-ac84-e28a3f2e3e72"
    }
}
```
<br>

#### List Queue (GET /list-queue)

> Gets information about the current status of the SQS queue.

**Request (Postman):**
```
GET http://localhost:3000/dev/list-queue
Headers:
  x-api-key: 123456789
```

**Response (200 OK):**
```json
{
    "message": {
        "message": "Queue information retrieved successfully",
        "queueInfo": {
            "url": "http://localhost:9324/000000000000/queue-one.fifo",
            "approximateNumberOfMessages": "5",
            "approximateNumberOfMessagesDelayed": "0",
            "approximateNumberOfMessagesNotVisible": "0",
            "createdTimestamp": "2024-06-12T15:25:58.849Z",
            "lastModifiedTimestamp": "2024-06-12T15:25:58.849Z",
            "queueArn": "arn:aws:sqs:elasticmq:000000000000:queue-one.fifo",
            "visibilityTimeout": "30"
        }
    }
}
```
<br>

#### Manual Processing (POST /receive-queue)

> Processes a specific message from the queue manually.

**Request (Postman):**
```
POST http://localhost:3000/dev/receive-queue
Headers:
  x-api-key: 123456789
  Content-Type: application/json
Body:
{
    "receiptHandle": "AQEB...",
    "queueUrl": "http://localhost:9324/000000000000/queue-one.fifo",
    "messageId": "e34d83db-907a-46d4-ac84-e28a3f2e3e72"
}
```

**Response (200 OK):**
```json
{
    "message": {
        "message": "Message processed successfully",
        "processedMessage": {
            "messageId": "e34d83db-907a-46d4-ac84-e28a3f2e3e72",
            "body": "Test message",
            "attributes": {
                "metadata": {
                    "source": "test",
                    "priority": "high"
                }
            },
            "processedAt": "2024-06-12T15:25:58.849Z",
            "processingType": "manual"
        }
    }
}
```
<br>

#### Automatic Processing (POST /receive-queue)

> Sends a message for automatic processing.

**Request (Postman):**
```
POST http://localhost:3000/dev/receive-queue
Headers:
  x-api-key: 123456789
  Content-Type: application/json
Body:
{
    "message": {
        "JsonObject": {
            "DataType": "String",
            "StringValue": "Example for sender an object inside de MessageAttributes"
        }
    }
}
```

**Response (200 OK):**
```json
{
    "message": {
        "message": "Message queued for automatic processing",
        "details": {
            "messageId": "e34d83db-907a-46d4-ac84-e28a3f2e3e72",
            "status": "queued",
            "estimatedProcessingTime": "1-2 seconds",
            "processingType": "automatic"
        }
    }
}
```
<br>

#### Error Codes

> List of possible error codes and their responses.

**400 Bad Request:**
```json
{
    "message": "BAD REQUEST. UNABLE TO RETRIEVE QUEUE INFORMATION"
}
```

**401 Unauthorized:**
```json
{
    "message": "Unauthorized. Invalid or missing API key"
}
```

**500 Internal Server Error:**
```json
{
    "message": "Error in RECEIVER SQS AUTO lambda. Caused by [ERROR_DETAILS]"
}
```

<br>

#### Processing Flows

> Manual and automatic processing examples.

#### Manual Flow
1. Send message:
```bash
curl -X POST http://localhost:3000/dev/sender-queue \
-H "x-api-key: 123456789" \
-H "Content-Type: application/json" \
-d '{
    "message": "Test message",
    "data": {
        "key": "value",
        "timestamp": "2024-06-12T15:25:58.849Z"
    }
}'
```

2. Check queue status:
```bash
curl -X GET http://localhost:3000/dev/list-queue \
-H "x-api-key: 123456789"
```

3. Process message:
```bash
curl -X POST http://localhost:3000/dev/receive-queue \
-H "x-api-key: 123456789" \
-H "Content-Type: application/json" \
-d '{
    "receiptHandle": "AQEB...",
    "queueUrl": "http://localhost:9324/000000000000/queue-one.fifo"
}'
```

#### Automatic Flow
1. Send message for automatic processing:
```bash
curl -X POST http://localhost:3000/dev/receive-queue \
-H "x-api-key: 123456789" \
-H "Content-Type: application/json" \
-d '{
    "message": "Test message for automatic processing",
    "data": {
        "key": "value",
        "timestamp": "2024-06-12T15:25:58.849Z"
    }
}'
```

2. Check queue status:
```bash
curl -X GET http://localhost:3000/dev/list-queue \
-H "x-api-key: 123456789"
```

</details>



### 2.1) Message Processing Patterns. [🔝](#table-of-contents-)

<details>
  <summary>Ver</summary>

<br>

The system implements two message processing patterns:

#### 2.0.0) Automatic Processing
- **Description**: The system includes an automatic processor that activates once executed, does the sender and receiver process.
- **Features**:
  - Automatically activates processing once triggered
  - Processes up to 10 messages at a time
  - Deletes messages after processing
  - No manual action required, just execution
- **Advantages**:
  - Real-time processing
  - No manual intervention by stages
  - Ideal for continuous workloads
- **Use**: No additional configuration required, activates automatically when executed

#### 2.0.1) Manual Processing
- **Description**: Allows manual processing of messages through an HTTP endpoint.
- **Features**:
  - Greater control over processing
  - Possibility to inspect messages before processing
  - Ideal for debugging and special cases
- **Use**:
  1. List messages (GET /list-queue)
  2. Select message to process
  3. Send message for processing (POST /receive-queue)

#### 2.0.2) Important Notes
- Automatic and manual processing can coexist
- Messages processed automatically will not be available for manual processing
- Manual processing is recommended for debugging and special cases or tests
- Automatic processing is ideal for production

<br>

</details>

<br>


## Section 3) Functionality Test and References. 


### 3.0) Functionality Test [🔝](#table-of-contents-) 

<details>
  <summary>Ver</summary>
<br>

#### [Watch playlist](https://www.youtube.com/playlist?list=PLCl11UFjHurCkJNddrHBJ_TUfMlrHuWyb)


  <a href="https://www.youtube.com/playlist?list=PLCl11UFjHurCkJNddrHBJ_TUfMlrHuWyb">
    <img src="./doc/assets/Producer_Consumer_SQS_FIFO_AWS_yt.png" />
  </a> 


</details>

### 3.1) References [🔝](#table-of-contents-)

<details>
  <summary>Ver</summary>
 
 <br>

#### SQS Concepts
 * [AWS SQS key concepts](https://fourtheorem.com/what-do-you-need-to-know-about-sqs/)
 * [SQS SNS Differences](https://aws.amazon.com/it/sqs/faqs/)

#### SQS aws-sdk-v3
* [Sending messages through queues](https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/javascript_sqs_code_examples.html)

#### FIFO Queue Examples
* [FIFO Examples](https://docs.aws.amazon.com/sns/latest/dg/fifo-topic-code-examples.html)

#### SQS and Serverless Usages and Exampleification
* [AWS-node-sqs Example](https://github.com/ibrahimjamil/serverless-rest-examples/blob/v3/aws-node-sqs-worker/index.js)
* [Part of AWS-node-sqs Example](https://dev.to/piczmar_0/aws-lambda-sqs-events-with-serverless-framework-oj6)
* https://aws.plainenglish.io/how-to-test-amazon-sqs-with-docker-using-serverless-b717258f5d3d
* https://github.com/alexyklu/serverless-offline-lambda-with-sqs


<br>

</details>

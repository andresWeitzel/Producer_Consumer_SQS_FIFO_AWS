![Index app](./doc/assets/img/Producer_Consumer_SQS_FIFO_AWS.drawio.png)

# Producer_Consumer_SQS_FIFO_AWS
Comunicación entre lambda producer y lambda consumer utilizando el servicio SQS de AWS con colas FIFO implementado con Systems Manager Parameter Store, Api-Gateway, Serverless-Framework, Lambda, NodeJs, aws sdk-v3, ElasticMQ, entre otros.

* [Playlist proyecto](https://www.youtube.com/watch?v=sGK_4FQBdP8&list=PLCl11UFjHurCkJNddrHBJ_TUfMlrHuWyb)


<br>

## Índice 📜

<details>
 <summary> Ver </summary>
 
 <br>
 
### Sección 1) Descripción, Tecnologías y Referencias

 - [1.0) Descripción del Proyecto.](#10-descripción-)
 - [1.1) Ejecución del Proyecto.](#11-ejecución-del-proyecto-)
 - [1.2) Configurar el proyecto serverless desde cero](#12-configurar-el-proyecto-serverless-desde-cero-)
 - [1.3) Tecnologías.](#13-tecnologías-)

 ### Sección 2) Endpoints y Ejemplos 
 
 - [2.0) EndPoints y recursos.](#20-endpoints-y-recursos-)

### Sección 3) Prueba de funcionalidad y Referencias
 
 - [3.0) Prueba de funcionalidad.](#30-prueba-de-funcionalidad-)
 - [3.1) Referencias.](#31-referencias-)

<br>

</details>


<br>

## Sección 1) Descripción, Tecnologías y Dependencias 


### 1.0) Descripción [🔝](#índice-) 

<details>
  <summary>Ver</summary>
 
 <br>

### 1.0.0) Descripción General

 Comunicación entre lambda producer y lambda consumer utilizando el servicio SQS de AWS con colas FIFO implementado con Systems Manager Parameter Store, Api-Gateway, Serverless-Framework, Lambda, NodeJs, Docker, ElasticMQ, entre otros.

* [Playlist proyecto](https://www.youtube.com/watch?v=sGK_4FQBdP8&list=PLCl11UFjHurCkJNddrHBJ_TUfMlrHuWyb)
* `Importante` : Para el uso de colas de tipo FIFO, según la opción de uso de elasticmq como server, es necesario que se tenga la versión 0.15.4 del .jar en adelante para la correcta ejecución de las mismas.


### 1.0.1) Descripción Arquitectura y Funcionamiento
 
 * La imagen de la arquitectura de aws empleada describe el flujo de funcionamiento del sistema de envío de mensajes a través de SQS de forma general. Cualquier petición hacia el mismo, parte desde un cliente (Postman, navegador, etc). 
 * `Paso 1` : Dicha solicitud es recibida por el api-gateway y solamente se validará si es que dentro de los encabezados de dicha solicitud se encuentra la x-api-key correcta. Existe la excepción de encolar mensajes desde una URI de referencia (http://localhost:9324/000000000000/queue-one.fifo?Action=SendMessage&MessageBody=HELLO&MessageGroupId=XXXX), pero sin pasar por la lambda sender
 * `Paso 2` : El api gateway valida la petición y la reenvía hacia la lambda sender. El único punto de acceso es este. (Para la arquitectura planteada)
 * `Paso 3` : La lambda sender realiza las validaciones de las ssm correspondientes con el System Manager Paramater Store.. validan token, valores de sqs definidos (host, puerto, nombres de colas, etc).
 * `Pasos 4` : La lambda sender encola el mensaje en la cola de tipo fifo explicitada para luego ser consumida por la lambda receiver.
 * `Pasos 5` : La lambda receiver imprime el mensaje (objeto de tipo Record) en consola.
 * `Aclaraciones` : Se emula dicho funcionamiento dentro de la misma red y en entorno local con los plugins de serverless correspondientes. 


<br>

</details>


### 1.1) Ejecución del Proyecto [🔝](#índice-)

<details>
  <summary>Ver</summary>

* Creamos un entorno de trabajo a través de algún ide, podemos o no crear una carpeta raíz para el proyecto, nos posicionamos sobre la misma
```git
cd 'projectRootName'
```
* Una vez creado un entorno de trabajo a través de algún ide, clonamos el proyecto
```git
git clone https://github.com/andresWeitzel/Producer_Consumer_SQS_FIFO_AWS
```
* Nos posicionamos sobre el proyecto
```git
cd 'projectName'
```
* Instalamos la última versión LTS de [Nodejs(v18)](https://nodejs.org/en/download)
* Instalamos Serverless Framework de forma global si es que aún no lo hemos realizado
```git
npm install -g serverless
```
* Verificamos la versión de Serverless instalada
```git
sls -v
```
* Instalamos todos los paquetes necesarios
```git
npm i
```
* Creamos un archivo para almacenar las variables ssm utilizadas en el proyecto (Más allá que sea un proyecto con fines no comerciales es una buena práctica utilizar variables de entorno).
  * Click der sobre la raíz del proyecto
  * New file
  * Creamos el archivo con el name `serverless.ssm.yml`. Este deberá estar a la misma altura que el serverless.yml
  * Añadimos las ssm necesarias dentro del archivo.
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
* El siguiente script configurado en el package.json del proyecto es el encargado de
   * Levantar serverless-offline (serverless-offline)
 ```git
  "scripts": {
    "serverless-offline": "sls offline start",
    "start": "npm run serverless-offline"
  },
```
* Ejecutamos la app desde terminal.
```git
npm start
```
* Si se presenta algún mensaje indicando qué el puerto 9324 ya está en uso, podemos terminar todos los procesos dependientes y volver a ejecutar la app
```git
npx kill-port 9324
npm start
```
 
 
<br>

</details>

### 1.2) Configurar el proyecto serverless desde cero [🔝](#índice-)

<details>
  <summary>Ver</summary>
 
 <br>
 
* Creamos un entorno de trabajo a través de algún ide, podemos o no crear una carpeta raíz para el proyecto, nos posicionamos sobre la misma
```git
cd 'projectRootName'
```
* Una vez creado un entorno de trabajo a través de algún ide, clonamos el proyecto
```git
git clone https://github.com/andresWeitzel/Producer_Consumer_SQS_FIFO_AWS
```
* Nos posicionamos sobre el proyecto
```git
cd 'projectName'
```
* Instalamos la última versión LTS de [Nodejs(v18)](https://nodejs.org/en/download)
* Instalamos Serverless Framework de forma global si es que aún no lo hemos realizado
```git
npm install -g serverless
```
* Verificamos la versión de Serverless instalada
```git
sls -v
```
* Inicializamos un template de serverles
```git
serverless create --template aws-nodejs
```
* Inicializamos un proyecto npm
```git
npm init -y
```
* Instalamos serverless offline y agregamos el plugin al .yml
```git
npm i serverless-offline --save-dev
```
* Instalamos serverless ssm y agregamos el plugin al .yml
```git
npm i serverless-offline-ssm --save-dev
```
* Instalamos el plugin @aws-sdk/client-sqs para el uso de sqs..
```git
npm i @aws-sdk/client-sqs
```
* Seteamos todas las variables de entorno del proyecto
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
* Instalamos [serverless SQS](https://www.npmjs.com/package/serverless-offline-sqs) y agregamos el plugin al .yml
```git
npm i serverless-offline-sqs --save-dev
```
* [Descargamos el .jar](https://github.com/softwaremill/elasticmq) para la ejecución de elasticmq en local. Click en la parte donde dice download (runs stand-alone (download)).
* Creamos un directorio en la raíz del proyecto para almacenar el servidor elasticmq.
```git
mkdir .elasticmq
```
* Incluimos el .jar ahi dentro y creamos un archivo de configuración necesario.
```git
cd .elasticmq
mkdir elasticmq.config
```
* Por temas de simplificación partimos de un archivo presetado. Esto es configurable en base a nombres de colas, region, puertos, etc
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

generate-node-address = false

queues {
    "queue-one.fifo" {
        defaultVisibilityTimeout = 10 seconds
        delay = 0 seconds
        receiveMessageWait = 0 seconds
        deadLettersQueue {
            name = "queue-one.fifo-deadletter-queue"
            maxReceiveCount = 3
        }
        fifo = true
        contentBasedDeduplication = true
    }
    queue-one.fifo-deadletter-queue {
        fifo = true
    }
}

aws {
    region = us-east-1
    accountId = 000000000000
}
```
* En base a esta config, declaramos la misma en el .yml para que por cada ejecución de serverless, se creen los recursos, la config anterior del archivo elasticmq.config es para que la tome el server de elastic.mq
* Seteamos los recursos de cola en el .yml
```git
resources:
  Resources:
    myFirstQueue:
      Type: AWS::SQS::Queue
      Properties:
        QueueName: myFirstQueue
        MessageRetentionPeriod: 1209600
        RedrivePolicy:
          deadLetterTargetArn:
            Fn::GetAtt:
              - myFirstQueue
              - Arn
          maxReceiveCount: 3
        VisibilityTimeout: 10
```
* Luego seteamos serverless-offline-sqs
```git  
serverless-offline-sqs:
    sqsHost: 127.0.0.1
    sqsPort: 9324
    autoCreate: false
    apiVersion: "latest"
    endpoint: http://127.0.0.1:9324
    region: us-east-1
    accessKeyId: local
    secretAccessKey: local
    skipCacheInvalidation: false 
```
* Seteamos la lambda en el .yml...resumiendo...nos quedaria el serverless.yml de la sig manera
```git
service: aws-sqs-offline

frameworkVersion: "3"

provider:
  name: aws
  runtime: nodejs18.x
  stage: dev
  apiGateway:
    apiKeys:
      - name : xApiKey
        value : 'f98d8cd98h73s204e3456998ecl9427j'


plugins:
  - serverless-offline-sqs
  - serverless-offline  

functions:
  hello:
    handler: handler.hello

  QueueSendMessage:
    handler: handler.sendMessage
    name: Queue-SendMessage-Lambda
    description: to send sqs message
    events:
      - http:
          method: POST
          path: sender-queue
          private: true

  QueueReceiveMessage:
    handler: handler.receiveMessage
    name: Queue-ReceiveMessage-Lambda
    description: to receive sqs message
    events:
      - sqs:
          arn:
            Fn::GetAtt:
              - myFirstQueue
              - Arn
          batchSize: 10  

custom :
  serverless-offline:
    httpPort: 4000
    lambdaPort: 4002
    useChildProcesses: false
  serverless-offline-sqs:
    sqsHost: 127.0.0.1
    sqsPort: 9324
    autoCreate: false
    apiVersion: "latest"
    endpoint: http://127.0.0.1:9324
    region: us-east-1
    accessKeyId: local
    secretAccessKey: local
    skipCacheInvalidation: false      

resources:
  Resources:
    myFirstQueue:
      Type: AWS::SQS::Queue
      Properties:
        QueueName: myFirstQueue
        MessageRetentionPeriod: 1209600
        RedrivePolicy:
          deadLetterTargetArn:
            Fn::GetAtt:
              - myFirstQueue
              - Arn
          maxReceiveCount: 3
        VisibilityTimeout: 10

```
* Creamos el archivo handler que sera una lambda donde emule el envío y recibimiento de mensajes
```git
odule.exports.sendMessage = async (event) => {
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
      QueueUrl: 'http://127.0.0.1:9324/queue/myFirstQueue'
    }

    const result = await SQS.sendMessageBatch(queueParams).promise();
    console.log(JSON.stringify(result, null, 2));
  } catch (e) {
    console.error(e);
  }
};




module.exports.receiveMessage = async (event) => {
  console.log(JSON.stringify(event.Records, null, 2));
};
```
* Instalamos la dependencia para la ejecución de scripts en paralelo
``` git
npm i concurrently
``` 
* El siguiente script configurado en el package.json del proyecto es el encargado de
* Levantar el server de elasticmq
* Levantar serverless-offline
```git
  "scripts": {
    "serverless-offline": "sls offline start",
    "queue-start": "java -Dconfig.file=.elasticmq/elasticmq.config -jar .elasticmq/elasticmq-server-0.15.4.jar",
    "start": "concurrently --kill-others \"npm run queue-start\" \"npm run serverless-offline\""
  },
```
* Ejecutamos la app desde terminal.
```git
npm start
```
* Si se presenta algún mensaje indicando qué el puerto 9324 ya está en uso, podemos terminar todos los procesos dependientes y volver a ejecutar la app
```git
npx kill-port 9324
npm start
```
* `Importante: ` El ejemplo base descrito podemos visualizarlo en otro repositorio. Dirigirse a [SQS-offline-example-aws](https://github.com/andresWeitzel/SQS-offline-example-aws)


</details>


### 1.3) Tecnologías [🔝](#índice-) 

<details>
  <summary>Ver</summary>
 
 <br>
 
### Tecnologías Implementadas

| **Tecnologías** | **Versión** | **Finalidad** |               
| ------------- | ------------- | ------------- |
| [SDK](https://www.serverless.com/framework/docs/guides/sdk/) | 4.3.2  | Inyección Automática de Módulos para Lambdas |
| [Serverless Framework Core v3](https://www.serverless.com//blog/serverless-framework-v3-is-live) | 3.23.0 | Core Servicios AWS |
| [Serverless Plugin](https://www.serverless.com/plugins/) | 6.2.2  | Librerías para la Definición Modular |
| [Systems Manager Parameter Store (SSM)](https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-parameter-store.html) | 3.0 | Manejo de Variables de Entorno |
| [Amazon Simple Queue Service (SQS)](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/welcome.html) | 7.0 | Servicio de colas de mensajes distribuidos | 
| [Elastic MQ](https://github.com/softwaremill/elasticmq) | 1.3 | Interfaz compatible con SQS (msg memory) | 
| [Amazon Api Gateway](https://docs.aws.amazon.com/apigateway/latest/developerguide/welcome.html) | 2.0 | Gestor, Autenticación, Control y Procesamiento de la Api | 
| [NodeJS](https://nodejs.org/en/) | 14.18.1  | Librería JS |
| [VSC](https://code.visualstudio.com/docs) | 1.72.2  | IDE |
| [Postman](https://www.postman.com/downloads/) | 10.11  | Cliente Http |
| [CMD](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/cmd) | 10 | Símbolo del Sistema para linea de comandos | 
| [Git](https://git-scm.com/downloads) | 2.29.1  | Control de Versiones |



</br>


### Plugins Implementados.

| **Plugin** | **Descarga** |               
| -------------  | ------------- |
| serverless-offline |  https://www.serverless.com/plugins/serverless-offline |
| serverless-offline-ssm |  https://www.npmjs.com/package/serverless-offline-ssm |
| serverless-offline-sqs | https://www.npmjs.com/package/serverless-offline-sqs |


</br>

### Extensiones VSC Implementados.

| **Extensión** |              
| -------------  | 
| Prettier - Code formatter |
| YAML - Autoformatter .yml (alt+shift+f) |
| DotENV |

<br>

</details>




<br>


## Sección 2) Endpoints y Ejemplos. 


### 2.0) Endpoints y recursos [🔝](#índice-) 

<details>
  <summary>Ver</summary>
<br>

### 2.0.1) Variables en Postman

| **Variable** | **Initial value** | **Current value** |               
| ------------- | ------------- | ------------- |
| base_url | http://localhost:4000/dev  | http://localhost:4000/dev |
| x-api-key | f98d8cd98h73s204e3456998ecl9427j  | f98d8cd98h73s204e3456998ecl9427j |
| bearer_token | Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c  | Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c |

<br>

<br>

### 2.0.2) Listar todas las colas creadas (desde navegador)
#### Request cURL
``` postman
curl --location --request GET 'http://localhost:9324/?Action=ListQueues'
```

#### Response
``` postman
  <ListQueuesResponse xmlns="http://queue.amazonaws.com/doc/2012-11-05/">
                  <ListQueuesResult>
                    <QueueUrl>http://localhost:9324/queue/queue-one</QueueUrl><QueueUrl>http://localhost:9324/queue/queue-one.fifo</QueueUrl>
                  </ListQueuesResult>
                  <ResponseMetadata>
                    <RequestId>00000000-0000-0000-0000-000000000000</RequestId>
                  </ResponseMetadata>
                </ListQueuesResponse>
```

<br>

<br>

### 2.0.3) Encolar un mensaje en la cola fifo (desde navegador)
#### Request
``` postman
curl --location --request GET 'http://localhost:9324/000000000000/queue-one.fifo?Action=SendMessage&MessageBody=HELLO&MessageGroupId=XXXX'
```

#### Response
``` postman
<SendMessageResponse xmlns="http://queue.amazonaws.com/doc/2012-11-05/">
                <SendMessageResult>
                  
                  <MD5OfMessageBody>eb61eead90e3b899c6bcbe27ac581660</MD5OfMessageBody>
                  <MessageId>ead221b3-5ec5-4e00-b69a-fabd46f003fd</MessageId>
                </SendMessageResult>
                <ResponseMetadata>
                  <RequestId>00000000-0000-0000-0000-000000000000</RequestId>
                </ResponseMetadata>
              </SendMessageResponse>
```

<br>

<br>

### 2.0.4) Encolar un mensaje desde postman
#### Request
``` postman
curl --location 'http://localhost:4000/dev/sender-queue/' \
--header 'x-api-key: f98d8cd98h73s204e3456998ecl9427j' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c' \
--header 'Content-Type: application/json' \
--data '{
        "JsonObject": {
          "DataType": "String",
          "StringValue": "Example for sender an object inside de MessageAttributes"
        }
}'
```

#### Response
``` postman
{
    "message": {
        "middlewareStack": {},
        "input": {
            "QueueUrl": "http://127.0.0.1:9324/queue/queue-one.fifo",
            "DelaySeconds": 0,
            "MessageDeduplicationId": "33fbc227-08c7-4bf3-90b4-c705f51f7e4e",
            "MessageGroupId": "33fbc227-08c7-4bf3-90b4-c705f51f7e4e",
            "MessageBody": "information about sending the message",
            "MessageAttributes": {
                "JsonObject": {
                    "DataType": "String",
                    "StringValue": "Example for sender an object inside de MessageAttributes"
                }
            }
        }
    }
}
```

<br>


</details>

<br>


## Sección 3) Prueba de funcionalidad y Referencias. 


### 3.0) Prueba de funcionalidad [🔝](#índice-) 

<details>
  <summary>Ver</summary>
<br>

#### [Visualizar playlist](https://www.youtube.com/watch?v=sGK_4FQBdP8&list=PLCl11UFjHurCkJNddrHBJ_TUfMlrHuWyb)
![Index app](./doc/assets/yt/playlist.png)

</details>



### 3.1) Referencias [🔝](#índice-)

<details>
  <summary>Ver</summary>
 
 <br>

#### Conceptos SQS
 * [Conceptos claves aws sqs](https://fourtheorem.com/what-do-you-need-to-know-about-sqs/)
 * [Diferencias SQS SNS](https://aws.amazon.com/it/sqs/faqs/)

#### SQS aws-sdk-v3
* [Envío de mensajes a través de colas](https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/javascript_sqs_code_examples.html)

#### Ejemplos para Queues FIFO
* [Ejemplos FIFO](https://docs.aws.amazon.com/sns/latest/dg/fifo-topic-code-examples.html)

#### Usos y Ejemplificación de SQS y Serverless
* [Ejemplo base aws-node-sqs](https://github.com/ibrahimjamil/serverless-rest-examples/blob/v3/aws-node-sqs-worker/index.js)
* [Parte de Ejemplo Base SQS](https://dev.to/piczmar_0/aws-lambda-sqs-events-with-serverless-framework-oj6)
* https://aws.plainenglish.io/how-to-test-amazon-sqs-with-docker-using-serverless-b717258f5d3d
* https://github.com/alexyklu/serverless-offline-lambda-with-sqs


<br>

</details>



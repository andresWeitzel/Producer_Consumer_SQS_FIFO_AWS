
![Index app](../doc/assets/Producer_Consumer_SQS_FIFO_AWS.drawio.png)

<div align="right">

  <img width="25" height="25" src="../doc/assets/icons/devops/png/aws.png" />
  <img width="25" height="25" src="../doc/assets/icons/aws/png/lambda.png" />
  <img width="27" height="27" src="../doc/assets/icons/devops/png/postman.png" />
  <img width="29" height="27" src="../doc/assets/icons/devops/png/git.png" />
  <img width="28" height="27" src="../doc/assets/icons/aws/png/api-gateway.png" />
  <img width="23" height="25" src="../doc/assets/icons/aws/png/sqs.png" />
  <img width="27" height="25" src="../doc/assets/icons/aws/png/parameter-store.png" />
  <img width="27" height="27" src="../doc/assets/icons/backend/javascript-typescript/png/nodejs.png" />

</div>

<br>

<br>


<div align="right"> 
  <a href="https://github.com/andresWeitzel/Producer_Consumer_SQS_FIFO_AWS/blob/master/translation/README.es.md">
    <img width="65" height="40" src="../doc/assets/translation/arg-flag.jpg" />
  </a> 
  <a href="https://github.com/andresWeitzel/Producer_Consumer_SQS_FIFO_AWS/blob/master/README.md">
    <img width="65" height="40" src="../doc/assets/translation/eeuu-flag.jpg" />
  </a> 
</div>

<br>

<br>

<div align="center">

# Producer_Consumer_SQS_FIFO_AWS ![Status](../doc/assets/icons/badges/status-completed.svg)

</div>

Comunicación entre producer y consumer con procesamiento manual y automático utilizando el servicio SQS de AWS con colas FIFO implementado con Systems Manager Parameter Store, Api-Gateway, Serverless-Framework, Lambda, NodeJs, aws sdk-v3, ElasticMQ, entre otros.

* [Playlist pruebas funcionales](https://www.youtube.com/watch?v=sGK_4FQBdP8&list=PLCl11UFjHurCkJNddrHBJ_TUfMlrHuWyb) <a href="https://www.youtube.com/watch?v=sGK_4FQBdP8&list=PLCl11UFjHurCkJNddrHBJ_TUfMlrHuWyb" target="_blank"> <img src="../doc/assets/social-networks/yt.png" width="25" /></a>


<br>

## Índice 📜

<details>
  <summary>Ver</summary>
<br>


### Sección 1) Descripción, Tecnologías y Referencias

* [1.0) Descripción del Proyecto.](#10-descripción-)
* [1.1) Ejecución del Proyecto.](#11-ejecución-del-proyecto-)
* [1.2) Configurar el proyecto serverless desde cero](#12-configurar-el-proyecto-serverless-desde-cero-)
* [1.3) Tecnologías.](#13-tecnologías-)

### Sección 2) Endpoints y Ejemplos

* [2.0) EndPoints y recursos.](#20-endpoints-y-recursos-)
* [2.1) Patrones de Procesamiento de Mensajes.](#21-patrones-de-procesamiento-de-mensajes-)

### Sección 3) Prueba de funcionalidad y Referencias

* [3.0) Prueba de funcionalidad.](#30-prueba-de-funcionalidad-)
* [3.1) Referencias.](#31-referencias-)

</details>


<br>

## Sección 1) Descripción, Tecnologías y Dependencias 


### 1.0) Descripción [🔝](#índice-) 

<details>
  <summary>Ver</summary>
 
 <br>

### 1.0.0) Descripción General

 Este proyecto implementa un sistema de comunicación entre producer y consumer utilizando colas FIFO de AWS SQS, con soporte para procesamiento manual y automático de mensajes.

* [Playlist proyecto](https://www.youtube.com/watch?v=sGK_4FQBdP8&list=PLCl11UFjHurCkJNddrHBJ_TUfMlrHuWyb)
* `Importante` : Para el uso de colas de tipo FIFO, según la opción de uso de elasticmq como server, es necesario que se tenga la versión 0.15.4 del .jar en adelante para la correcta ejecución de las mismas.


### 1.0.1) Descripción Arquitectura y Funcionamiento

<details>
<summary><b>Arquitectura del Sistema</b></summary>

> Descripción detallada de la arquitectura y componentes del sistema.

### Componentes Principales

#### 1. API Gateway
- **Función**: Punto de entrada para todas las peticiones HTTP
- **Endpoints**:
  - `/sender-queue`: Envío de mensajes
  - `/list-queue`: Consulta de estado de la cola
  - `/receive-queue`: Procesamiento de mensajes (manual/automático)
- **Seguridad**: Validación de API Key

#### 2. Lambda Functions
- **senderSQS.js**:
  - Envía mensajes a la cola FIFO
  - Genera MessageGroupId único
  - Maneja atributos de mensaje
  - Retorna MessageId

- **receiverSQS.js**:
  - Procesamiento manual de mensajes
  - Recibe mensajes específicos por ReceiptHandle
  - Elimina mensajes después de procesarlos
  - Retorna detalles del procesamiento

- **receiverSQSAuto.js**:
  - Procesamiento automático de mensajes
  - Procesa hasta 10 mensajes por lote
  - Maneja errores y reintentos
  - Elimina mensajes procesados

#### 3. SQS FIFO Queue
- **Tipo**: Cola First-In-First-Out
- **Características**:
  - Orden garantizado de mensajes
  - Agrupación por MessageGroupId
  - Duplicación controlada
  - Retención configurable

#### 4. Systems Manager Parameter Store
- **Función**: Almacenamiento seguro de credenciales
- **Parámetros**:
  - Credenciales de AWS
  - URLs de colas
  - Configuraciones de entorno

### Flujos de Procesamiento

#### 1. Flujo Manual
1. Cliente envía mensaje vía `/sender-queue`
2. Lambda senderSQS procesa y envía a SQS
3. Cliente consulta estado vía `/list-queue`
4. Cliente procesa mensaje específico vía `/receive-queue`
5. Lambda receiverSQS procesa y elimina el mensaje

#### 2. Flujo Automático
1. Cliente envía mensaje vía `/receive-queue`
2. Lambda receiverSQSAuto se activa automáticamente
3. Procesa mensajes en lotes
4. Elimina mensajes procesados
5. Retorna resultados del procesamiento

### Seguridad y Monitoreo

#### 1. Seguridad
- API Key para autenticación
- Credenciales en Parameter Store
- IAM roles específicos
- Validación de mensajes

#### 2. Monitoreo
- CloudWatch Logs
- Métricas de SQS
- Trazas de Lambda
- Estado de la cola

### Desarrollo Local

#### 1. ElasticMQ
- Emula SQS localmente
- Configuración en `.elasticmq/elasticmq.config`
- Puerto 9324 por defecto

#### 2. Serverless Offline
- Emula AWS localmente
- Endpoints en `localhost:3000`
- Variables de entorno locales

#### 3. Postman
- Colección para testing
- Environment configurable
- Tests automatizados
</details>


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
* Instalamos la versión LTS de [Nodejs(v18)](https://nodejs.org/en/download)
* Instalamos el Serverless Framework globalmente si aún no lo hemos hecho. Recomiendo la version tres ya que es gratuita y no nos pide credenciales. Se puede usar la última version (cuatro) sin problemas, aunque es de pago.
```git
npm install -g serverless@3
```
* Verificamos la versión de Serverless instalada
```git
sls -v
```
* Instalamos todos los paquetes necesarios
```git
npm i
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
```
* Ejecutamos la app desde terminal.
```git
npm start
```
 
 
<br>

</details>

### 1.2) Configurar el proyecto serverless desde cero [🔝](#índice-)

<details>
  <summary>Ver</summary>
 
 <br>

* `Importante: ` El ejemplo base descrito a posteriori podemos visualizarlo en otro repositorio. Dirigirse a [SQS-offline-example-aws](https://github.com/andresWeitzel/SQS-offline-example-aws) 
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
* En base a esta config, declaramos la misma en el .yml para que por cada ejecución de serverless, se creen los recursos, la config anterior del archivo elasticmq.config es para que la tome el server de elastic.mq
* Seteamos los recursos de cola en el .yml
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
* Luego seteamos serverless-offline-sqs
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
* Luego seteamos serverless-offline-elasticmq
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
* Seteamos la lambda en el .yml...resumiendo...nos quedaria el serverless.yml de la sig manera
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
* Etc, etc, etc.
* Ejecutamos la app desde terminal.
```git
npm start
```
* Si se presenta algún mensaje indicando qué el puerto 9324 ya está en uso, podemos terminar todos los procesos dependientes y volver a ejecutar la app
```git
npx kill-port 9324
```
* Ejecutamos la app desde terminal.
```git
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


### 2.0) Endpoints Disponibles

<details>
  <summary>Ver</summary>
 
 <br>

Se incluye una colección de Postman para facilitar las pruebas de los endpoints. La colección se encuentra en:

```
/collections/Producer_Consumer_SQS.postman_collection.json
``` 

<br>

#### Enviar Mensaje (POST /sender-queue)

> Envía un mensaje a la cola SQS FIFO.

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

#### Listar Cola (GET /list-queue)

> Obtiene información sobre el estado actual de la cola SQS.

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

#### Procesamiento Manual (POST /receive-queue)

> Procesa manualmente un mensaje específico de la cola.

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

#### Procesamiento Automático (POST /receive-queue)

> Envía un mensaje para procesamiento automático.

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

#### Códigos de Error

> Lista de posibles códigos de error y sus respuestas.

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

#### Flujos de Procesamiento

> Ejemplos de flujos de procesamiento manual y automático.

#### Flujo Manual
1. Enviar mensaje:
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

2. Ver estado de la cola:
```bash
curl -X GET http://localhost:3000/dev/list-queue \
-H "x-api-key: 123456789"
```

3. Procesar mensaje:
```bash
curl -X POST http://localhost:3000/dev/receive-queue \
-H "x-api-key: 123456789" \
-H "Content-Type: application/json" \
-d '{
    "receiptHandle": "AQEB...",
    "queueUrl": "http://localhost:9324/000000000000/queue-one.fifo"
}'
```

#### Flujo Automático
1. Enviar mensaje para procesamiento automático:
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

2. Ver estado de la cola:
```bash
curl -X GET http://localhost:3000/dev/list-queue \
-H "x-api-key: 123456789"
```

</details>



### 2.0) Patrones de Procesamiento de Mensajes [🔝](#índice-)

<details>
  <summary>Ver</summary>

<br>

El sistema implementa dos patrones de procesamiento de mensajes:

#### 2.0.0) Procesamiento Automático
- **Descripción**: El sistema incluye un procesador automático que se activa una vez ejecutado, hace el proceso del sender y receiver.
- **Características**:
  - Se activa automáticamente el procesamiento una vez disparado el endpoint
  - Procesa hasta 10 mensajes por lote
  - Elimina los mensajes después de procesarlos
  - No requiere ninguna acción manual, sola la ejecución
- **Ventajas**:
  - Procesamiento en tiempo real
  - No requiere intervención manual por etapas
  - Ideal para cargas de trabajo continuas
- **Uso**: No requiere configuración adicional, se activa automáticamente al ejecutarse

#### 2.0.1) Procesamiento Manual
- **Descripción**: Permite procesar mensajes de forma manual a través de un endpoint HTTP.
- **Características**:
  - Mayor control sobre el procesamiento
  - Posibilidad de inspeccionar mensajes antes de procesarlos
  - Ideal para debugging y casos especiales
- **Uso**:
  1. Listar mensajes (GET /list-queue)
  2. Seleccionar mensaje a procesar
  3. Enviar mensaje para procesamiento (POST /receive-queue)

#### 2.0.2) Notas Importantes
- El procesamiento automático y manual pueden coexistir
- Los mensajes procesados automáticamente no estarán disponibles para el procesamiento manual
- Se recomienda usar el procesamiento manual para debugging y casos especiales o pruebas
- El procesamiento automático es ideal para producción

<br>

</details>

<br>


## Sección 3) Prueba de funcionalidad y Referencias. 


### 3.0) Prueba de funcionalidad [🔝](#índice-) 

<details>
  <summary>Ver</summary>
<br>

#### [Visualizar playlist](https://www.youtube.com/watch?v=sGK_4FQBdP8&list=PLCl11UFjHurCkJNddrHBJ_TUfMlrHuWyb)
![Index app](../doc/assets/yt/playlist.png)

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


<br>

</details>

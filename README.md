![Index app](./doc/assets/img/Producer_Consumer_SQS_FIFO_AWS.drawio.png)

# Producer_Consumer_SQS_FIFO_AWS
Comunicación entre lambda producer y lambda consumer utilizando el servicio SQS de AWS con colas FIFO implementado con Systems Manager Parameter Store, Api-Gateway, Serverless-Framework, Lambda, NodeJs, Docker, ElasticMQ, entre otros.


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
 - [1.4) Referencias.](#14-referencias-)

<br>

</details>


<br>

## Sección 1) Descripción, Tecnologías y Dependencias 


### 1.0) Descripción [🔝](#índice-) 

<details>
  <summary>Ver</summary>
 
 <br>

<br>

</details>


### 1.1) Ejecución del Proyecto [🔝](#índice-)

<details>
  <summary>Ver</summary>

* Instalamos la JDK de Java (>8) para usar docker.
* Instalamos Docker para correr la imagen de elasticmq. 
* Una vez creado un entorno de trabajo a través de algún ide, clonamos el proyecto
```git
git clone https://github.com/andresWeitzel/Producer_Consumer_SQS_FIFO_AWS
```
* Nos posicionamos sobre el proyecto
```git
cd 'projectName'
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

    # Test
    HELLO_TEST : 'HELLO_SSM_TEST'

    #Config
    REGION : 'eu-west-1'

    #SQS
    RECEIVER_QUEUE_URL : 'http://localhost:9324/queue/Receiver-Queue'



  ```
* Abrimos una terminal/cmd y creamos el contenedor de [elasticmq-native](https://hub.docker.com/r/softwaremill/elasticmq-native/) con docker.
 ```git
   docker run --name elasticmq-native -p 9324:9324 -p 9325:9325 softwaremill/elasticmq-native
 ```
* Abrimos la herramienta de docker y ejecutamos el container  
* Ejecutamos el proyecto
```git
sls offline start
```
 
 
<br>

</details>

### 1.2) Configurar el proyecto serverless desde cero [🔝](#índice-)

<details>
  <summary>Ver</summary>
 
 <br>
 
  
* Creamos un entorno de trabajo a través de algún ide, luego de crear una carpeta nos posicionamos sobre la misma
```git
cd 'projectName'
```
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
* Instalamos serverless offline 
```git
npm i serverless-offline --save-dev
```
* Instalamos serverless ssm 
```git
npm i serverless-offline-ssm --save-dev
```
* Instalamos [serverless SQS](https://www.npmjs.com/package/serverless-offline-sqs)
```git
npm i serverless-offline-sqs
```
* Instalamos [serverles elasticmq](https://www.npmjs.com/package/serverless-offline-elasticmq)
```git
npm i serverless-offline-elasticmq
```
* Instalamos docker
* Creamos el contenedor con la imagen de elasticmq para emular el servicio de colas en memoria
```git
   docker run --name elasticmq-native -p 9324:9324 -p 9325:9325 softwaremill/elasticmq-native
```
* Ejecutamos el proyecto
```git
sls offline start
```
* Una vez instalado git, lo inicializamos en nuestro proyecto
```git
git init
```
* Asiganmos la uri del remoto
```git
git remote add origin https://github.com/andresWeitzel/Microservice_Mercadolibre_Users_AWS
```
* Traemos los cambios del remoto
```git
git pull origin master
```
* Agregamos lo local, commit y push
```git
git add .
git commit -m "Updated x"
git push origin master
```
<br>

</details>


### 1.3) Tecnologías [🔝](#índice-) 

<details>
  <summary>Ver</summary>
 
 <br>
 
### Tecnologías Implementadas

| **Tecnologías** | **Versión** | **Finalidad** |               
| ------------- | ------------- | ------------- |
| SDK | 4.3.2  | Inyección Automática de Módulas para Lambdas |
| Serverless Framework Core | 3.23.0 | Core Servicios AWS |
| Serverless Plugin | 6.2.2  | Librerías para la Definición Modular |
| Systems Manager Parameter Store (SSM) | 3.0 | Manejo de Variables de Entorno |
| Amazon Simple Queue Service (SQS) | 7.0 | Servicio de colas de mensajes distribuidos | 
| Elastic MQ | 1.3 | Interfaz compatible con SQS (msg memory) | 
| Amazon Api Gateway | 2.0 | Gestor, Autenticación, Control y Procesamiento de la Api | 
| NodeJS | 14.18.1  | Librería JS |
| VSC | 1.72.2  | IDE |
| Postman| 10.11  | Cliente Http |
| CMD | 10 | Símbolo del Sistema para linea de comandos | 
| Git | 2.29.1  | Control de Versiones |



</br>

### Documentación Oficial.

| **Tecnología** | **Documentación** |               
| -------------  | ------------- |
| Serverless Framework V3 |  https://www.serverless.com//blog/serverless-framework-v3-is-live |
| Amazon Simple Queue Service (SQS) | https://aws.amazon.com/es/sqs/ | 
| Elastic MQ | https://github.com/softwaremill/elasticmq | 
| Amazon Api Gateway |  https://docs.aws.amazon.com/apigateway/latest/developerguide/welcome.html |
| NodeJs |  https://nodejs.org/en/ |
| VSC |  https://code.visualstudio.com/docs |
| Postman |  https://learning.postman.com/docs/publishing-your-api/documenting-your-api/ |
| Git   |  https://git-scm.com/docs |

</br>

### Plugins Implementados.

| **Plugin** | **Descarga** |               
| -------------  | ------------- |
| serverless-offline |  https://www.serverless.com/plugins/serverless-offline |
| serverless-offline-ssm |  https://www.npmjs.com/package/serverless-offline-ssm |
| serverless-offline-sqs | https://www.npmjs.com/package/serverless-offline-sqs |
| serverless-offline-elasticmq | https://www.npmjs.com/package/serverless-offline-elasticmq |


</br>

### Extensiones VSC Implementados.

| **Extensión** |              
| -------------  | 
| Prettier - Code formatter |
| YAML - Autoformatter .yml (alt+shift+f) |
| DotENV |



<br>

</details>


### 1.4) Referencias [🔝](#índice-)

<details>
  <summary>Ver</summary>
 
 <br>

#### Conceptos SQS
 * [Conceptos claves aws sqs](https://fourtheorem.com/what-do-you-need-to-know-about-sqs/)
 * [Diferencias SQS SNS](https://aws.amazon.com/it/sqs/faqs/)


## Usos y Ejemplificación de SQS y Serverless
* Ejemplo Base SQS : https://dev.to/piczmar_0/aws-lambda-sqs-events-with-serverless-framework-oj6
* https://aws.plainenglish.io/how-to-test-amazon-sqs-with-docker-using-serverless-b717258f5d3d
* https://github.com/alexyklu/serverless-offline-lambda-with-sqs


<br>

</details>



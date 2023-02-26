# Producer_Consumer_SQS_FIFO_AWS
Comunicación entre lambda producer y lambda consumer utilizando el servicio SQS de AWS con colas FIFO implementado con Systems Manager Parameter Store, Api-Gateway, Serverless-Framework, Lambda, NodeJs, ElasticMQ, entre otros.


### 1.2) Configurar un proyecto serverless desde cero [🔝](#índice-)

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
* Agregamos lo local, commitiamos y pusheamos
```git
git add .
git commit -m "Updated x"
git push origin master
```



<br>

</details>

### 1.4) Referencias [🔝](#índice-)

<details>
  <summary>Ver</summary>
 
 <br>

#### Conceptos SQS
 * [Conceptos claves aws sqs](https://fourtheorem.com/what-do-you-need-to-know-about-sqs/)
 * [Diferencias SQS SNS](https://aws.amazon.com/it/sqs/faqs/)

<br>

</details>

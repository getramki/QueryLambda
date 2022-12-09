# Query Lambda for RDS MySQL Private Database
It is important to create a database in private subnets in a VPC and not to expose it to internet, however it is challenging to connect to a private database instance and create the initial Schema and seed the database. This Query Lambda addresses this consern. This repo contains code for a Lambda function written in NodeJS and a SAM template to deploy it.

The Lambda function makes use of best practices of getting the secrets from Secrets Manager and using Layers for MySQL Package.

### Prerequisites
AWS Account and IAM user with necessary permissions for creating Lambda, aws cli, SAM cli, configure IAM user with necessary programmatic permissions, RDS MySQL database in a VPC.
Please install and configure above before going further

* You can incur charges in your AWS Account by following this steps below
* The code will deploy in us-west-2 region, change it where ever necessary if deploying in another region

After downloading the repo in the terminal Change Directory to repo directory and follow the steps for

* Change Directory into Layer/nodejs folder and run 
<pre><code>npm install mysql --save </pre></code>

* Edit QueryLambda.yaml by changing security groups ids and subnet ids

* Deploy the SAM template. You can follow the guide here https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-getting-started-hello-world.html

or Manually Create the Lambda function and create a layer and add it to Lambda function

* Create Secret for RDS MySQL Database you have created in the Secrets Manager (in the same region)
___
### Lambda Function Usage
Once lambda is deployed you can make use of Testing built in the Lambda console to interact with database.
The function expects three inputs Quesry String - querystr, Database Name - dbname, Secret Manager's Secret - secret

You can configure test events as follows

<pre><code>{"querystr": "CREATE DATABASE sampledb2", "dbname": "sampledb", "secret": "dbsecret"}</pre></code>

<pre><code>{"querystr": "CREATE TABLE customers (name VARCHAR(255), address VARCHAR(255))", "dbname": "sampledb","secret": "dbsecret"}</pre></code>

<pre><code>{"querystr": "INSERT INTO customers (name, address) VALUES ('Rama', 'Whitefield Bangalore')", "dbname": "sampledb", "secret": "dbsecret"}</pre></code>

<pre><code>{"querystr": "SELECT * FROM customers","dbname2": "sampledb","secret": "dbsecret"}</pre></code>
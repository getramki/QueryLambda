const aws = require("aws-sdk");
const mysql = require('mysql');

var smclient = new aws.SecretsManager({
    region: 'us-west-2'
});

var secret;
var dbconn;
var sql;

async function getSecret(SecretName) {
    var secretName = SecretName;
    
    return new Promise((resolve,reject)=>{
        console.log(secretName);
        smclient.getSecretValue({SecretId: secretName}, function(err, data) {
            if (err) {
                console.log('error:' + err.code );
                reject(err);
            }
            else {
                // Decrypts secret using the associated KMS CMK.
                // Depending on whether the secret is a string or binary, one of these fields will be populated.
                if ('SecretString' in data) {
                    console.log(data);
                    resolve(data.SecretString);
                } else {
                    let buff = new Buffer(data.SecretBinary, 'base64');
                    console.log(buff.toString('ascii'));
                    resolve(buff.toString('ascii'));
                }
            }
        });
    });
}


async function dbconnect(dbname){
    var conn;
    var dbhost = secret["host"];
    var dbuser = secret["username"];
    var dbpassword = secret["password"];
    var dbport = secret["port"];
    // var dbname = secret["dbname"];
    
  // Connect to the MySQL database
    return conn = mysql.createConnection({
        // connection info
        host: dbhost,
        user:  dbuser,
        password: dbpassword,
        port: dbport,
        database: dbname
    });
}

async function dbquery(querystr, dbname){
  try {
        dbconn = await dbconnect(dbname);
        sql = querystr
        console.log(sql);
        
        const data = await new Promise((resolve, reject) => {
          var results = [];
          dbconn.connect(function (err) {
            if (err) {
              reject(err);
            }
            dbconn.query(sql, function  (err, result) {
              if (err) {
                console.log("Error->" + err);
                reject(err);
              }

              results.push(result);
              resolve(results);
            });
          })
        });
    
        return {
          statusCode: 200,
          body: data
        }
      } catch (err) {
        return {
          statusCode: 400,
          body: err.message
        }
      }
}

exports.handler = async (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;

    secret = JSON.parse(await getSecret(event.secret));
    console.log(secret);
    
    var db = await dbquery(event.querystr, event.dbname);
    
    return db;
    
};
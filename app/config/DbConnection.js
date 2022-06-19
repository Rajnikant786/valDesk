require('dotenv').config() //import env file

// =====database connection=====
const mysql = require('mysql');

const connection = mysql.createConnection({
    host : process.env.DB_HOST,
    user : process.env.DB_USER,
    password : process.env.DB_PASSWORD,
    port:process.env.DB_PORT,
    database : process.env.DB_NAME
  },'pool' //use for multiple query
);

// connect
connection.connect( (err) => {
    if(err){
      // throw err
      console.log('Database connection failed \n Error :'+ JSON.stringify(err,undefined,2))
    }else{
      console.log('Database connected...');
    }
})

module.exports = connection;
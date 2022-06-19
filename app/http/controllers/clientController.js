var express = require('express');
var router = express.Router();
var DbConnection = require('../../config/DbConnection')
const flash = require('express-flash');
var multer = require('multer');
var path = require('path');
const bcrypt = require ('bcrypt')
const passport = require('passport')
const jwt = require('jsonwebtoken');

router.use(express.static(__dirname+"./public/"))

function clientController(){
    return{
        async index(req, res, next){
            console.log("=========== web clientController index - allClients get ================")
            var sql = "SELECT * FROM `client_master`";        
            DbConnection.query(sql, (err,result) => {
                if(err){
                    console.log(err)
                    res.json({
                        status : 'error',
                        message : JSON.stringify(err,undefined,2)
                    })
                }else{
                    console.log(result)
                    res.json({
                        status : 'success',
                        clients : result
                    })
                }
            });
        },
        async postClient(req,res,next){
            console.log("=========== web clientController postClient post ================") 
            console.log(req.body)
            var sql = 'SELECT * FROM `client_master` WHERE borrower_name=? AND client_master.last_name=?;'
        
            DbConnection.query(sql,[req.body.borrower_name,req.body.last_name], (err,result) => {
                         if(err){
                             console.log(err)
                            return res.json({
                                status : 'error',
                                message : JSON.stringify(err,undefined,2)
                            })
                         }else{
                             if(result.length > 0){
                                console.log(result);
                                return res.json({
                                    status : 'warning',
                                    message : 'This Client is already registered'
                                })
                                
                             }else{
                                console.log(result);

                                var insertSql = "INSERT INTO `client_master` set ?";
                                DbConnection.query(insertSql,req.body, (err,insertResult) => {
                                    if(err){
                                        console.log(err)
                                        return res.json({
                                            status : 'error',
                                            message : JSON.stringify(err,undefined,2)
                                        })
                                    }else{
                                        console.log(insertResult)
                                        return res.json({
                                            status : 'success',
                                            message : 'Client added successfully...'
                                        })
                                    }
                                    
                                })
                                
                             }
                         }
                         
            });
        },
        async clientDetailById(req, res, next){
            console.log("=========== web clientController clientDetailById get ================") 
            console.log("clientId :- "+req.params.clientId)
            var clientId = req.params.clientId;
            var sql = 'SELECT * FROM `client_master` WHERE client_id=?;'
            DbConnection.query(sql,clientId, (err,client) => {
                if(err){
                    console.log(err)
                   return res.json({
                       status : 'error',
                       message : JSON.stringify(err,undefined,2)
                   })
                }else{
                    console.log(client[0])
                    return res.json({
                        status : 'success',
                        clientDetail : client[0]
                    })
                }
            });
        }
    }
}
module.exports = clientController
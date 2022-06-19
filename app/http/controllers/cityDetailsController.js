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

function cityDetailsController(){
    return{
        async index(req, res, next){
            console.log("=========== web cityDetailsController index get ================")  
            if(req.session.userName){
                console.log("req.session.userName :- "+ req.session.userName)
                var userName = req.session.userName;
                var userEmail = req.session.Email;
                var userImage = req.session.Image;
                var userType = req.session.userType;
                res.render('addCity', {  title: 'ValDesk - Add City Admin only',userName, userEmail, userImage ,userType, message : flash('success','error') } );
            }
            else{
                req.flash('error','Session expired')
                return res.redirect('/');
            }        
        }, 
        async addCity(req, res, newxt){
            console.log("=========== web cityDetailsController addCity post ================") 
            console.log(req.body);
            // data = {
            //     city_code: req.body.city_code,
            //     city_name: req.body.city_name,
            //     status: req.body.status,
            //     create_by: req.body.create_by
            // }
            // var sql = "SELECT * FROM city_master WHERE city_code='+req.body.city_code+' AND city_name='+req.body.city_name';"

            // var sql = "SELECT * FROM city_master WHERE city_name=? AND (SELECT * FROM city_master WHERE city_code=?)";

            /*SELECT * FROM `city_master` WHERE 1; SELECT * FROM city_master WHERE city_name='city name' AND (SELECT * FROM city_master WHERE city_code='city code new'); SELECT * FROM city WHERE city ="Abha" AND country_id = 82; */ 
            // SELECT * FROM city_master WHERE city_code ="city code" AND city_master.city_name = "city name"
            var sql = "SELECT * FROM `city_master` WHERE city_code=? AND city_master.city_name=?";


        
            DbConnection.query(sql,[req.body.city_code,req.body.city_name], (err,result) => {
                if(err){
                    //  res.send(err)
                    // res.end("Database connection error")
                    // throw err;
                    req.flash('error',JSON.stringify(err,undefined,2))
                    return res.redirect('/addCity');
                }else{
                    if(result.length > 0){
                        console.log(result);
                        req.flash('error','This city code or city name is already registered')
                        return res.redirect('/addCity');                                
                    }else{
                        console.log(result);
                        var insertSql = "INSERT INTO `city_master` set ?";
                        DbConnection.query(insertSql,req.body, (err,cityResult) => {
                            if(err){
                                console.log(err)
                                // res.end('Something went wrong \n Error :'+ JSON.stringify(err,undefined,2))
                                req.flash('error',JSON.stringify(err,undefined,2))
                                return res.redirect('/addCity');  
                            }else{
                                // console.log(cityResult);
                                req.flash('success','City registered successfully')
                                return res.redirect('/allCities');
                            }
                            
                        })
                    }
                }
            });
        },
        async deleteCityById(req, res, next){
            console.log("=========== web cityDetailsController deleteCityById ================")
            console.log("cityId :- "+req.params.city_id) 
            var cityId = req.params.city_id;
            var deleteSql = "DELETE FROM `city_master` WHERE `city_id` = ?";
                DbConnection.query(deleteSql,cityId,(err,result) => {
                    if(err){
                        console.log(err)
                        // res.end('Something went wrong \n Error :'+ JSON.stringify(err,undefined,2))
                        req.flash('error',JSON.stringify(err,undefined,2))
                        return res.redirect('/allCities')
                    }else{
                        // console.log(result);
                        // console.log("Product added successfully...")
                        req.flash('success','City deleted successfully...')
                        return res.redirect('/allCities') 
                    }
                            
                })   
        },
        async cityNameByCityCode(req, res, next){
            console.log("=========== web cityDetailsController cityNameByCityCode ================")
            console.log("cityCode :- "+req.params.city_code) 
            var cityCode = req.params.city_code
            var sql = "SELECT city_name FROM `city_master` WHERE city_code=?";        
            DbConnection.query(sql,cityCode, (err,result) => {
                if(err){
                    //  res.send(err)
                    // res.end("Database connection error")
                    // throw err;
                    req.flash('error',JSON.stringify(err,undefined,2))
                    return res.redirect('/addBranch');
                }else{
                    console.log(result)
                    res.send(result[0])
                }
            });
        }
    }
}

module.exports = cityDetailsController
var express = require('express');
var router = express.Router();
var DbConnection = require('../../config/DbConnection')
const flash = require('express-flash');
var multer = require('multer');
var path = require('path');
const bcrypt = require ('bcrypt')
const passport = require('passport')
const jwt = require('jsonwebtoken')
const fileUpload = require('express-fileupload')
var multer = require('multer');

router.use(express.static(__dirname+"./public/"))

require('dotenv').config() //import env file

function bankDetailsController(){
    return{
        async index(req, res, next){
            console.log("=========== web bankDetailsController index get ================")     
            if(req.session.userName){
                console.log("req.session.userName :- "+ req.session.userName)
                var userName = req.session.userName;
                var userEmail = req.session.Email;
                var userImage = req.session.Image;
                var userType = req.session.userType;
                res.render('addBank', {  title: 'ValDesk - Add Bank Admin only',userName, userEmail, userImage ,userType, message : flash('success','error') } );
            }
            else{
                req.flash('error','Session expired')
                return res.redirect('/');
            }   
        }, 
        async addBank(req, res, next){
            console.log("=========== web bankDetailsController addBank post ================")

            var date =new Date();
            var currentDate = date.getDate();
            // var m = [01,02,03,04,05,06,07,08,09,10,11,12]
            // var month = m[date.getMonth()];
            var month = date.getMonth() + 1;
            var month1 = month < 10 ? '0' + month : '' + month; // ('' + month) for string result

            var year = date.getFullYear();
            this.todayDate =year+"-"+month1+"-"+currentDate
            console.log("todayDate :- "+this.todayDate)

            // ======================          

            const Storage = multer.diskStorage({
                destination: './public/uploadBankDetails/',
                filename: (req, file, cb) => {
                    // cb(null,file.fieldname + '-' + Date.now()+path.extname(file.originalname))
                    // cb(null,req.body.username+'_'+todayDate+'_'+file.originalname)
                    cb(null,req.body.bank_code+'_'+todayDate+'_'+file.originalname) //${file.originalname}
                    // cb(null,Date.now()+'_'+file.originalname)
                }
            })
            
            const upload = multer({
                storage: Storage,
                // limits:{
                //     fileSize: 1024 * 1024 * 5
                // },
                // fileFilter: (req, file, cb) => {
                //     if(file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg"){
                //         cb(null, true)
                //     }else{
                //         req.fileTypeValidationError = 'Only .png, .jpg and .jpeg format allowed!'
                //         return cb(null, false, req.fileTypeValidationError)
                //     }
                // }
            }).single('attachment_file');

            upload(req, res, (err) => {
                // if(req.fileTypeValidationError){
                //     console.log("========image error========")
                //     res.json({
                //         status : 'error',
                //         message : req.fileTypeValidationError
                //     })
                // }
                if(err){
                    console.log("error\n")
                    console.log(err)
                    req.flash('error',JSON.stringify(err,undefined,2))
                }else{
                    // console.log("file")
                    // console.log(req.file);
                    // console.log("filename :- "+req.file.filename)
                    // console.log(req.body)


                    // {
                    //     fieldname: 'attachment_file',
                    //     originalname: 'Marketing - Executive Program in Financial Analytics.docx',
                    //     encoding: '7bit',
                    //     mimetype: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                    //     destination: './public/uploadBankDetails/',
                    //     filename: '1640704382021_Marketing - Executive Program in Financial Analytics.docx',
                    //     path: 'public\\uploadBankDetails\\1640704382021_Marketing - Executive Program in Financial Analytics.docx',
                    //     size: 40386
                    //   }
                    //   [Object: null prototype] {
                    //     bank_code: 'tyt',
                    //     bank_name: 'ttryt',
                    //     bank_RO_address: 'trgtrr',
                    //     bank_RO_DGM: 'thtry',
                    //     bank_RO_number: '4556767',
                    //     remarks: 'fghghtyyhty',
                    //     status: 'Active',
                    //     create_by: 'rajnikant kumar paswan - Admin'
                    //   }

                    var bankCode = req.body.bank_code;
                    var bankName = req.body.bank_name;
                    var bankROaddress = req.body.bank_RO_address;
                    var bankRoDgm = req.body.bank_RO_DGM;
                    var bankRoNumber = req.body.bank_RO_number;
                    var Remarks = req.body.remarks;
                    var Status = req.body.status;
                    var createBy = req.body.create_by;

                    if(req.file){
                      var attachmentFile = req.file.filename;
                    }else{
                        var  attachmentFile = "";
                    }

                    var data = {
                        bank_code: bankCode,
                        bank_name: bankName,
                        bank_RO_address: bankROaddress,
                        bank_RO_DGM: bankRoDgm,
                        bank_RO_number: bankRoNumber,
                        attachment_file: attachmentFile,
                        remarks: Remarks,
                        status: Status,
                        create_by: createBy
                    }

                    console.log(data);
                    
                    var sql = 'SELECT * FROM bank_master WHERE bank_code=?;'
        
                    DbConnection.query(sql,bankCode, (err,result) => {
                         if(err){
                            //  res.send(err)
                            // res.end("Database connection error")
                            // throw err;
                            req.flash('error',JSON.stringify(err,undefined,2))
                            return res.redirect('/addBank');
                         }else{
                             if(result.length > 0){
                                // res.send(result);
                                console.log(result);
                                // res.end("This email id is already registered")
                                // req.flash('bank_code', bankCode)
                                // req.flash('bank_name', bankName)
                                // req.flash('error','This bank code '+bankCode+' is already registered')
                                req.flash('error','This bank code is already registered')
                                return res.redirect('/addBank');
                                // res.render('allEmployees', { employees : result , title: 'ValDesk - All Employees',userName, userEmail, userImage, userType , message : flash('success','error') } );
                                
                             }else{
                                console.log(result);

                                // var insertSql = "INSERT INTO bank_master(username,email,password,userType,Status) values(?,?,?,?,?)";
        
                                var insertSql = "INSERT INTO bank_master set ?";
                                DbConnection.query(insertSql,data, (err,insertResult) => {
                                    if(err){
                                        // console.log(err)
                                        // res.end('Something went wrong \n Error :'+ JSON.stringify(err,undefined,2))
                                        req.flash('error',JSON.stringify(err,undefined,2))
                                    }else{
                                        // console.log(insertResult);
                                        req.flash('success','Bank registered successfully')
                                        return res.redirect('/allBanks');
                                    }
                                    
                                })
                                
                             }
                         }
                         
                    });

                }
            }); 

        },

        async deleteBankById(req, res, next){
            console.log("=========== web bankDetailsController deleteProduct ================")
            console.log("bankId :- "+req.params.bank_id) 
            var bankId = req.params.bank_id;
            var deleteSql = "DELETE FROM `bank_master` WHERE `bank_id` = ?";
                DbConnection.query(deleteSql,bankId,(err,result) => {
                    if(err){
                        console.log(err)
                        // res.end('Something went wrong \n Error :'+ JSON.stringify(err,undefined,2))
                        req.flash('error',JSON.stringify(err,undefined,2))
                        return res.redirect('/allBanks')
                    }else{
                        // console.log(result);
                        // console.log("Product added successfully...")
                        req.flash('success','Bank deleted successfully...')
                        return res.redirect('/allBanks')  //,{success : 'Product added successfully...'}
                    }
                            
                })   
        },



        // ===================== branch ====================
        async branch(req, res, next){
            console.log("=========== web bankDetailsController branch get ================")

            if(req.session.userName){
                console.log("req.session.userName :- "+ req.session.userName)
                var userName = req.session.userName;
                var userEmail = req.session.Email;
                var userImage = req.session.Image;
                var userType = req.session.userType;
                // bank_master

                bankSelectQuery = ' SELECT bank_code , bank_name FROM `bank_master` ';
                DbConnection.query(bankSelectQuery, (err,result) => {
                    if(err){
                        console.log(err);
                        req.flash('error',JSON.stringify(err,undefined,2))
                    }else{
                        console.log(result);
                        console.log(result.length);
                        citySqlQuery = "SELECT * FROM `city_master` WHERE status = 'Active' ";
                        DbConnection.query(citySqlQuery, (err,cityList) => {
                            if(err){
                                console.log(err);
                                req.flash('error',JSON.stringify(err,undefined,2))
                            }else{
                                console.log(cityList);
                                console.log(cityList.length);
                                var serverUrl = process.env.SERVER_URL;
                                res.render('addBankBranch', { banks : result, cities : cityList, serverUrl, title: 'ValDesk - Add Bank Branch Admin only',userName, userEmail, userImage ,userType, message : flash('success','error') } );
                            }
                        })
                    }
                })

                
            }
            else{
                req.flash('error','Session expired')
                return res.redirect('/');
            }   

        },
        async addBranch(req, res, next){
            console.log("=========== web bankDetailsController addBranch post ================")

            // ======================
            console.log(req.body);

            // bank_code: 'bank_code1',
            // branch_name: 'branch name',
            // city_code: 'city code',
            // city_name: 'city',
            // branch_scale: 'branch scalke',
            // branch_contact_1: '876543246',
            // branch_contact_2: '8765445686',
            // branch_IFSC: 'branch ifsc',
            // branch_section: 'branch section',
            // branch_address: 'branch address',
            // branch_RO_code: 'branch ro code',
            // branch_email: 'branch@gmail.com',
            // branch_type: 'branch type',
            // status: 'Active',
            // create_by: 'rajnikant kumar paswan - Admin'

            var sql = 'SELECT * FROM bank_branch_master WHERE branch_name=?;'
        
            DbConnection.query(sql,req.body.branch_name, (err,result) => {
                         if(err){
                            //  res.send(err)
                            // res.end("Database connection error")
                            // throw err;
                            req.flash('error',JSON.stringify(err,undefined,2))
                         }else{
                             if(result.length > 0){
                                // res.send(result);
                                console.log(result);
                                // res.end("This email id is already registered")
                                // req.flash('bank_code', bankCode)
                                // req.flash('bank_name', bankName)
                                // req.flash('error','This bank code '+bankCode+' is already registered')
                                req.flash('error','This branch name is already registered')
                                return res.redirect('/addBranch');
                                // res.render('allEmployees', { employees : result , title: 'ValDesk - All Employees',userName, userEmail, userImage, userType , message : flash('success','error') } );
                                
                             }else{
                                console.log(result);

                                var insertSql = "INSERT INTO `bank_branch_master` set ?";
                                DbConnection.query(insertSql,req.body, (err,insertResult) => {
                                    if(err){
                                        // console.log(err)
                                        // res.end('Something went wrong \n Error :'+ JSON.stringify(err,undefined,2))
                                        req.flash('error',JSON.stringify(err,undefined,2))
                                    }else{
                                        // console.log(insertResult);
                                        req.flash('success','Bank branch registered successfully')
                                        return res.redirect('/allBranches');
                                    }
                                    
                                })
                                
                             }
                         }
                         
            });

        },

        async deleteBranchById(req, res, next){
            console.log("=========== web bankDetailsController deleteBranchById ================")
            console.log("branchId :- "+req.params.branch_id) 
            var branchId = req.params.branch_id;
            var deleteSql = "DELETE FROM `bank_branch_master` WHERE `branch_id` = ?";
                DbConnection.query(deleteSql,branchId,(err,result) => {
                    if(err){
                        console.log(err)
                        // res.end('Something went wrong \n Error :'+ JSON.stringify(err,undefined,2))
                        req.flash('error',JSON.stringify(err,undefined,2))
                        return res.redirect('/allBranches')
                    }else{
                        // console.log(result);
                        // console.log("Product added successfully...")
                        req.flash('success','Branch deleted successfully...')
                        return res.redirect('/allBranches') ; 
                    }
                            
                })   
        },



        // =============== branchmanager ====================
        async branchManager(req, res, next){
            console.log("=========== web bankDetailsController branchManager get ================")

            if(req.session.userName){
                console.log("req.session.userName :- "+ req.session.userName)
                var userName = req.session.userName;
                var userEmail = req.session.Email;
                var userImage = req.session.Image;
                var userType = req.session.userType;

                bankSelectQuery = ' SELECT bank_code , bank_name FROM `bank_master` ';
                DbConnection.query(bankSelectQuery, (err,result) => {
                    if(err){
                        console.log(err);
                        req.flash('error',JSON.stringify(err,undefined,2))
                    }else{
                        console.log(result);
                        console.log(result.length);
                        citySqlQuery = "SELECT * FROM `city_master` WHERE status = 'Active' ";
                        DbConnection.query(citySqlQuery, (err,cityList) => {
                            if(err){
                                console.log(err);
                                req.flash('error',JSON.stringify(err,undefined,2))
                            }else{
                                console.log(cityList);
                                console.log(cityList.length);
                                var serverUrl = process.env.SERVER_URL;
                                res.render('addBranchManager', { banks : result, cities : cityList, title: 'ValDesk - Add Branch Manager Admin only',serverUrl,userName, userEmail, userImage ,userType, message : flash('success','error') } );
                            }
                        })
                    }
                })       
            }
            else{
                req.flash('error','Session expired')
                return res.redirect('/');
            }   

        },

        
        async branchNameByBankCode(req, res, next){
            console.log("=========== web bankDetailsController branchNameByBankCode ================")
            // console.log(req.body);
            console.log("bankCode :- "+req.params.bank_code) 
            console.log("cityCode :- "+req.params.city_code) 
            var bankCode = req.params.bank_code;
            var cityCode = req.params.city_code;
            var selectSql =  "select branch_name  FROM `bank_branch_master` WHERE `bank_code` = ? AND bank_branch_master.city_code = ? ";
            DbConnection.query(selectSql,[bankCode,cityCode],(err,result) => {
                if(err){
                    console.log(err)
                    // res.end('Something went wrong \n Error :'+ JSON.stringify(err,undefined,2))
                    req.flash('error',JSON.stringify(err,undefined,2))
                    return res.redirect('/addBranchManager')
                }else{
                    console.log(result);
                    // res.send(result);
                    res.json({
                        bankNames : result 
                    })
                    // req.flash('success','Branch deleted successfully...')
                    // return res.redirect('/addBranchManager') ; 
                }
                            
            })   
        },

        async addBranchManager(req, res, next){
            console.log("=========== web bankDetailsController addBranchManager post ================")

            // ======================
            console.log(req.body);

            // bank_code: 'bank_code1',
            // branch_name: 'branch_name_1',
            // manager_name: 'rajnikant',
            // manager_last_name: 'kumar',
            // manager_dob: '12-07-1997',
            // gender: 'male',
            // manager_scale: 'software engineer',
            // manager_designation: 'developer',
            // manager_official_number: '9111910849',
            // manager_personal_number: '7004082386',
            // manager_personal_email: 'rajni@gmail.com',
            // manager_bank_email: 'bank@gmail.com',
            // manager_address: 'manager address',
            // remarks: 'manager remarks',
            // status: 'Active',
            // create_by: 'rajnikant kumar paswan - Admin'

            // var sql = 'SELECT * FROM `bank_manager_master` WHERE manager_name=?;'
        
            // DbConnection.query(sql,req.body.manager_name, (err,result) => {
            //     if(err){
            //         req.flash('error',JSON.stringify(err,undefined,2))
            //     }else{
            //         if(result.length > 0){
            //             // res.send(result);
            //             console.log(result);
            //             // res.end("This email id is already registered")
            //             // req.flash('bank_code', bankCode)
            //             // req.flash('bank_name', bankName)
            //             // req.flash('error','This bank code '+bankCode+' is already registered')
            //             req.flash('error','This branch manager name is already registered')
            //             return res.redirect('/addBranchManager');
            //             // res.render('allEmployees', { employees : result , title: 'ValDesk - All Employees',userName, userEmail, userImage, userType , message : flash('success','error') } );
                                
            //         }else{
            //             console.log(result);
                        var insertSql = "INSERT INTO `bank_manager_master` set ?";
                        DbConnection.query(insertSql,req.body, (err,insertResult) => {
                            if(err){
                                // console.log(err)
                                // res.end('Something went wrong \n Error :'+ JSON.stringify(err,undefined,2))
                                req.flash('error',JSON.stringify(err,undefined,2))
                            }else{
                                // console.log(insertResult);
                                req.flash('success','Bank branch manager added successfully')
                                return res.redirect('/allBranchManagers');
                            }
                                    
                        })
                                
            //         }
            //     }
                         
            // });

        },

        async deleteBranchManagerById(req, res, next){
            console.log("=========== web bankDetailsController deleteBranchManagerById ================")
            console.log("branchManagerId :- "+req.params.branch_mnanager_id) 
            var branchManagerId = req.params.branch_mnanager_id;
            var deleteSql = "DELETE FROM `bank_manager_master` WHERE `manager_id` = ?";
                DbConnection.query(deleteSql,branchManagerId,(err,result) => {
                    if(err){
                        console.log(err)
                        // res.end('Something went wrong \n Error :'+ JSON.stringify(err,undefined,2))
                        req.flash('error',JSON.stringify(err,undefined,2))
                        return res.redirect('/allBranchManagers')
                    }else{
                        // console.log(result);
                        // console.log("Product added successfully...")
                        req.flash('success','Branch manager deleted successfully...')
                        return res.redirect('/allBranchManagers') ; 
                    }
                            
                })   
        }
    }
}

module.exports = bankDetailsController

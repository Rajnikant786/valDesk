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

function bankLeadsController(){
    return{
        async index(req, res, next){
            console.log("=========== web bankLeadsController index get ================")  
            if(req.session.userName){
                console.log("req.session.userName :- "+ req.session.userName)
                var userName = req.session.userName;
                var userEmail = req.session.Email;
                var userImage = req.session.Image;
                var userType = req.session.userType;
                var userId = req.session.userId;
                // bankSelectQuery = ' SELECT bank_code , bank_name FROM `bank_master` ';
                bankSelectQuery = ' SELECT bank_code FROM `bank_master` ';
                DbConnection.query(bankSelectQuery, (err,bankCodes) => {
                    if(err){
                        console.log(err);
                        req.flash('error',JSON.stringify(err,undefined,2))
                    }else{
                        console.log(bankCodes);
                        citySqlQuery = "SELECT * FROM `city_master` WHERE status = 'Active' ";
                        DbConnection.query(citySqlQuery, (err,cityList) => {
                            if(err){
                                console.log(err);
                                req.flash('error',JSON.stringify(err,undefined,2))
                            }else{
                                console.log(cityList);
                                // console.log(cityList.length);
                                var serverUrl = process.env.SERVER_URL;                                
                                res.render('addLead', { bank_codes: bankCodes, cities : cityList, serverUrl,userId, title: 'ValDesk - Add Lead Admin only',userName, userEmail, userImage ,userType, message : flash('success','error') } );
                            }
                        })
                        
                    }
                });                
            }
            else{
                req.flash('error','Session expired')
                return res.redirect('/');
            }        
        },
        async addBankLead(req, res, next){
            console.log("=========== web bankLeadsController addBankLead ================")
            console.log(req.body);
            var insertLeadSql =  "INSERT INTO bank_lead_master set ?";
            DbConnection.query(insertLeadSql,req.body, (err,result) => {
                if(err){
                    // console.log(err)
                    // res.end('Something went wrong \n Error :'+ JSON.stringify(err,undefined,2))
                    req.flash('error',JSON.stringify(err,undefined,2))
                    return res.redirect('/addLead');
                }else{
                    // console.log(insertResult);
                    req.flash('success','Bank Lead saved successfully')
                    return res.redirect('/addLead'); //allLeads
                }
                
            })
        },
        async bankNameByBankCode(req, res, next){
            console.log("=========== web bankLeadsController bankNameByBankCode ================")
            console.log("bankCode :- "+req.params.bank_code) 
            var bankCode = req.params.bank_code;
            // var selectSql =  "select bank_name  FROM `bank_master` WHERE `bank_code` = ?";
            var selectSql =  "select *  FROM `bank_master` WHERE `bank_code` = ?";
            DbConnection.query(selectSql,bankCode,(err,result) => {
                if(err){
                    console.log(err)
                    req.flash('error',JSON.stringify(err,undefined,2))
                    return res.redirect('/addLead')
                }else{
                    console.log(result);
                    res.json({
                        bankDetails : result 
                    }) 
                }
                            
            })   
        },
        async branchDetail(req,res,next){
            console.log("=========== web bankLeadsController bankNameByBankCode ================")
            console.log("branchName :- "+req.params.branchName) 
            console.log("cityCode :- "+req.params.cityCode) 
            var branchName = req.params.branchName;
            var cityCode = req.params.cityCode;
            var selectSql =  "select *  FROM `bank_branch_master` WHERE `branch_name` = ? AND bank_branch_master.city_code = ?";
            DbConnection.query(selectSql,[branchName,cityCode],(err,result) => {
                if(err){
                    console.log(err)
                    req.flash('error',JSON.stringify(err,undefined,2))
                    return res.redirect('/addLead')
                }else{
                    //console.log(result[0]);
                    if(result){
                        var managerSql =  "select manager_name  FROM `bank_manager_master` WHERE `branch_name` = ? AND bank_manager_master.city_code = ?";
                        DbConnection.query(managerSql,[branchName,cityCode],(err,managerResult) => {
                            if(err){
                                console.log(err)
                                req.flash('error',JSON.stringify(err,undefined,2))
                                return res.redirect('/addLead')
                            }else{
                                //console.log(managerResult)
                                let branchResult = result[0];
                                res.json({
                                    branchDetails : branchResult,
                                    branchManager : managerResult
                                }) 
                            }
                        })
                    }
                    
                }
                            
            }) 
        },
        async uploadLeadDoc(req, res, next){
            console.log("=========== web bankLeadsController uploadLeadDoc ==============")
            //console.log(req.body)
           // console.log(req.file)
            var date =new Date();
            var currentDate = date.getDate();
            // var m = [01,02,03,04,05,06,07,08,09,10,11,12]
            // var month = m[date.getMonth()];
            var month = date.getMonth() + 1;
            var month1 = month < 10 ? '0' + month : '' + month; // ('' + month) for string result

            var year = date.getFullYear();
            this.todayDate =year+"-"+month1+"-"+currentDate
            console.log("todayDate :- "+this.todayDate)

            // ============upload file============
            const Storage = multer.diskStorage({
                destination: './public/uploadLeadDocuments/',
                filename: (req, file, cb) => {
                    // cb(null,file.fieldname + '-' + Date.now()+path.extname(file.originalname))
                    cb(null,'leadId-'+req.body.lead_id+'_'+todayDate+'_'+file.originalname) //${file.originalname}
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
            }).single('leadDocument');

            
            upload(req, res, (err) => {
                if(err){
                    console.log("error\n")
                    console.log(err)
                    // res.json({
                    //     status: 'error',
                    //     message: 'Something went wrong ! \n'+JSON.stringify(err,undefined,2)
                    // })
                    req.flash('error','Something went wrong ! \n'+JSON.stringify(err,undefined,2))
                    return res.redirect('/allLeads');
                }else{
                    // res.json({
                    //     status: 'success',
                    //     message: req.file
                    // })

                    // console.log("file")
                    // console.log(req.file)

                    // fieldname: 'leadDocument',
                    // originalname: 'Intraday Landing Page Content_06-0-22.docx',
                    // encoding: '7bit',
                    // mimetype: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                    // destination: './public/uploadLeadDocuments/',
                    // filename: 'leadId-3_2022-01-15_Intraday Landing Page Content_06-0-22.docx',
                    // path: 'public\\uploadLeadDocuments\\leadId-3_2022-01-15_Intraday Landing Page Content_06-0-22.docx',
                    // size: 7857
                    
                    var leadId = req.body.lead_id
                    var document = req.file.filename
                    var documentType = req.body.document_type
                    var uploadedBy = req.body.uploaded_by
                    var Remarks = req.body.remarks
                    if(req.file){
                        var data = {
                            lead_id : leadId,
                            document_name : document,
                            document_type : documentType,
                            uploaded_by : uploadedBy,
                            remarks : Remarks
                        }
                        var insertSql = "INSERT INTO `leadDocument_master` set ?";
                        DbConnection.query(insertSql,data,(errs,result) => {
                            if(errs){
                                // console.log(err)
                                // res.end('Something went wrong \n Error :'+ JSON.stringify(err,undefined,2))
                                // res.json({
                                //     status: 'error',
                                //     message: 'Something went wrong ! \n'+JSON.stringify(errs,undefined,2)
                                // })
                                req.flash('error','Something went wrong ! \n'+JSON.stringify(err,undefined,2))
                                return res.redirect('/allLeads');
                            }else{
                                // console.log(result);
                                // console.log("Employee added successfully...")
                                // req.flash('success','Employee added successfully...')
                                // res.json({
                                //     status: 'success',
                                //     message: 'Document uploaded successfully...'
                                // })
                                req.flash('success','Document uploaded successfully...')
                                return res.redirect('/allLeads');
                            }
                                    
                        })
                    }else{
                        // res.json({
                        //     status: 'error',
                        //     message: 'Please upload some documents...'
                        // })
                        req.flash('error','Please upload some documents...')
                        return res.redirect('/allLeads');
                    }
                    

                    /*
                    console.log(req.file);
                    console.log(req.body);
                    console.log(req.file)
                    // lead_id: '2',
                    // document: '6_reason.png',
                    // document_type: 'Registory',
                    // remarks: 'remareks herr'*/
                }
            })
        },
        async documentsById(req, res, next){
            console.log("=========== web bankLeadsController documentsById get ================") 
            console.log("leadId :-"+req.params.leadId)
            var leadId = req.params.leadId;
            var selectSql =  "select *  FROM `leadDocument_master` WHERE `lead_id` = ?";
            DbConnection.query(selectSql,leadId,(err,results) => {
                if(err){
                    console.log(err)
                    // req.flash('error',JSON.stringify(err,undefined,2))
                    res.json({
                        status : 'error',
                        message : 'Something went wrong \n'+JSON.stringify(err,undefined,2)
                    })
                }else{
                    console.log(results);
                    console.log(results.length)
                    if(results.length > 0){
                        res.json({
                            status: 'success',
                            documents : results 
                        }) 
                    }else{
                        res.json({
                            status: 'warning',
                            message : 'No any documents uploaded in this bank lead' 
                        }) 
                    }                    
                }
                            
            }) 
        },
        async documentsByDocId(req, res, next){
            console.log("=========== web bankLeadsController documentsByDocId get ================") 
            console.log("docId :-"+req.params.docId)
            var docId = req.params.docId;
            var selectSql =  "select *  FROM `leadDocument_master` WHERE `doc_id` = ?";
            DbConnection.query(selectSql,docId,(err,results) => {
                if(err){
                    console.log(err)
                    // req.flash('error',JSON.stringify(err,undefined,2))
                    res.json({
                        status : 'error',
                        message : 'Something went wrong \n'+JSON.stringify(err,undefined,2)
                    })
                }else{
                    console.log(results);
                    console.log(results.length)
                    if(results.length > 0){
                        res.json({
                            status: 'success',
                            documents : results[0] 
                        }) 
                    }else{
                        res.json({
                            status: 'warning',
                            message : 'No any documents uploaded in this bank lead' 
                        }) 
                    }                    
                }
                            
            }) 
        }
    }
}

module.exports = bankLeadsController
var express = require('express');
var router = express.Router();
const flash = require('express-flash');
const fs = require('fs');
// const pdf = require('pdf-creator-node');
const path = require('path');
var DbConnection = require('../app/config/DbConnection');

// ====import controllers=====
var authController = require('../app/http/controllers/authController')
var employeeDetailsController = require('../app/http/controllers/employeeDetailsController')
var bankDetailsController = require('../app/http/controllers/bankDetailsController')
var cityDetailsController = require('../app/http/controllers/cityDetailsController')
var bankLeadsController = require('../app/http/controllers/bankLeadsController')
var clientController = require('../app/http/controllers/clientController')
var surveyController = require('../app/http/controllers/surveyController')

// ======== server url ======
var serverUrl = process.env.SERVER_URL;

/* GET login page. */
router.get('/',function(req, res, next) {
    console.log("req.session.userName1 :- "+req.session.userName)
    if(req.session.userName){
        // return next()
        console.log("================== authMiddleware ======================")
        console.log("req.session.userName2 :- "+req.session.userName)
        return res.redirect('/home')
    }
    res.render('login', { title: 'ValDesk - Login', message : flash('success','error') });
});

/* GET home page. */
router.get('/home', function(req, res, next) {
    if(req.session.userName){
      console.log("req.session.userName :- "+ req.session.userName)
      var userName = req.session.userName;
      var userEmail = req.session.Email;
      var userImage = req.session.Image;
      var userType = req.session.userType;
      var userId = req.session.userId;
      console.log("=== userImage ==="+userImage)
      console.log("=== userType ==="+userType)
      console.log("=== userId ==="+userId)
      res.render('dashboard', { title: 'ValDesk - Home' ,userName,serverUrl, userEmail, userImage , userType ,userId  });
    }
    else{
        req.flash('error','Session expired')
        return res.redirect('/');
    }
});

/*========login========*/
router.post('/login',authController().postLogin);

// ======= city master ========
router.get('/allCities', (req, res) => {
    console.log("==================== get allCities =====================")
    // ========getCategory=========
    var sql = "select * from `city_master` where status = 'Active' "; // where status = 'Active'
    DbConnection.query(sql, (err, result) => {
        if(err){
            console.log('Something went wrong \n Error :'+ JSON.stringify(err,undefined,2))
            res.send('Something went wrong \n Error :'+ JSON.stringify(err,undefined,2));
        }
        
        else{
        //     const getCategories = result;  
            console.log(result)
            if(req.session.userName){
                console.log("req.session.userName :- "+ req.session.userName)
                var userName = req.session.userName;
                var userEmail = req.session.Email;
                var userImage = req.session.Image;
                var userType = req.session.userType;
                res.render('allCities', { cities : result , title: 'ValDesk - All City',userName, userEmail, userImage, userType , message : flash('success','error') } );
            }
            else{
                req.flash('error','Session expired')
                return res.redirect('/');
            }

            
        }
      

    });
    
});
router.get('/addCity',cityDetailsController().index);
router.post('/addCity',cityDetailsController().addCity);
router.get('/deleteCityById/:city_id',cityDetailsController().deleteCityById);
router.get('/getCityName/:city_code',cityDetailsController().cityNameByCityCode)

// ================users page==================
router.get('/allEmployees', (req, res) => {
    console.log("==================== get allUsers =====================")
    // ========getCategory=========
    var sql = "select * from `user_masters` "; // where status = 'Active'
    DbConnection.query(sql, (err, result) => {
        if(err){
            console.log('Something went wrong \n Error :'+ JSON.stringify(err,undefined,2))
            res.send('Something went wrong \n Error :'+ JSON.stringify(err,undefined,2));
        }
        
        else{
        //     const getCategories = result;  
            console.log(result)
            if(req.session.userName){
                console.log("req.session.userName :- "+ req.session.userName)
                var userName = req.session.userName;
                var userEmail = req.session.Email;
                var userImage = req.session.Image;
                var userType = req.session.userType;
                res.render('allEmployees', { employees : result , title: 'ValDesk - All Employees',userName, userEmail, userImage, userType , message : flash('success','error') } );
            }
            else{
                req.flash('error','Session expired')
                return res.redirect('/');
            }

            
        }
      

    });
    
});

router.get('/addEmployee',employeeDetailsController().addEmployeeAdmin);
router.post('/addEmployee',employeeDetailsController().addEmployee);


// =================== banks ======================
router.get('/allBanks', (req, res) => {
    console.log("==================== get allBanks =====================")
    // ========getCategory=========
    var sql = "select * from `bank_master` where status = 'Active' "; // where status = 'Active'
    DbConnection.query(sql, (err, result) => {
        if(err){
            console.log('Something went wrong \n Error :'+ JSON.stringify(err,undefined,2))
            res.send('Something went wrong \n Error :'+ JSON.stringify(err,undefined,2));
        }
        
        else{
        //     const getCategories = result;  
            console.log(result)
            if(req.session.userName){
                console.log("req.session.userName :- "+ req.session.userName)
                var userName = req.session.userName;
                var userEmail = req.session.Email;
                var userImage = req.session.Image;
                var userType = req.session.userType;
                res.render('allBanks', { banks : result , title: 'ValDesk - All Banks',userName, userEmail, userImage, userType , message : flash('success','error') } );
            }
            else{
                req.flash('error','Session expired')
                return res.redirect('/');
            }

            
        }
      

    });
    
});
router.get('/addBank',bankDetailsController().index);
router.post('/addBank',bankDetailsController().addBank);
router.get('/deleteBankById/:bank_id',bankDetailsController().deleteBankById);

// =================== bank branches ======================
router.get('/allBranches', (req, res) => {
    console.log("==================== get allBranches =====================")
    var sql = "select * from `bank_branch_master` "; // where status = 'Active'
    DbConnection.query(sql, (err, result) => {
        if(err){
            console.log('Something went wrong \n Error :'+ JSON.stringify(err,undefined,2))
            res.send('Something went wrong \n Error :'+ JSON.stringify(err,undefined,2));
        }
        
        else{
        //     const getCategories = result;  
            console.log(result)
            if(req.session.userName){
                console.log("req.session.userName :- "+ req.session.userName)
                var userName = req.session.userName;
                var userEmail = req.session.Email;
                var userImage = req.session.Image;
                var userType = req.session.userType;
                res.render('allBranches', { branches : result , title: 'ValDesk - All Branch',userName, userEmail, userImage, userType , message : flash('success','error') } );
            }
            else{
                req.flash('error','Session expired')
                return res.redirect('/');
            }

            
        }
      

    });
    
});
router.get('/getBranchName/:bank_code/:city_code',bankDetailsController().branchNameByBankCode)
router.get('/addBranch',bankDetailsController().branch);
router.post('/addBranch',bankDetailsController().addBranch);
router.get('/deleteBranchById/:branch_id',bankDetailsController().deleteBranchById);

// =================== banks ======================
router.get('/allBranchManagers', (req, res) => {
    console.log("==================== get allBranchManagers =====================")
    var sql = "select * from `bank_manager_master` "; // where status = 'Active'
    DbConnection.query(sql, (err, result) => {
        if(err){
            console.log('Something went wrong \n Error :'+ JSON.stringify(err,undefined,2))
            res.send('Something went wrong \n Error :'+ JSON.stringify(err,undefined,2));
        }
        
        else{
        //     const getCategories = result;  
            console.log(result)
            if(req.session.userName){
                console.log("req.session.userName :- "+ req.session.userName)
                var userName = req.session.userName;
                var userEmail = req.session.Email;
                var userImage = req.session.Image;
                var userType = req.session.userType;
                res.render('allBankManager', { managers : result , title: 'ValDesk - All Managers',userName, userEmail, userImage, userType , message : flash('success','error') } );
            }
            else{
                req.flash('error','Session expired')
                return res.redirect('/');
            }

            
        }
      

    });
    
});
router.get('/addBranchManager',bankDetailsController().branchManager);
router.post('/addBranchManager',bankDetailsController().addBranchManager);
router.get('/deleteBranchManagerById/:branch_mnanager_id',bankDetailsController().deleteBranchManagerById);



// ==================== leads ====================
router.get('/allLeads', (req, res) => {
    console.log("==================== get allLeads =====================")
    var sql = "select * from `bank_lead_master` "; // where status = 'Active'
    DbConnection.query(sql, (err, result) => {
        if(err){
            console.log('Something went wrong \n Error :'+ JSON.stringify(err,undefined,2))
            res.send('Something went wrong \n Error :'+ JSON.stringify(err,undefined,2));
        }
        
        else{
        //     const getCategories = result;  
            console.log(result)
            if(req.session.userName){
                console.log("req.session.userName :- "+ req.session.userName)
                var userName = req.session.userName;
                var userEmail = req.session.Email;
                var userImage = req.session.Image;
                var userType = req.session.userType;
                var userId = req.session.userId;
                console.log("userId :-"+userId)
                res.render('allLeads', { leads : result , title: 'ValDesk - All Leads',serverUrl,userId,userName, userEmail, userImage, userType , message : flash('success','error') } );
            }
            else{
                req.flash('error','Session expired')
                return res.redirect('/');
            }

            
        }
      

    });
    
});
router.get('/addLead',bankLeadsController().index);
router.post('/addLead',bankLeadsController().addBankLead);
router.get('/getBankNameByBankCode/:bank_code',bankLeadsController().bankNameByBankCode);
router.get('/getBranchDetailsByBranchNameOrCityCode/:branchName/:cityCode',bankLeadsController().branchDetail);
// router.get('/myLeads_notUse/:userId',bankLeadsController().bankLeadsById);

// ========not working================
router.get('/myLeads_notWork/:userId', (req, res) => {
    console.log("=========== web bankLeadsController bankLeadsById ================")
    console.log("userId :- "+req.params.userId) 
    var userId = req.params.userId;
    var sql = "select * from `bank_lead_master` where surveyor_id = ? "; // where status = 'Active'
    DbConnection.query(sql,userId, (err, result) => {
        if(err){
            console.log('Something went wrong \n Error :'+ JSON.stringify(err,undefined,2))
            // res.send('Something went wrong \n Error :'+ JSON.stringify(err,undefined,2));
            req.flash('error',JSON.stringify(err,undefined,2))
            return res.redirect('/home');
        }                
        else{
            //     const getCategories = result;  
            // console.log(result)
            if(req.session.userName){
                console.log("req.session.userName :- "+ req.session.userName)
                var userName = req.session.userName;
                var userEmail = req.session.Email;
                var userImage = req.session.Image;
                var userType = req.session.userType;
                var userId = req.session.userId;
                console.log("userId :-"+userId)
                console.log("userType :-"+userType);

                // var resultBorrower = [];
                //console.log("borrower_id :-"+result[0].borrower_id);

                // lead_borrower_sql = 'SELECT * FROM `bank_lead_master` inner join client_master on bank_lead_master.borrower_id = client_master.client_id WHERE surveyor_id=9';

                // lead_borrower_editor_sql = 'SELECT * FROM `bank_lead_master` inner join client_master on bank_lead_master.borrower_id = client_master.client_id inner join user_masters on bank_lead_master.editor_id = user_masters.user_id WHERE surveyor_id=9'

                for(i=0; i < result.length; i++){
                   console.log("borrower_id :-"+result[i].borrower_id)
                   console.log("editor_id :-"+result[i].editor_id)
                   var sqlBorrower = "select * from `client_master` where client_id = ? ";
                   var sqlEditor = "select * from `user_masters` where user_id = ? ";
                   DbConnection.query(sqlBorrower,result[i].borrower_id, (err, borrowerResult) => {
                        if(err){
                            console.log('Something went wrong \n Error :'+ JSON.stringify(err,undefined,2))
                            // res.send('Something went wrong \n Error :'+ JSON.stringify(err,undefined,2));
                            req.flash('error',JSON.stringify(err,undefined,2))
                            return res.redirect('/home');
                        }else{
                            console.log("========= borrowerResult ========")
                            console.log(borrowerResult);
                            resultBorrower.append(borrowerResult);
                            resultBorrower = borrowerResult;
                            console.log(resultBorrower)
                            if(borrowerResult.length>0){
                                for(j=0; j<result.length; j++){
                                    console.log("editor_id :-"+result[j].editor_id)
                                    var sqlEditor = "select * from `user_masters` where user_id = ? ";
                                    DbConnection.query(sqlEditor,result[j].editor_id, (err, editorResult) => {
                                        if(err){
                                            console.log('Something went wrong \n Error :'+ JSON.stringify(err,undefined,2))
                                                // res.send('Something went wrong \n Error :'+ JSON.stringify(err,undefined,2));
                                                req.flash('error',JSON.stringify(err,undefined,2))
                                                return res.redirect('/home');
                                        }else{
                                            console.log("====== editorResult ========")
                                            // console.log(editorResult)
                                            res.render('surveyorLeads',{ leads : result ,borrowers : borrowerResult , editors : editorResult, title: 'ValDesk - My Leads',userName, userEmail, userImage, userType,serverUrl, userId, message : flash('success','error') } ); 
                                        }
                                    })
                                }
                            }
                        } 
                    })
                }
                // console.log(resultBorrower);
                // if(userType == 'Surveyor'){
                //     res.render('surveyorLeads',{ leads : result  , title: 'ValDesk - My Leads',userName, userEmail, userImage, userType , userId, message : flash('success','error') } ); 
                // }
                // res.render('allLeads',{ leads : result  , title: 'ValDesk - My Leads',userName, userEmail, userImage, userType , userId, message : flash('success','error') } );
            }
            else{
                req.flash('error','Session expired')
                return res.redirect('/');
            }
        }
    });
    
});

// ======working============
router.get('/myLeads/:userId', (req, res) => {
    console.log("=========== web bankLeadsController bankLeadsById ================")
    console.log("userId :- "+req.params.userId) 
    var userId = req.params.userId;
    var sql = "SELECT * FROM `bank_lead_master` inner join client_master on bank_lead_master.borrower_id = client_master.client_id inner join bank_branch_master on bank_lead_master.bank_code = bank_branch_master.bank_code inner join user_masters on bank_lead_master.editor_id = user_masters.user_id WHERE surveyor_id = ? AND bank_lead_master.lead_status != 'Delivered'  "; // where status = 'Active'
    DbConnection.query(sql,userId, (err, result) => {
        if(err){
            console.log('Something went wrong \n Error :'+ JSON.stringify(err,undefined,2))
            // res.send('Something went wrong \n Error :'+ JSON.stringify(err,undefined,2));
            req.flash('error',JSON.stringify(err,undefined,2))
            return res.redirect('/home');
        }                
        else{
            //     const getCategories = result;  
            console.log(result)
            if(req.session.userName){
                console.log("req.session.userName :- "+ req.session.userName)
                var userName = req.session.userName;
                var userEmail = req.session.Email;
                var userImage = req.session.Image;
                var userType = req.session.userType;
                var userId = req.session.userId;
                console.log("userId :-"+userId)
                console.log("userType :-"+userType);

                // var resultBorrower = [];
                //console.log("borrower_id :-"+result[0].borrower_id);

                // lead_borrower_sql = 'SELECT * FROM `bank_lead_master` inner join client_master on bank_lead_master.borrower_id = client_master.client_id WHERE surveyor_id=9';

                // lead_borrower_editor_sql = 'SELECT * FROM `bank_lead_master` inner join client_master on bank_lead_master.borrower_id = client_master.client_id inner join user_masters on bank_lead_master.editor_id = user_masters.user_id WHERE surveyor_id=9'
                
                res.render('surveyorLeads',{ leads : result , title: 'ValDesk - My Leads',userName, userEmail, userImage, userType,serverUrl, userId, message : flash('success','error') } ); 
               
            }
            else{
                req.flash('error','Session expired')
                return res.redirect('/');
            }
        }
    });
    
});
router.get('/getDocumentsById/:leadId',bankLeadsController().documentsById);
router.get('/getDocumentsByDocId/:docId',bankLeadsController().documentsByDocId);

router.get('/getMyLeadsLengthByUserId/:userId', (req, res) => {
    console.log("=========== web bankLeadsController getMyLeadsLengthByUserId ================")
    console.log("userId :- "+req.params.userId) 
    var userId = req.params.userId;
    var sql = "select * from `bank_lead_master` where surveyor_id = ? "; // where status = 'Active'
    DbConnection.query(sql,userId, (err, result) => {
        if(err){
            console.log('Something went wrong \n Error :'+ JSON.stringify(err,undefined,2))
            res.json({
                status : 'error',
                message : 'Something went wrong \n Error :'+ JSON.stringify(err,undefined,2)
            })
        }                
        else{
            console.log(result)
            res.json({
                status: 'success',
                myLead_length : result.length
            })
        }
    });
    
});


router.get('/leadReports/:userId', (req, res) => {
    console.log("=========== web bankLeadsController leadReportsByUserId ================")
    console.log("userId :- "+req.params.userId) 
    var userId = req.params.userId;
    var sql = "select * from `bank_lead_master` where editor_id = ? "; // where status = 'Active'
    DbConnection.query(sql,userId, (err, result) => {
        if(err){
            console.log('Something went wrong \n Error :'+ JSON.stringify(err,undefined,2))
            res.send('Something went wrong \n Error :'+ JSON.stringify(err,undefined,2));
        }                
        else{
            //     const getCategories = result;  
            console.log(result)
            if(req.session.userName){
                console.log("req.session.userName :- "+ req.session.userName)
                var userName = req.session.userName;
                var userEmail = req.session.Email;
                var userImage = req.session.Image;
                var userType = req.session.userType;
                var userId = req.session.userId;
                console.log("userId :-"+userId)
                res.render('allLeads',{ leads : result  , title: 'ValDesk - Lead Reports',userName, userEmail, userImage, userType , userId, serverUrl, message : flash('success','error') } );
            }
            else{
                req.flash('error','Session expired')
                return res.redirect('/');
            }
        }
    });
    
});

router.get('/getLeadReportsLengthByUserId/:userId', (req, res) => {
    console.log("=========== web bankLeadsController getLeadReportsLengthByUserId ================")
    console.log("userId :- "+req.params.userId) 
    var userId = req.params.userId;
    var sql = "select * from `bank_lead_master` where editor_id = ? "; // where status = 'Active'
    DbConnection.query(sql,userId, (err, result) => {
        if(err){
            console.log('Something went wrong \n Error :'+ JSON.stringify(err,undefined,2))
            res.json({
                status : 'error',
                message : 'Something went wrong \n Error :'+ JSON.stringify(err,undefined,2)
            })
        }                
        else{
            console.log(result)
            var leadReport = result.length
            console.log(leadReport)
            res.json({
                status: 'success',
                leadReport_length : leadReport
            })
        }
    });
    
});

// ====== upload lead documents =======
router.post('/uploadLeadDocuments',bankLeadsController().uploadLeadDoc)

// =============== client moduile ================
router.get('/allClients',clientController().index);
router.post('/addClient',clientController().postClient);
router.get('/getClientDetailById/:clientId',clientController().clientDetailById);

// ============== survey module ===================
router.get('/getSurveyDetails',surveyController().index);
router.get('/getSurveyorDetailById/:surveyId',surveyController().surveyorById);
// ============= editor module ===================
router.get('/allEditors',surveyController().getEditors);
router.get('/getEditorDetailById/:editor_Id',surveyController().editorById);

// ============ addSurvey ================
router.post("/fillSurvey",surveyController().saveSurvey)

// ==================== logout ====================
router.get('/logout', (req, res, next) => {
    console.log("============== logout ===================")
    req.session.destroy( (err) => {
        if(err){
            req.flash('error', err)
            return res.redirect('/');
        }else{
            return res.redirect('/');
        }
    })
})

module.exports = router;

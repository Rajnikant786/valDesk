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

function employeeDetailsController(){
    return{
        async index(req, res, next){
            console.log("=========== web employeeDetailsController index get ================")       
        },        
        async addEmployeeAdmin(req, res, next){
            console.log("=========== web employeeDetailsController addEmployee get ================")  
            if(req.session.userName){
                console.log("req.session.userName :- "+ req.session.userName)
                var userName = req.session.userName;
                var userEmail = req.session.Email;
                var userImage = req.session.Image;
                var userType = req.session.userType;
                res.render('addEmployee', {  title: 'ValDesk - Add Employee Admin only',userName, userEmail, userImage ,userType, message : flash('success','error') } );
            }
            else{
                req.flash('error','Session expired')
                return res.redirect('/');
            }     
        },

        async addEmployee(req, res, next){
            console.log("=========== web employeeDetailsController addEmployee post ================") 

           

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
                destination: './public/uploadProfileImage/',
                filename: (req, file, cb) => {
                    // cb(null,file.fieldname + '-' + Date.now()+path.extname(file.originalname))
                    cb(null,req.body.username+'_'+todayDate+'_'+file.originalname) //${file.originalname}
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
            }).single('profileImage');

            
            upload(req, res, (err) => {
                if(err){
                    console.log("error\n")
                    console.log(err)
                    req.flash('error',JSON.stringify(err,undefined,2))
                    return res.redirect('/addEmployee')
                }else{
                    /*console.log("file")
                    console.log(req.file);
                    console.log("filename :- "+req.file.filename)*/

                    console.log(req.body)

                    // {
                    //     fieldname: 'profileImage',
                    //     originalname: 'certificate_alumni.png',
                    //     encoding: '7bit',
                    //     mimetype: 'image/png',
                    //     destination: './public/uploadProfileImage/',
                    //     filename: 'rahul_2021-12-29_certificate_alumni.png',
                    //     path: 'public\\uploadProfileImage\\rahul_2021-12-29_certificate_alumni.png',
                    //     size: 2269
                    //   }
                    //   filename :- rahul_2021-12-29_certificate_alumni.png
                    //   [Object: null prototype] {
                    //     emp_id: '1543',
                    //     username: 'rahul',
                    //     first_name: 'rahul',
                    //     last_name: 'kumar',
                    //     father_name: 'rajnikant',
                    //     DOB: '2021-12-08',
                    //     email: 'rahul@gmail.com',
                    //     password: 'rahul123',
                    //     contact_1: '1234567890',
                    //     contact_2: '1234567895',
                    //     address_HN: 'address hn',
                    //     address_street: 'address street',
                    //     address_city: 'address city',
                    //     ref_1: 'ref 1',
                    //     ref_2: 'ref 2',
                    //     ref_3: 'ref 3',
                    //     ref_1_detail: 'ref 1 details',
                    //     ref_2_detail: 'ref 2 details',
                    //     ref_3_detail: 'ref 3 details',
                    //     bank_name: 'bank name',
                    //     bank_account: 'bank account',
                    //     ID_number: 'id number',
                    //     ID_type: 'id type',
                    //     userType: 'Admin',
                    //     status: 'Active'
                    //   }
                    //   u_Password :-rahul123
                    //   $2b$10$EBp26cI798jySwyPZblbQ.VVVEUSlBDl95paHe.gAtDtvziBoavVi

                    var empId = req.body.emp_id;
                    var u_Username = req.body.username;
                    var firstName = req.body.first_name;
                    var lastName = req.body.last_name;
                    var fatherName = req.body.father_name;
                    var DOB = req.body.DOB;
                    var u_Email = req.body.email;

                    var u_Password = req.body.password;
                    console.log("u_Password :-"+u_Password)
                    // Hash password (if we use hash a password then we install first bcrypt)
                    const hashedPassword = bcrypt.hashSync(u_Password,10);
                    console.log(hashedPassword);

                    var contact1 = req.body.contact_1;
                    var contact2 = req.body.contact_2;

                    if(req.file){
                        var u_Image = req.file.filename;
                    }else{
                        var u_Image = 'guest_male.jpg';
                    }
                    
                    var addressHn = req.body.address_HN;
                    var addressStreet = req.body.address_street;
                    var addressCity = req.body.address_city;
                    var ref1 = req.body.ref_1;
                    var ref2 = req.body.ref_2;
                    var ref3 = req.body.ref_3;
                    var refDetail1 = req.body.ref_1_detail;
                    var refDetail2 = req.body.ref_2_detail;
                    var refDetail3 = req.body.ref_3_detail;
                    var bankName = req.body.bank_name;
                    var bankAccount = req.body.bank_account;
                    var IdNumber = req.body.ID_number;
                    var IdType = req.body.ID_type;
                    var u_UserType = req.body.userType;
                    var u_status = req.body.status  ;
                    var createBy = req.body.create_by;                 
                    
                    var sql = 'SELECT * FROM user_masters WHERE emp_id=?;'
        
                    DbConnection.query(sql,empId, (err,result) => {
                         if(err){
                            //  res.send(err)
                            // res.end("Database connection error")
                            throw err;
                         }else{
                             if(result.length > 0){
                                // res.send(result);
                                console.log(result);
                                // res.end("This Employee Id is already registered")
                                req.flash('error',"This Employee Id is already registered");
                                return res.redirect('/addEmployee');
                             }else{
                                console.log(result);
                                
                                var data = {
                                    emp_id: empId,
                                    username: u_Username,
                                    first_name: firstName,
                                    last_name: lastName,
                                    father_name: fatherName,
                                    DOB: DOB,
                                    email: u_Email,
                                    password: hashedPassword,
                                    contact_1: contact1,
                                    contact_2: contact2,
                                    image: u_Image,
                                    address_HN: addressHn,
                                    address_street: addressStreet,
                                    address_city: addressCity,
                                    ref_1: ref1,
                                    ref_2: ref2,
                                    ref_3: ref3,
                                    ref_1_detail: refDetail1,
                                    ref_2_detail: refDetail2,
                                    ref_3_detail: refDetail3,
                                    bank_name: bankName,
                                    bank_account: bankAccount,
                                    ID_number: IdNumber,
                                    ID_type: IdType,
                                    userType: u_UserType,
                                    status: u_status,
                                    create_by: createBy
                                };
            
                                console.log(data)
        
                                var insertSql = "INSERT INTO `user_masters` set ?";
                                DbConnection.query(insertSql,data,(err,result) => {
                                    if(err){
                                        // console.log(err)
                                        // res.end('Something went wrong \n Error :'+ JSON.stringify(err,undefined,2))
                                        req.flash('error',JSON.stringify(err,undefined,2))
                                        return res.redirect('/addEmployee');
                                    }else{
                                        // console.log(result);
                                        // console.log("Employee added successfully...")
                                        req.flash('success','Employee added successfully...')
                                        return res.redirect('/allEmployees');
                                    }
                                    
                                })
                                
                             }
                         }
                         
                    });

                }
            }); 
        },


        async PostRegister(req , res , next){

            console.log("===================== AuthController PostRegister =======================")
            
            // var input =JSON.parse(JSON.stringify(req.body));

            console.log(req.body)

            // console.log(req.File)

             // ============upload file============

            var date =new Date();
            var currentDate = date.getDate();
            // var m = [01,02,03,04,05,06,07,08,09,10,11,12]
            // var month = m[date.getMonth()];
            var month = date.getMonth() + 1;
            var month1 = month < 10 ? '0' + month : '' + month; // ('' + month) for string result

            var year = date.getFullYear();
            this.todayDate =year+"-"+month1+"-"+currentDate
            console.log("todayDate :- "+this.todayDate)

            const Storage = multer.diskStorage({
                destination: './public/uploadProfileImage/',
                filename: (req, file, cb) => {
                    // cb(null,file.fieldname + '-' + Date.now()+path.extname(file.originalname))
                    // cb(null,req.body.username+'_'+todayDate+'_'+file.originalname)
                    cb(null,req.body.username+'_'+todayDate+'_'+file.originalname) //${file.originalname}
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
            }).single('profileImage');

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
                    console.log("file")
                    // console.log(req.file);
                    // console.log("filename :- "+req.file.filename)
                    console.log(req.body)


                    var Username = req.body.username;
                    var Email = req.body.email;
                    var UserType = req.body.userType;
                    var status = req.body.Status
                    var Password = req.body.password;

                    if(req.file){
                      var Image = req.file.filename;
                    }else{
                        var  Image = "guest.svg";
                    }
                    // var Image = req.body.profileImage;
                    // var Address = req.body.address;
                    var mobileNo = req.body.mobile;

                    console.log("mobileNo :-"+mobileNo)
        
                    // Hash password (if we use hash a password then we install first bcrypt)
                    const hashedPassword = bcrypt.hashSync(Password,10)
                    // console.log(hashedPassword)
                    
                    // console.log(input)
                    
                    var sql = 'SELECT * FROM user_masters WHERE email=?;'
        
                    DbConnection.query(sql,Email, (err,result) => {
                         if(err){
                            //  res.send(err)
                            // res.end("Database connection error")
                            throw err;
                         }else{
                             if(result.length > 0){
                                // res.send(result);
                                console.log(result);
                                res.end("This email id is already registered")
                             }else{
                                console.log(result);
                                
                                var data = {
                                    username : Username,
                                    email : Email,
                                    password : hashedPassword,
                                    image : Image,
                                    mobile : mobileNo,
                                    userType : UserType,
                                    Status: status
                                }
        
                                console.log(data)
        
                                // ============jwt========
                                const token = jwt.sign(data,process.env.JWT_ACC_ACTIVATE,{expiresIn:'20m'})
                                // confirm.log(token)
                                // ============email verification============

                                var transporter = nodemailer.createTransport({
                                    // service: 'gmail',
                                    host: 'smtp.gmail.com',
                                    port: 587,
                                    secure: false,
                                    requireTLS: true,
                                    auth: {
                                      user: process.env.STORE_EMAIL,
                                      pass: process.env.STORE_EMAIL_PASSWORD
                                    }
                                });
                
                                
                                // <p style="margin-bottom: 2rem; font-weight:400; color: #666 ; font-size: 12px"> Pay with cash upon delivery.</p>
                                var mailOptions = {
                                                from: process.env.STORE_EMAIL,
                                                to: Email,
                                                // to: 'rajnikantkumar78654@gmail.com',
                                                subject: 'AytStore - Account Activation Link',
                                                html: `<h3 style="margin-bottom: 1rem;"> Dear <span style="font-weight:400; text-transform:capitalize"><b>`+Username+`</b></span></h3>, 
                                                    <p style="margin-bottom: 1rem; font-weight:400; color: #666; font-size: 16px">Thank you for registering at <b>Ayt Store</b></p>
                                                    <div style="border: 2px solid #69bb7b; margin: 0.5rem 0rem; padding: 5px; background-color: #D5F5E3">
                                                        <div style="padding: 20px 5px; border-radius: 10px; background-color: #fff">
                                                            <table width="100%" style="margin-top: 1rem">
                                                                <tr>
                                                                    <td style="text-align: left">
                                                                    <div><span style="padding: 15px 15px; margin-right: 5px; background-color: #000; color: #fff">Ayt</span> <span style="color: #69bb7b">Store</span></div>
                                                                    </td>
                                                                    <td style="text-align: right">
                                                                        <span style="color:#B3B6B7; font-size: 12px"><b>`+todayDate+`</b></span>
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                        <div style="background-color:#ECF0F1; margin-top: 2rem; padding: 20px 10px; border-radius: 8px">
                                                            <P style="font-weight:400; color: #666 ; font-size: 16px">Confirm your email address to complete your account set-up. It's easey. Just click the link below -</p>

                                                            <a href="${process.env.CLIENT_URL}/email-activation/${token}">${process.env.CLIENT_URL}/email-activation/${token}</a>

                                                            <br><br>

                                                            <a href="${process.env.CLIENT_URL}/email-activation?token=${token}">${process.env.CLIENT_URL}/email-activation?token=${token}</a>

                                                        </div>
                
                                                        <br><br>
                
                                                        <hr width="50%" style="margin: 0.5rem auto 1rem auto 0.5rem auto">
                
                                                        <footer style="padding: 15px 5px 0px 5px">
                                                            <p style="text-align:center; font-size: 12px; margin-bottom: 0px;">
                                                                Powered By <a href="https://www.abhiyantrikitech.com">Abhiyantriki Technology Private Limited</a>
                                                            </p>
                                                        </footer>
                
                                                        </div>  
                                                    </div>`
                                }
                
                                transporter.sendMail(mailOptions, (err, info) => {
                                    if(err){
                                        console.log(err);
                                        // res.end(error)
                                        return res.json({
                                            status: 'Error',
                                            message: err.message
                                        })
                                    }else{
                                        console.log('Email sent : '+ info.response)
                                        // res.end("Registration successfully | Email sent : " + info.response)
                                        return res.json({
                                            status: 'Success',
                                            message: 'Email has been sent, kindly activate your account'
                                        })
                                    }
                                })

                                // var insertSql = "INSERT INTO user_masters(username,email,password,userType,Status) values(?,?,?,?,?)";
        
                                // var insertSql = "INSERT INTO user_masters set ?";
                                // DbConnection.query(insertSql,data, (err,result) => {
                                //     if(err){
                                //         console.log(err)
                                //         res.end('Something went wrong \n Error :'+ JSON.stringify(err,undefined,2))
                                //         // res.end("This email id is already registered")
                                //     }else{
                                //         // console.log(result);
                                //          // res.json({
                                //          //    message: "success",
                                //          //    data: rows
                                //          // });
                                //         console.log("Registration successfully...")
                                //         res.end("Registration successfully...")
                                //     }
                                    
                                // })
                                
                             }
                         }
                         
                    });

                }
            });        

        },

        async activateAccount(req, res){
            console.log("===================== AuthController activateAccount =======================")
            // console.log(req.body)
            const token_new = req.params.token
            // console.log(token_new)
            // const {token} = req.body;
            // console.log(token)
            // const {token_new} = req.body;
            if(token_new){
                jwt.verify(token_new, process.env.JWT_ACC_ACTIVATE, (err,decodedToken) => {
                    if(err){
                        return res.status(400).json({
                            status: 'Error',
                            message: 'Incorrect or Expired link.\n'+err
                        })
                    }else{
                        console.log("======= decodedToken =======")
                        const data = decodedToken
                        console.log(data)

                        console.log(data.username)

                        var Username = data.username;
                        var Email = data.email;
                        var UserType = data.userType;
                        var status = data.Status
                        var Password = data.password;
                        var Image = data.image;
                        var mobileNo = data.mobile;

                        var sql = 'SELECT * FROM user_masters WHERE email=?;'        
                        DbConnection.query(sql,Email, (err,result) => {
                            if(err){
                                //  res.send(err)
                                // res.end("Database connection error")
                                throw err;
                            }else{
                                if(result.length > 0){
                                    // res.send(result);
                                    console.log(result);
                                    // res.end("This email id is already registered")
                                    return res.json({
                                        status: 'Error',
                                        message: 'This token is already used.'
                                    })
                                }else{
                                    console.log(result);

                                    var userdata = {
                                        username : Username,
                                        email : Email,
                                        password : Password,
                                        image : Image,
                                        mobile : mobileNo,
                                        userType : UserType,
                                        Status: status
                                    }
            
                                // var insertSql = "INSERT INTO user_masters(username,email,password,userType,Status) values(?,?,?,?,?)";
                    
                                    var insertSql = "INSERT INTO user_masters set ?";
                                    DbConnection.query(insertSql,userdata, (err,result1) => {
                                        if(err){
                                            console.log(err)
                                            res.end('Something went wrong \n Error :'+ JSON.stringify(err,undefined,2))
                                            // res.end("This email id is already registered")
                                        }else{
                                            // console.log(result1);
                                            console.log("Registration successfully...")
                                            // res.end("Registration successfully...")
                                            return res.json({
                                                status: 'Success',
                                                message: 'Registration successfully...'
                                            })
                                        }                                    
                                    })    
                                }
                            }
                        });

                         
                    }
                })
            }else{
                return res.json({
                    status: 'Error',
                    message: 'Something went wrong!!!'
                })
            }
        },

        // async userAddress(req, res, next){
        //     console.log("=========== web userDetailsController userAddress get ================")
        //     // ========getCategory=========
        //     var sql = "select * from `user_address_masters` "; // where status = 'Active'
        //     DbConnection.query(sql, (err, result) => {
        //         if(err){
        //             console.log('Something went wrong \n Error :'+ JSON.stringify(err,undefined,2))
        //             res.send('Something went wrong \n Error :'+ JSON.stringify(err,undefined,2));
        //         }
                
        //         else{
        //         //     const getCategories = result;  
        //             console.log(result)
        //             if(req.session.userName){
        //                 console.log("req.session.userName :- "+ req.session.userName)
        //                 var userName = req.session.userName;
        //                 var userEmail = req.session.Email;
        //                 var userImage = req.session.Image;
        //                 // var userType = req.session.userType;
        //                 res.render('userAddressList', { addressMaster : result , title: 'ValDesk Employee Address',userName, userEmail, userImage } );
        //             }
        //             else{
        //                 req.flash('error','Session expired')
        //                 return res.redirect('/');
        //             }

                    
        //         }
            

        //     });

            
        // }
        
    }
}
module.exports = employeeDetailsController
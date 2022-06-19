var express = require('express');
var router = express.Router();
var DbConnection = require('../../config/DbConnection')
const bcrypt = require ('bcrypt')
const passport = require('passport')
const flash = require('express-flash');
const jwt = require('jsonwebtoken');
// ===== session config =========
var session = require('express-session');

function authController(){
    return{
        async postLogin(req, res, next){
            console.log("=========== authController postLogin ================")
            console.log(req.body)

            var Email = req.body.email;
            var password = req.body.password;

            var sql = "SELECT * FROM user_masters WHERE email=?";

            DbConnection.query(sql,Email, (err,result) => {
                if(err){
                    // res.end("Something went wrong...")
                    // res.send('Something went wrong \n Error :'+ JSON.stringify(err,undefined,2))
                    console.log(err);
                    req.flash('error','Something went wrong \n Error :'+ JSON.stringify(err,undefined,2));
                    // throw err;
                }else{

                    
                    // && bcrypt.compareSync(password, result[0].password
                    if(result.length > 0 ){
                        console.log("userPassword :- "+password)
                        var bcryptPassword = bcrypt.compareSync(password, result[0].password);
                        console.log("bcryptPassword:- "+bcryptPassword);
                        // console.log("password :- "+password +'\n'+ "Registered password :- "+result[0].password)
                        if(bcryptPassword == true){ //true , false
                            console.log("password matched...")
                            console.log(result[0]);
                            // console.log(result[0].user_id);
                            // var user_id = result[0].user_id;
             
                                // res.json({
                                //     success: "login success",
                                //     // user_id: user_id,
                                //     user: result[0]
                                // });
                                
                                // req.session.userDetails = [result[0]];

                                // =======generate token=======
                                var getUserId = result[0].user_id;
                                var token = jwt.sign({userId : getUserId}, 'loginToken');
                                console.log("token :- "+token)
                                // ============================
                                
                                var userType = result[0].userType;
                                console.log("userType :-"+ userType)
                                // if(userType == "Admin"){
                                //     console.log("======admin login======")
                                    req.session.userId = result[0].user_id
                                    req.session.userName=result[0].username
                                    req.session.Email = result[0].email
                                    req.session.Image = result[0].image
                                    req.session.userType = result[0].userType
                                    res.redirect('/home')
                                // }else{
                                //     req.flash('error','This user not be a admin')
                                //     return res.redirect('/');
                                // }
                               

                            // res.json(user_id);    
                           
                        }
                        else{
                            console.log("Invalid password");
                            // res.end("Invalid password");
                            // res.json({ error : "Invalid password"});
                            req.flash('email', Email)
                            req.flash('error','Invalid password')
                            return res.redirect('/');
                        }
                    }else{
                        console.log(result);
                        console.log("Invalid email or password")
                        // res.end("Invalid email")
                        // res.json({ error : "Invalid email or password"});
                        req.flash('email', Email)
                        req.flash('password', password)
                        req.flash('error','Invalid email or password');
                        return res.redirect('/');
                        // res.render('auth/login')
                        // res.redirect('ayt', { title: 'AytStore Login'})
                        
                    }
                }
            })

            // var TotalProductCount = '';
            // var TotalCategoryCount = '';
            // res.render('admin/dashboard', { title: 'AytStore Dashboard' , TotalProductCount, TotalCategoryCount })
            
            
        },
        upload(req,res){
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
        }
    }
}

module.exports = authController
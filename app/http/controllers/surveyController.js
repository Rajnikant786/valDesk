var express = require('express');
var router = express.Router();
var DbConnection = require('../../config/DbConnection')
const flash = require('express-flash');
var multer = require('multer');
var path = require('path');
const bcrypt = require('bcrypt')
const passport = require('passport')
const jwt = require('jsonwebtoken');

router.use(express.static(__dirname + "./public/"))

function surveyController() {
    return {
        async index(req, res, next) {
            console.log("=========== web surveyController index - allsurvey get ================")
            var sql = "select * from `user_masters` where userType = 'Surveyor' AND status = 'Active'";
            DbConnection.query(sql, (err, result) => {
                if (err) {
                    console.log('Something went wrong \n Error :' + JSON.stringify(err, undefined, 2))
                    res.json({
                        status: 'error',
                        message: 'Something went wrong \n Error :' + JSON.stringify(err, undefined, 2)
                    });
                }
                else {
                    //     const getCategories = result;  
                    console.log(result)
                    res.json({
                        status: 'success',
                        surveyDetails: result
                    })
                }
            });
        },
        async surveyorById(req, res, next) {
            console.log("=========== web surveyController index - surveyorById get ================")
            surveyorId = req.params.surveyId;
            console.log("surveyorId :-" + surveyorId)
            var sql = "select * from `user_masters` where user_id = ? AND status = 'Active'";
            DbConnection.query(sql, surveyorId, (err, result) => {
                if (err) {
                    console.log('Something went wrong \n Error :' + JSON.stringify(err, undefined, 2))
                    res.json({
                        status: 'error',
                        message: 'Something went wrong \n Error :' + JSON.stringify(err, undefined, 2)
                    });
                }
                else {
                    //     const getCategories = result;  
                    console.log(result)
                    res.json({
                        status: 'success',
                        surveyDetailsById: result[0]
                    })
                }
            });
        },
        async getEditors(req, res, next) {
            console.log("=========== web surveyController getEditors - allEditors get ================")
            var sql = "select * from `user_masters` where userType = 'Report Editor' AND status = 'Active'";
            DbConnection.query(sql, (err, result) => {
                if (err) {
                    console.log('Something went wrong \n Error :' + JSON.stringify(err, undefined, 2))
                    res.json({
                        status: 'error',
                        message: 'Something went wrong \n Error :' + JSON.stringify(err, undefined, 2)
                    });
                }
                else {
                    //     const getCategories = result;  
                    console.log(result)
                    res.json({
                        status: 'success',
                        editorDetails: result
                    })
                }
            });
        },
        async editorById(req, res, next) {
            console.log("=========== web surveyController editorById - get ================")
            editorId = req.params.editor_Id;
            console.log("editorId :-" + editorId)
            var sql = "select * from `user_masters` where user_id = ? AND status = 'Active'";
            DbConnection.query(sql, editorId, (err, result) => {
                if (err) {
                    console.log('Something went wrong \n Error :' + JSON.stringify(err, undefined, 2))
                    res.json({
                        status: 'error',
                        message: 'Something went wrong \n Error :' + JSON.stringify(err, undefined, 2)
                    });
                }
                else {
                    //     const getCategories = result;  
                    console.log(result)
                    res.json({
                        status: 'success',
                        editorDetailsById: result[0]
                    })
                }
            });
        },
        async saveSurvey(req, res) {
            console.log("================== surveyController - saveSurvey ==================")
            console.log(req.body);
            // console.log(req.file)

            var Status = req.body.lead_status;
            var leadId = req.body.lead_id;
            var userId = req.body.user_id;
            console.log("Status :-"+Status)
            console.log("leadId :-"+leadId)

            var insertSql = "INSERT INTO survey_master set ?";
            DbConnection.query(insertSql, req.body, (err, insertResult) => {
                if (err) {
                    // console.log(err)
                    // res.end('Something went wrong \n Error :'+ JSON.stringify(err,undefined,2))
                    // req.flash('error', JSON.stringify(err, undefined, 2))
                    // return res.redirect('/myLeads');
                    res.json({
                        status: 'error',
                        message: 'Something went wrong \n Error :'+ JSON.stringify(err,undefined,2)
                    })
                } else {
                    // console.log(insertResult);
                    // req.flash('success', 'Survey inserted successfully')
                    // return res.redirect('/myLeads');
                    updateStatusSql = "UPDATE `bank_lead_master` SET lead_status = ? WHERE lead_id = ?";
                    DbConnection.query(updateStatusSql, [Status,leadId], (err, updateResult) => {
                        if (err) {
                            console.log(err)
                            // res.end('Something went wrong \n Error :'+ JSON.stringify(err,undefined,2))
                            // req.flash('error', JSON.stringify(err, undefined, 2))
                            // return res.redirect('/myLeads');
                            res.json({
                                status: 'error',
                                message: 'Something went wrong \n Error :'+ JSON.stringify(err,undefined,2)
                            })
                        }else{
                            // console.log(updateResult)
                            // res.json({
                            //     status: 'success',
                            //     message: 'Survey uploaded successfully'
                            // });
                            req.flash('success', 'Survey inserted successfully')
                            return res.redirect('/myLeads/'+userId);
                        }
                    });
                    
                }

            })
        }
    }
}
module.exports = surveyController
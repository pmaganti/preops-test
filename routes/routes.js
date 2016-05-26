var RecordModel = require("../models/recordmodel"), request = require('request').defaults({json : true})
    , httpProxy = require('http-proxy');
var config = require("../config");
var querystring = require('querystring');
var request = require('request');
var url_sync = config.couchbase.url;
var moment = require('moment');
var reports_time = config.couchbase.report_time;
var appRouter = function (app) {


    app.delete("/api/:type/:doc", function (req, res) {
        var doc = req.params.doc;
        var url = 'http://'+url_sync+':4984/' + config.couchbase.bucket + '/'+doc;
        request.delete({
                url : url, headers : {
                    'if-Match' : req.headers['if-match']
                }
            },
            function (err, httpResponse, body) {
                console.log("done", err, body);
                return res.status(200).send(body);
            });

    });

    app.put("/api/:type", function (req, res) {

        console.log("put");
        /*if(!req.body.firstname) {
         return res.status(400).send({"status": "error", "message": "A firstname is required"});
         } else if(!req.body.lastname) {
         return res.status(400).send({"status": "error", "message": "A lastname is required"});
         } else if(!req.body.email) {
         return res.status(400).send({"status": "error", "message": "A email is required"});
         }*/

        var data = querystring.stringify(req.body);
        console.log(data);
        var type = req.params.type;
        console.log(type);
        if(type == undefined){
           return res.status(400).send({"status": "error", "message": "Type is required"});
        }

        var dataExistsQuery;
        if(type == 'user'){
            if(!req.body.firstname) {
                return res.status(400).send({"status": "error", "message": "A firstname is required"});
            } else if(!req.body.lastname) {
                return res.status(400).send({"status": "error", "message": "A lastname is required"});
            } else if(!req.body.employeeID) {
                return res.status(400).send({"status": "error", "message": "A employeeID is required"});
            }

            dataExistsQuery = {employeeID:req.body.employeeID, type : type};
            //
        }else if(type == 'material_destination_relation'){
            dataExistsQuery = {m_d_relation : req.body.m_d_relation};
        }else if(type == 'trucktransaction' || type == 'loadertransaction'){
            dataExistsQuery = {};
        }else{
            if(!req.body.title) {
                return res.status(400).send({"status": "error", "message": "Title is required"});
            }
            dataExistsQuery = {title:req.body.title, type : type};
        }

        if(type == 'loader' || type == 'truck'){
            req.body.status = "OPERATIONAL";
        }
        RecordModel.getByQuery(dataExistsQuery,function(error, result){
            if (error) {
                return res.status(400).send(error);
            }else{
               if(result.length == 0){
                   var url = 'http://'+url_sync+':4984/' + config.couchbase.bucket+'/';
                   console.log("came here :P");
                   request.post({
                           url : url, body : JSON.stringify(req.body)
                       },
                       function (err, httpResponse, body) {
                           console.log("done", err, body);
                           return res.status(200).send(body);
                       });
               }else{
                   return res.status(400).send({"status": "error", "message": "Document already exists"});
               }
            }
        });

        // req.pipe(request(url)).pipe(res);
        // proxy.web(req, res, { target: url});
        //  req.pipe(request('http://127.0.0.1:3000/test')).pipe(res);
    });

    app.put("/api/:type/:doc", function (req, res) {

        var doc = req.params.doc;
        var data = querystring.stringify(req.body);
        var url = 'http://'+url+':4984/' + config.couchbase.bucket + '/'+doc;
        request.put({
                url : url, body : JSON.stringify(req.body), headers : {
                    'if-Match' : req.headers['if-match']
                }
            },
            function (err, httpResponse, body) {
                console.log("done", err, body);
                return res.status(200).send(body);
            });
    });

    app.get("/api/report/:time", function (req, res) {

        //var type = req.params.type;
      //  var value = req.params.value;
        var time = req.params.time;

        var today = moment().format('YYYY-MM-DD');
        var till = "";
        if(time == 'daily'){
            till = moment().add(-1, 'days').format('YYYY-MM-DD');
        }else if(time == 'weekly'){
            till = moment().add(-1, 'weeks').format('YYYY-MM-DD');
        }else if(time == 'monthly'){
            till = moment().add(-1, 'M').format('YYYY-MM-DD');
        }else if(time == 'all'){
            till = "";
        }

        var dates = {};
        if(till != ""){
            today += reports_time;
            till += reports_time; //Defaulting to 7am of the day.
            dates = {today:today,till:till}
        }else{
            dates = "";
        }
        RecordModel.getReports(dates,function (error, result) {
            if (error) {
                return res.status(400).send(error);
            }
            res.send(result);
        });

    });

    app.get("/api/query", function (req, res) {
        var type = req.params.type;console.log(req.query)
        RecordModel.getByQuery(req.query, function (error, result) {
            if (error) {
                return res.status(400).send(error);
            }
            res.send(result);
        });
    });

    app.get("/api/get/allMD", function (req, res) {
        console.log("test")
        // var type = req.params.type;
        RecordModel.getAllMD(function (error, result) {
            if (error) {
                return res.status(400).send(error);
            }
            res.send(result);
        });
    });

    app.get("/api/:type/:documentID", function (req, res) {
        if (!req.params.documentID) {
            return res.status(400).send({"status" : "error", "message" : "A document id is required"});
        }
        var type = req.params.type;
        RecordModel.getByDocumentId(req.params.documentID, function (error, result) {
            if (error) {
                return res.status(400).send(error);
            }
            res.send(result);
        });
    });


    app.get("/api/:type", function (req, res) {

        var type = req.params.type;
        RecordModel.getAll(type,function (error, result) {
            if (error) {
                return res.status(400).send(error);
            }//console.log(result);
            res.send(result);
        });
    });



};

module.exports = appRouter;

var express = require("express");
var bodyParser = require("body-parser");
var couchbase = require("couchbase");
var path = require("path");
var config = require("./config");
var app = express();
//connect = require('connect');


app.use(bodyParser.json());
//app.use(restreamer());
//app.use(bodyParser.urlencoded({extended: false, type: 'application/x-www-form-urlencoded'}));
app.use('/api/save',bodyParser.urlencoded({ extended: true }));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE");
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, if-Match");
    next();
});

// Global declaration of the Couchbase server and bucket to be used
module.exports.bucket = (new couchbase.Cluster(config.couchbase.server)).openBucket(config.couchbase.bucket);

app.use(express.static(path.join(__dirname, "public")));

// All endpoints to be used in this application
var routes = require("./routes/routes.js")(app);



var server = app.listen(3002, function () {
    console.log("Listening on port %s...", server.address().port);
});

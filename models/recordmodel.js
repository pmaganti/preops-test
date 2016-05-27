var uuid = require("uuid");
var db = require("../app").bucket;
var config = require("../config");
var N1qlQuery = require('couchbase').N1qlQuery;
var moment = require('moment');

function RecordModel() { };

/*
 * Delete a document from Couchbase Server by document id
 */
RecordModel.delete = function(documentId, callback) {
    db.remove(documentId, function(error, result) {
        if(error) {
            callback(error, null);
            return;
        }
        callback(null, {message: "success", data: result});
    });
};

/*
 * Save a document.  If a document id is not provided an insert will happen, otherwise update.  Thus an upsert.
 */
RecordModel.save = function(data, callback) {
    var jsonObject = {
        firstname: data.firstname,
        lastname: data.lastname,
       // email: data.email,
        employeeID : data.email,
        type : 'user'
    }
    // If the document id doesn't exist create a unique id for inserting
    var documentId = data.document_id ? data.document_id : uuid.v4();
    db.upsert(documentId, jsonObject, function(error, result) {
        if(error) {
            callback(error, null);
            return;
        }
        console.log("insert or update");
        console.log(result);
        callback(null, {message: "success", data: result});
    });
}

/*
 * Get a particular document from Couchbase Server using a parameterized N1QL query
 */
RecordModel.getByDocumentId = function(documentId,callback) {

    var statement = "SELECT docs, meta(docs).id AS _id FROM `" + config.couchbase.bucket + "` AS docs "+
                    "WHERE META(docs).id = $1";
    var query = N1qlQuery.fromString(statement);
    db.query(query, [documentId], function(error, result) {
        if(error) {
            return callback(error, null);
        }
        callback(null, result);
    });
};

/*
 * Get all documents with queries given as parameters from Couchbase Server using N1QL.
 * These parameters must be part of model and doesn't covered by id;
 */
RecordModel.getByQuery = function(queryData,callback) {

    if(queryData){
        var req = queryData;
        var counter = 0;
        var query = "";
        var queryVals = [];
        for (var key in req) {
            if (req.hasOwnProperty(key)) {
                if(counter == 0){
                    var dummy = counter+1;
                    query += key+" = $"+dummy
                }else{
                    var dummy = counter+1;
                    query += " and "+key+" = $"+dummy

                }
                var val = req[key];
                queryVals.push(val);
                counter++;
            }
        }
    }
    var statement = "";
    if(query.length>0)
        statement = "SELECT docs, meta(docs).id AS _id FROM `" + config.couchbase.bucket + "` AS docs "+
        "WHERE "+query;
    else
        return callback(null, []);

    var query = N1qlQuery.fromString(statement);console.log(query);
    db.query(query, queryVals, function(error, result) {
        if(error) {
            return callback(error, null);
        }
        var data = result.map(function(obj){
            //===== changed code here =====
            obj.rev = (obj.docs._sync !== undefined) ? obj.docs._sync.rev : '';
            obj.time_saved = (obj.docs._sync !== undefined) ? obj.docs._sync.time_saved : '';

            delete obj.docs._sync;
            return obj;
        });
        callback(null, data);
    });
};
/*
 * Get all documents from Couchbase Server using N1QL
 */
RecordModel.getAll = function(type,callback) {
    var statement = "SELECT docs, meta(docs).id AS _id FROM `" + config.couchbase.bucket + "` AS docs WHERE type ='"+type+"' and meta(docs).id NOT LIKE '_sync:rev%'";
    var query = N1qlQuery.fromString(statement);//.consistency(N1qlQuery.Consistency.REQUEST_PLUS);
   console.log(query)
    db.query(query, function(error, result) {
        if(error) {console.log(error)
            return callback(error, null);
        }

        var null_callback = false;
        var data = result.map(function(obj){
            if(Object.keys(obj).length){
                //===== changed code here ====
                obj.rev = (obj.docs._sync !== undefined) ? obj.docs._sync.rev : '';
                obj.time_saved = (obj.docs._sync !== undefined) ? obj.docs._sync.time_saved : '';

                delete obj.docs._sync;
                return obj;
            }else{
                null_callback = true;
            }
            //return ;
        });
        callback(null, !null_callback?data:[]);
    });
};

/*
 * Get all documents from Couchbase Server using N1QL
 */
RecordModel.getAllMD = function(callback) {
    var statement = "SELECT docs, meta(docs).id AS _id FROM `" + config.couchbase.bucket + "` AS docs WHERE (type='material' OR type='destination')  and meta(docs).id NOT LIKE '_sync:rev%'";
    var query = N1qlQuery.fromString(statement);//.consistency(N1qlQuery.Consistency.REQUEST_PLUS);
    console.log(query)
    db.query(query, function(error, result) {
        if(error) {console.log(error)
            return callback(error, null);
        }

        var null_callback = false;
        var data = {};
        var material = [];
        var destination = [];

        result.forEach(function(obj){
            if(Object.keys(obj).length){
                //===== changed code here ====
                obj.rev = (obj.docs._sync !== undefined) ? obj.docs._sync.rev : '';
                obj.time_saved = (obj.docs._sync !== undefined) ? obj.docs._sync.time_saved : '';

                delete obj.docs._sync;
                if(obj.docs.type == 'material'){
                    material.push(obj);
                }else if(obj.docs.type == 'destination'){
                    destination.push(obj);
                }
            }else{
                null_callback = true;
            }
        });
        data["material"] = material;
        data["destination"] = destination;
        callback(null, !null_callback?data:[]);
    });


};

/*
 * Get all documents from Couchbase Server using N1QL
 */
RecordModel.getReports = function(dates,callback) {
    var today,till;var date_query ="";
    if(dates){
        today = dates.today;
        till = dates.till;
        date_query = " and STR_TO_MILLIS(created) BETWEEN STR_TO_MILLIS('"+till+"') AND STR_TO_MILLIS('"+today+"')";
    }

    var statement = "SELECT docs, meta(docs).id AS _id FROM `" + config.couchbase.bucket + "` AS docs WHERE type='trucktransaction' and state='Dumping' and meta(docs).id NOT LIKE '_sync:rev%'" +
        ""+date_query+" ORDER BY created desc";
    var query = N1qlQuery.fromString(statement);//.consistency(N1qlQuery.Consistency.REQUEST_PLUS);
    console.log(query)
    db.query(query, function (error, result) {
        if (error) {
            console.log(error)
            return callback(error, null);
        }

        var null_callback = false;
        var data = result.map(function(obj){
         if(Object.keys(obj).length){
         //===== changed code here ====
             var report = {};
             report.loader = (obj.docs.loader !== undefined) ? obj.docs.loader.title : '';
             report.truck = (obj.docs.truck !== undefined) ? obj.docs.truck.title : '';
             report.destination = (obj.docs.destination !== undefined) ? obj.docs.destination.title : '';
             report.material = (obj.docs.material !== undefined) ? obj.docs.material.title : '';
             report.heading = (obj.docs.heading !== undefined) ? obj.docs.heading.title : '';
             report.user = (obj.docs.user !== undefined) ? obj.docs.user.firstname+' '+obj.docs.user.lastname : '';
             report.date = (obj.docs.created !== undefined) ? moment(obj.docs.created).format('dddd, MMM Do YYYY h:mm:ssa') : '';


             return {docs:report};
         }else{
             return callback(null,result);
         }
         //return ;
         });
        callback(null, data);
    });
};

RecordModel.getMachineParking = function(callback) {
    var statement = "SELECT docs, meta(docs).id AS _id FROM `" + config.couchbase.bucket + "` AS docs WHERE type ='machine_parking' and meta(docs).id NOT LIKE '_sync:rev%'" +
        "GROUP BY machine._id ORDER BY created desc";
    var query = N1qlQuery.fromString(statement);//.consistency(N1qlQuery.Consistency.REQUEST_PLUS);
    console.log(query)
    db.query(query, function(error, result) {
        if(error) {console.log(error)
            return callback(error, null);
        }

        var null_callback = false;
        var data = result.map(function(obj){
            if(Object.keys(obj).length){
                //===== changed code here ====
                obj.rev = (obj.docs._sync !== undefined) ? obj.docs._sync.rev : '';
                obj.time_saved = (obj.docs._sync !== undefined) ? obj.docs._sync.time_saved : '';
                obj.docs.date = (obj.docs.created !== undefined) ? moment(obj.docs.created).format('dddd, MMM Do YYYY h:mm:ssa') : '';
                delete obj.docs._sync;
                return obj;
            }else{
                null_callback = true;
            }
            //return ;
        });
        callback(null, !null_callback?data:[]);
    });
};

module.exports = RecordModel;

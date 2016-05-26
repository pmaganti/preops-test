/**
 * Created by jgandi on 25/5/16.
 */

angular.module('barrick')
    .factory('httpService',['$http',function($http){
        var url = 'http://'+location.host+'/api/';
        return {
            getAllRequest : function(type){
                return $http({
                    method: 'GET',
                    url: url+type
                });
            },
            addRequest : function(type,data){
                return $http({
                    method: 'PUT',
                    url: url+type,
                    headers: {
                        "Content-Type" : "application/json"
                    },
                    data: data
                });
            },
            editRequest : function(type,metaData){
                return $http({
                    method: 'PUT',
                    url: url+type+'/'+metaData._id,
                    headers: {
                        "Content-Type" : "application/json",
                        "If-Match" : metaData.rev
                    },
                    data: metaData.data
                })
            },
            deleteRequest : function(type,element){
                return $http({
                    method: 'DELETE',
                    url: url+type+'/'+element._id,
                    headers: {
                        "If-Match" : element.rev
                    }
                })
            },
            getDropDownsForMDRelation : function () {
                return $http.get(url+'get/allMD')
                    .then(function (mdDropDowns) {
                        return mdDropDowns.data;
                    })
                    .catch(function (err) {
                        console.log(err);
                    });
            },
            getAllReports : function(interval,type,value){
                return $http({
                    method: 'GET',
                    url: url+'report/'+interval+'/'+type+'/'+value
                });
            }
        }
    }]);
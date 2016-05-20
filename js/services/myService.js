/**
 * Created by jgandi on 20/5/16.
 */

angular.module('barrick')
    .factory('myService',['$http','$uibModal',function($http,$uibModal){
        var url = "";
        return {
            getAllData : function(type){
                return $http({
                    method: 'GET',
                    url: 'http://192.168.3.153:3000/api/'+type
                });
            },
            addFunction : function(elements,index,type){
                var modalInstance = $uibModal.open({
                    templateUrl: 'myModalContent.html',
                    controller: ['$scope', function ($scope) {
                        $scope.modalTitle = (index == -1) ? 'Add '+type : 'Edit '+type;

                        $scope.myelement = {};

                        if(index !== -1){
                            $scope.myelement = {
                                _id: elements[index]._id,
                                rev: elements[index].rev
                            };
                            if(type == "heading"){
                                $scope.myelement.edittitle = elements[index].docs.title;
                                $scope.myelement.editactive = elements[index].docs.active;
                            }else if(type == "user"){
                                    $scope.myelement.editemployeeid = elements[index].docs.employeeID;
                                    $scope.myelement.editfirstname = elements[index].docs.firstname;
                                    $scope.myelement.editlastname = elements[index].docs.lastname;
                            }else{
                                    $scope.myelement._id = elements[index]._id;
                                    $scope.myelement.rev = elements[index].rev;
                                    $scope.myelement.edittitle = (index == -1) ? '' : elements[index].docs.title;
                            }
                        }

                        $scope.ok = function () {
                            var data;
                            if(index == -1) {
                                if(type == "heading"){
                                    data = {
                                        "title" : $scope.myelement.edittitle,
                                        "active" : $scope.myelement.editactive || false,
                                        "type" : type
                                    };
                                }else if(type == "user"){
                                    data = {
                                        "firstname" : $scope.myelement.editfirstname,
                                        "lastname" : $scope.myelement.editlastname,
                                        "employeeID" : $scope.myelement.editemployeeid,
                                        "type" : type
                                    };
                                }else{
                                    data = {
                                        "title" : $scope.myelement.edittitle,
                                        "type" : type
                                    };
                                }
                                $http({
                                    method: 'PUT',
                                    url: 'http://192.168.3.153:3000/api/'+type,
                                    headers: {
                                        "Content-Type" : "application/json"
                                    },
                                    data: data
                                }).then(function successCallback(response) {
                                    console.log("add success",response.data);
                                    elements.push({
                                        _id : response.data.id,
                                        rev : response.data.rev,
                                        docs : data
                                    });
                                }, function errorCallback(response) {
                                    console.log("error",response);
                                    // called asynchronously if an error occurs
                                    // or server returns response with an error status.
                                });

                            } else {
                                //====== update =========
                                console.log("update");
                                if(type == "heading"){
                                    data = {
                                        "title" : $scope.myelement.edittitle,
                                        "active" : $scope.myelement.editactive || false,
                                        "type" : type
                                    };
                                }else if(type == "user"){
                                    data = {
                                        "firstname" : $scope.myelement.editfirstname,
                                        "lastname" : $scope.myelement.editlastname,
                                        "employeeID" : $scope.myelement.editemployeeid,
                                        "type" : type
                                    };
                                }else{
                                    data = {
                                        "title" : $scope.myelement.edittitle,
                                        "active" : $scope.myelement.editactive,
                                        "type" : type
                                    };
                                }
                                $http({
                                    method: 'PUT',
                                    url: 'http://192.168.3.153:3000/api/'+type+'/'+$scope.myelement._id,
                                    headers: {
                                        "Content-Type" : "application/json",
                                        "If-Match" : $scope.myelement.rev
                                    },
                                    data: data
                                }).then(function successCallback(response) {
                                    console.log("update success",response.data);
                                    //==== TODO : Handle the error if obtained like following
                                    // {error: "conflict", reason: "Document revision conflict"}
                                    elements[index].rev = response.data.rev;
                                    elements[index].docs = data;
                                }, function errorCallback(response) {
                                    console.log("error",response);
                                    // called asynchronously if an error occurs
                                    // or server returns response with an error status.
                                });

                            }
                            modalInstance.close();
                        };

                        $scope.cancel = function () {
                            console.log('on cancel');
                            modalInstance.dismiss('cancel');
                        };
                    }]
                });
            }
        }
    }]);



/**
 * Created by jgandi on 20/5/16.
 */

angular.module('barrick')
    .factory('myService',['$http','$uibModal',function($http,$uibModal){
        var url = "";
        return {
            getAllData : function(type){
                console.log("get",type);
                return $http({
                    method: 'GET',
                    url: 'http://192.168.3.153:3000/api/'+type
                });
            },
            addFunction : function(elements,index,type){
                console.log(elements,index,type);
                var modalInstance = $uibModal.open({
                    templateUrl: 'myModalContent.html',
                    controller: ['$scope', function ($scope) {
                        $scope.modalTitle = (index == -1) ? 'Add '+type : 'Edit '+type;

                        if(type == "heading"){
                            $scope.myelement = {
                                _id: (index == -1) ? '' : elements[index]._id,
                                rev: (index == -1) ? '' : elements[index].rev,
                                edittitle: (index == -1) ? '' : elements[index].docs.title,
                                editactive: (index == -1) ? '' : elements[index].docs.active
                            };
                        }else if(type == "user"){
                            $scope.myelement = {
                                _id: (index == -1) ? '' : elements[index]._id,
                                rev: (index == -1) ? '' : elements[index].rev,
                                editemployeeid: (index == -1) ? '' : elements[index].docs.employeeID,
                                editfirstname: (index == -1) ? '' : elements[index].docs.firstname,
                                editlastname: (index == -1) ? '' : elements[index].docs.lastname
                            };
                        }else{
                            $scope.myelement = {
                                _id: (index == -1) ? '' : elements[index]._id,
                                rev: (index == -1) ? '' : elements[index].rev,
                                edittitle: (index == -1) ? '' : elements[index].docs.title
                            };
                        }

                        $scope.ok = function () {
                            var data;
                            if(index == -1) {

                                console.log("add active",$scope.myelement.editactive);


                                var newelement;
                                console.log("ADD");
                                //Add new employee
                                if(type == "heading") {
                                    newelement = {
                                        "_id": "",
                                        docs: {
                                            title: $scope.myelement.edittitle,
                                            active: $scope.myelement.editactive,
                                            type: type
                                        },
                                        "rev": ""
                                    };
                                }else if(type == "user"){
                                    newelement = {
                                        "_id" : "",
                                        docs: {
                                            employeeID : $scope.myelement.editemployeeid,
                                            firstname : $scope.myelement.editfirstname,
                                            lastname : $scope.myelement.editlastname,
                                            type : type
                                        },
                                        "rev": ""
                                    };
                                }else{
                                    newelement = {
                                        "_id" : "",
                                        docs: {
                                            title : $scope.myelement.edittitle,
                                            active : $scope.myelement.editactive || false,
                                            type : type
                                        },
                                        "rev": ""
                                    };
                                }
                                //console.log(newelement);
                                if(type == "heading"){
                                    data = {
                                        "title" : newelement.docs.title,
                                        "active" : newelement.docs.active || false,
                                        "type" : type
                                    };
                                    console.log(newelement);
                                    console.log("sddf",data);
                                }else if(type == "user"){
                                    data = {
                                        "firstname" : newelement.docs.firstname,
                                            "lastname" : newelement.docs.lastname,
                                            "employeeID" : newelement.docs.employeeID,
                                            "type" : type
                                    };
                                }else{
                                    data = {
                                        "title" : newelement.docs.title,
                                        "type" : type
                                    };
                                }
                                console.log("ADD ",data);
                                $http({
                                    method: 'PUT',
                                    url: 'http://192.168.3.153:3000/api/'+type,
                                    headers: {
                                        "Content-Type" : "application/json"
                                    },
                                    data: data
                                }).then(function successCallback(response) {
                                    // this callback will be called asynchronously
                                    // when the response is available
                                    /*{"id":"0d62293d41bcd68501c8200587226ab8","ok":true,"rev":"1-dfa21613d7af7a04c27d1484518e7cde"}*/
                                    //=== TODO: Add element to database
                                    console.log("function before");
                                    console.log("add sucess",response.data);
                                    newelement._id = response.data.id;
                                    newelement.rev = response.data.rev;
                                    elements.push(newelement);
                                    console.log("function after");

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
                                    // this callback will be called asynchronously
                                    // when the response is available
                                    /*{"id":"c85843d6a718a208d929de285c309d29","ok":true,"rev":"2-8e4092070c92c4358cbe5a6b2bc5bb80"}*/
                                    /*{_id: "04fd0dba9d628932b415adce56c12d0d", docs: Object, rev: "4-849326485cf23073521c79538512f51d", time_saved: "2016-05-18T18:09:23.382318584+05:30", $$hashKey: "object:5"}*/
                                    console.log("update success",response.data);
                                    //=== TODO: update element to database

                                    //==== TODO : Handle the error if obtained like following
                                    // {error: "conflict", reason: "Document revision conflict"}
                                    //console.log("new val",$scope.myelement.edittitle);
                                    elements[index].rev = response.data.rev;
                                    if(type == "heading"){
                                        elements[index].docs.title = $scope.myelement.edittitle;
                                        elements[index].docs.active = $scope.myelement.editactive;
                                    }else if(type == "user"){
                                        elements[index].docs.employeeID = $scope.myelement.editemployeeid;
                                        elements[index].docs.firstname = $scope.myelement.editfirstname;
                                        elements[index].docs.lastname = $scope.myelement.editlastname;
                                    }else{
                                        elements[index].docs.title = $scope.myelement.edittitle;
                                    }


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



/**
 * Created by jgandi on 20/5/16.
 */

angular.module('barrick')
    .factory('myService',['$http','$rootScope','$uibModal',function($http,$rootScope,$uibModal){
        //var url = 'http://192.168.3.153:3000/api/';
        var url = 'http://'+location.host+'/api/';
        return {
            setTab : function(tabNo){
                $rootScope.tab = tabNo;
            },
            getAllData : function(type){
                return $http({
                    method: 'GET',
                    url: url+type
                });
            },
            deleteFunction : function(elements,index,type){
                var element = elements[index];
                var modalInstance = $uibModal.open({
                    templateUrl: 'myModalDelete.html',
                    controller:  ['$scope', function ($scope) {
                        $scope.modalTitle = '';
                        $scope.ok = function () {
                            $http({
                                method: 'DELETE',
                                url: url+type+'/'+element._id,
                                headers: {
                                    "If-Match" : element.rev
                                }
                            }).then(function successCallback(response) {
                                elements.splice(index,1);
                            }, function errorCallback(response) {
                                console.log("error",response);
                                // called asynchronously if an error occurs
                                // or server returns response with an error status.
                            });
                            modalInstance.close();
                        };
                        $scope.cancel = function () {
                            modalInstance.dismiss('cancel');
                        };
                    }]
                });
            },
            addFunction : function(elements,index,type, metaData){
                var modalInstance = $uibModal.open({
                    templateUrl: 'myModalContent.html',
                    controller: ['$scope', function ($scope) {
                        $scope.modalTitle = (index == -1) ? 'Add '+type : 'Edit '+type;

                        $scope.myelement = {};

                        $scope.metaData = metaData;

                        //======= index = -1 indicates add, otherwise edit =======
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
                            }else if(type == "material_destination_relation"){
                                $scope.myelement.editMaterial = elements[index].docs.material;
                                $scope.myelement.editDestination = elements[index].docs.destination;
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
                                }else if(type == "material_destination_relation") {
                                    var material = JSON.parse($scope.myelement.material);
                                    var destination = JSON.parse($scope.myelement.destination);
                                    var materialData = material.docs;
                                    materialData.id = material._id;
                                    var destinationData = destination.docs;
                                    destinationData.id = destination._id;
                                    data = {
                                        "material": materialData,
                                        "destination": destinationData,
                                        "type": type,
                                        "m_d_relation": materialData.id + '_' + destinationData.id
                                    };
                                }else{
                                    data = {
                                        "title" : $scope.myelement.edittitle,
                                        "type" : type
                                    };
                                }
                                $http({
                                    method: 'PUT',
                                    url: url+type,
                                    headers: {
                                        "Content-Type" : "application/json"
                                    },
                                    data: data
                                }).then(function successCallback(response) {
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
                                }else if(type == "material_destination_relation") {
                                    data = {};
                                }else{
                                    data = {
                                        "title" : $scope.myelement.edittitle,
                                        "active" : $scope.myelement.editactive,
                                        "type" : type
                                    };
                                }
                                $http({
                                    method: 'PUT',
                                    url: url+type+'/'+$scope.myelement._id,
                                    headers: {
                                        "Content-Type" : "application/json",
                                        "If-Match" : $scope.myelement.rev
                                    },
                                    data: data
                                }).then(function successCallback(response) {
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
                            modalInstance.dismiss('cancel');
                        };
                    }]
                });
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
            getReports : function(interval,type,value){
                return $http({
                    method: 'GET',
                    url: url+'report/'+interval+'/'+type+'/'+value
                });
            }
        }
    }]);



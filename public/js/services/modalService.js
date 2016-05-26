/**
 * Created by jgandi on 25/5/16.
 */

angular.module('barrick')
    .factory('modalService',['$rootScope','$uibModal','httpService',function($rootScope,$uibModal,httpService){
        return{
            deleteModal : function($scope,type,index,cb){
                var element = $scope.elements[index];
                var modalInstance = $uibModal.open({
                    templateUrl: 'myModalDelete.html',
                    scope: $scope,
                    controller: function (){
                        $scope.modalTitle = '';
                        $scope.ok = function () {
                            httpService.deleteRequest(type,element)
                                .then(function successCallback(response) {
                                    if(response.status == 200 && 'data' in response && 'id' in response.data) {
                                        modalInstance.close();
                                        return cb(true);
                                    }else{
                                        console.log("error",response);
                                        modalInstance.close();
                                        return cb(false);
                                    }
                                }, function errorCallback(response) {
                                    console.log("error",response);
                                    modalInstance.close();
                                    return cb(false);
                                });
                        };

                        $scope.cancel = function () {
                            modalInstance.dismiss('cancel');
                        };
                    }
                });
            },
            addModal : function($scope,type,cb){
                var modalInstance =  $uibModal.open({
                    templateUrl: 'myModalContent.html',
                    scope: $scope,
                    controller: function () {
                        $scope.modalTitle = 'Add '+type;
                        $scope.myelement = {};
                        $scope.metaData = $scope.mds;
                        $scope.myelement.editactive = ['Mining','Backfilling'];

                        $scope.cancel = function () {
                            modalInstance.dismiss('cancel');
                        };

                        $scope.ok = function () {
                            var data;
                            if(type == "heading"){
                                data = {
                                    "title" : $scope.myelement.edittitle,
                                    "state" : $scope.myelement.state,
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
                            httpService.addRequest(type,data)
                                .then(function successCallback(response) {
                                    if(response.status == 200 && 'data' in response && 'id' in response.data){
                                        var res = {
                                            _id : response.data.id,
                                            rev : response.data.rev,
                                            docs : data
                                        };
                                        modalInstance.close();
                                        return cb(true,res);
                                    }else{
                                        console.log("error",response);
                                        modalInstance.close();
                                        return cb(false,{});
                                    }

                                }, function errorCallback(response) {
                                    console.log("error",response);
                                    modalInstance.close();
                                    return cb(false,{});
                                });
                        };
                    }
                });
            },
            editModal : function($scope,type,index,cb){
                var element = $scope.elements[index];
                var modalInstance =  $uibModal.open({
                    templateUrl: 'myModalContent.html',
                    scope: $scope,
                    controller: function () {
                        $scope.modalTitle = 'Edit '+type;
                        $scope.metaData = $scope.mds;

                        $scope.myelement = {
                            _id: element._id,
                            rev: element.rev
                        };
                        if(type == "heading"){
                            $scope.myelement.edittitle = element.docs.title;
                            if(element.docs.state.toLowerCase() == "mining"){
                                $scope.myelement.editactive = ['Mining','Backfilling'];
                            }else{
                                $scope.myelement.editactive = ['Backfilling'];
                            }
                            $scope.myelement.state = element.docs.state;

                        }else if(type == "user"){
                            $scope.myelement.editemployeeid = element.docs.employeeID;
                            $scope.myelement.editfirstname = element.docs.firstname;
                            $scope.myelement.editlastname = element.docs.lastname;
                        }else if(type == "material_destination_relation"){
                            $scope.myelement.editMaterial = element.docs.material;
                            $scope.myelement.editDestination = element.docs.destination;
                        }else{
                            $scope.myelement._id = element._id;
                            $scope.myelement.rev = element.rev;
                            $scope.myelement.edittitle = element.docs.title;
                        }

                        $scope.cancel = function () {
                            modalInstance.dismiss('cancel');
                        };

                        $scope.ok = function () {
                            var data;
                            if(type == "heading"){
                                data = {
                                    "title" : $scope.myelement.edittitle,
                                    "state" : $scope.myelement.state,
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
                            var coreData = {
                                _id : element._id,
                                rev : element.rev,
                                data : data
                            };
                            httpService.editRequest(type,coreData)
                                .then(function successCallback(response) {
                                    if(response.status == 200 && 'data' in response && 'id' in response.data) {
                                        var res = {
                                            rev : response.data.rev,
                                            docs : coreData.data
                                        };
                                        modalInstance.close();
                                        return cb(true,res);
                                    }else{
                                        console.log("error",response);
                                        modalInstance.close();
                                        return cb(false,{});
                                    }
                                }, function errorCallback(response) {
                                    console.log("error",response);
                                    modalInstance.close();
                                    return cb(false,{});
                                });

                        };

                    }
                });
            }
        }
    }]);
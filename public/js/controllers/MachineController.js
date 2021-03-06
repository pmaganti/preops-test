
/**
 * Created by jgandi on 19/5/16.
 */

angular.module('barrick')

    .controller('MachineController',['$scope','modalService','httpService',function($scope, modalService, httpService){

        $scope.elements = [];

        var type = 'truck';

        httpService.getAllMachines()
            .then(function successCallback(response) {console.log(response.data)
                $scope.elements = response.data;
            }, function errorCallback(response) {
                console.log("error",response);
            });

        $scope.deleteElement = function(index){
            modalService.deleteModal($scope,type,index,function(success){
                if(success){
                    $scope.elements.splice(index,1);
                }
            });
        };

        $scope.editElement = function(index){
            modalService.editModal($scope,type,index,function(success,response){
                if(success) {
                    $scope.elements[index].rev = response.rev;
                    $scope.elements[index].docs = response.docs;
                }
            });
        };

        $scope.addElement = function(){
            modalService.addModal($scope,type,function(success,response){
                if(success){
                    $scope.elements.push(response);
                }
            });
        };

    }]);
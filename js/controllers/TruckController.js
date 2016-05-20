
/**
 * Created by jgandi on 19/5/16.
 */

angular.module('TruckModule',[])

    .controller('TruckController',['$scope','myService',function($scope, myService){

        $scope.elements = [];

        myService.getAllData('truck').then(function successCallback(response) {
            $scope.elements = response.data;

        }, function errorCallback(response) {
            console.log("error",response);
        });

        $scope.delete = function(elements,index){
            myService.deleteFunction(elements,index,'truck');
        };

        $scope.addOrEdit = function(elements,index){
            myService.addFunction(elements,index,'truck');
        };

    }])

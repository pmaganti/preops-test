
/**
 * Created by jgandi on 19/5/16.
 */

angular.module('DestinationModule',[])

    .controller('DestinationController',['$scope','myService',function($scope, myService){

        $scope.elements = [];

        myService.getAllData('destination').then(function successCallback(response) {
            $scope.elements = response.data;

        }, function errorCallback(response) {
            console.log("error",response);
        });

        $scope.delete = function(elements,index){
            myService.deleteFunction(elements,index,'destination');
        };

        $scope.addOrEdit = function(elements,index){
            myService.addFunction(elements,index,'destination');
        };

    }])


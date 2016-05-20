/**
 * Created by jgandi on 19/5/16.
 */

angular.module('ReportModule',[])

    .controller('ReportController',['$scope','myService',function($scope, myService){

        $scope.elements = [];

        myService.getAllData('heading').then(function successCallback(response) {
            $scope.elements = response.data;

        }, function errorCallback(response) {
            console.log("error",response);
        });

        $scope.delete = function(elements,index){
            myService.deleteFunction(elements,index,'report');
        };

        $scope.addOrEdit = function(elements,index){
            myService.addFunction(elements,index,'heading');
        };

    }])
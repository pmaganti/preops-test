/**
 * Created by jgandi on 19/5/16.
 */

angular.module('UserModule',[])

    .controller('UserController',['$scope','$http','myService',function($scope, $http, myService){

        $scope.elements = [];
        myService.setTab(1);

        myService.getAllData('user').then(function successCallback(response) {
            $scope.elements = response.data;

        }, function errorCallback(response) {
            console.log("error",response);
        });


        $scope.delete = function(elements,index){
            myService.deleteFunction(elements,index,'user');
        };

        $scope.addOrEdit = function(elements,index){
            myService.addFunction(elements,index,'user');
        };

    }])


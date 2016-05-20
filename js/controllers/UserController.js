/**
 * Created by jgandi on 19/5/16.
 */

angular.module('UserModule',[])

    .controller('UserController',['$scope','$http','myService',function($scope, $http, myService){

        $scope.elements = [];

        myService.getAllData('user').then(function successCallback(response) {
            //console.log(response.data);
            $scope.elements = response.data;

        }, function errorCallback(response) {
            console.log("error",response);
        });


        $scope.delete = function(users,deleteIndex){
            console.log('delete',users[deleteIndex]);
            users.splice(deleteIndex,1);
        };

        $scope.addOrEdit = function(elements,index){
            //======= index = -1 indicates add, otherwise edit =======
            console.log("before calling function");
            myService.addFunction(elements,index,'user');
            console.log("after calling function");
        };

    }])


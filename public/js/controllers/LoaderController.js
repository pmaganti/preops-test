
/**
 * Created by jgandi on 19/5/16.
 */

angular.module('LoaderModule',[])

    .controller('LoaderController',['$scope','myService',function($scope, myService){

        $scope.elements = [];
        myService.setTab(6);

        myService.getAllData('loader').then(function successCallback(response) {
            $scope.elements = response.data;

        }, function errorCallback(response) {
            console.log("error",response);
        });

        $scope.delete = function(elements,index){
            myService.deleteFunction(elements,index,'loader');
        };

        $scope.addOrEdit = function(elements,index){
            myService.addFunction(elements,index,'loader');
        };

    }])

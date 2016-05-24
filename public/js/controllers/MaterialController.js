
/**
 * Created by jgandi on 19/5/16.
 */

angular.module('MaterialModule',[])

    .controller('MaterialController',['$scope','myService',function($scope, myService){

        $scope.elements = [];
        myService.setTab(3);

        myService.getAllData('material').then(function successCallback(response) {
            $scope.elements = response.data;

        }, function errorCallback(response) {
            console.log("error",response);
        });

        $scope.delete = function(elements,index){
            myService.deleteFunction(elements,index,'material');
        };

        $scope.addOrEdit = function(elements,index){
            myService.addFunction(elements,index,'material');
        };

    }])


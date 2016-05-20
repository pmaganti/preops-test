
/**
 * Created by jgandi on 19/5/16.
 */

angular.module('DestinationModule',[])

    .controller('DestinationController',['$scope','myService',function($scope, myService){

        $scope.elements = [];

        myService.getAllData('destination').then(function successCallback(response) {
            //console.log(response.data);
            $scope.elements = response.data;

        }, function errorCallback(response) {
            console.log("error",response);
        });

        $scope.delete = function(elements,deleteIndex){
            console.log('delete',elements[deleteIndex]);
            elements.splice(deleteIndex,1);
        };

        $scope.addOrEdit = function(elements,index){
            //======= index = -1 indicates add, otherwise edit =======
            myService.addFunction(elements,index,'destination');
        };

    }])


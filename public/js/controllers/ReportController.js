/**
 * Created by jgandi on 19/5/16.
 */

angular.module('ReportModule',[])

    .controller('ReportController',['$scope','myService',function($scope, myService){

        $scope.elements = [];

        $scope.primary = ['heading','material','destination','loader','truck'];
        $scope.secondary = [];

        $scope.onPrimaryChange = function() {
            console.log("Selected option",$scope.selectedPrimary);
            myService.getAllData($scope.selectedPrimary).then(function successCallback(response) {
                var values = [];
                for(var i=0; i<response.data.length; i++){
                    values[i] = response.data[i].docs.title;
                }
                $scope.secondary = values;
            }, function errorCallback(response) {
                console.log("error",response);
            });
        };

        $scope.onSecondaryChange = function() {
            console.log("Selected secondary option",$scope.selectedSecondary,$scope.selectedPrimary);
            /*myService.getReports($scope.selectedPrimary,$scope.selectedSecondary).then(function successCallback(response) {
                $scope.elements = response.data;

            }, function errorCallback(response) {
                console.log("error",response);
            });*/
        };

    }])
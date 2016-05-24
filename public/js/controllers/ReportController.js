/**
 * Created by jgandi on 19/5/16.
 */

angular.module('ReportModule',[])

    .controller('ReportController',['$scope','$stateParams','myService',function($scope,$stateParams, myService){

        $scope.elements = [];
        myService.setTab(8);

        $scope.primary = ['heading','material','destination','loader','truck'];
        $scope.secondary = [];

        var interval = $stateParams.interval || 'daily';

        $scope.onPrimaryChange = function() {
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
            myService.getReports(interval,$scope.selectedPrimary,$scope.selectedSecondary).then(function successCallback(response) {
                $scope.elements = response.data;
            }, function errorCallback(response) {
                console.log("error",response);
            });
        };

    }])
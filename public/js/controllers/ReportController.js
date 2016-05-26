/**
 * Created by jgandi on 19/5/16.
 */

angular.module('barrick')

    .controller('ReportController',['$scope','$stateParams','httpService',function($scope, $stateParams, httpService){

        $scope.elements = [];

        $scope.primary = ['heading','material','destination','loader','truck'];
        $scope.secondary = [];

        var interval = $stateParams.interval || 'daily';

        $scope.onPrimaryChange = function() {
            httpService.getAllRequest($scope.selectedPrimary)
                .then(function successCallback(response) {
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
            httpService.getAllReports(interval,$scope.selectedPrimary,$scope.selectedSecondary)
                .then(function successCallback(response) {
                    $scope.elements = response.data;
                }, function errorCallback(response) {
                    console.log("error",response);
                });
        };

    }])
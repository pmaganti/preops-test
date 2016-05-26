/**
 * Created by jgandi on 19/5/16.
 */

angular.module('barrick')

    .controller('ReportController',['$scope','$stateParams','httpService',function($scope, $stateParams, httpService){

        $scope.elements = [];

        $scope.primary = ['heading','material','destination','loader','truck'];
        $scope.secondary = [];

        var interval = $stateParams.interval || 'daily';

        httpService.getAllReports(interval)
            .then(function successCallback(response) {
                $scope.elements = response.data;
            }, function errorCallback(response) {
                console.log("error",response);
            });

    }]);
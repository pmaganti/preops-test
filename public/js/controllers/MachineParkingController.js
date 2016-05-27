/**
 * Created by jgandi on 19/5/16.
 */

angular.module('barrick')

    .controller('MachineParkingController',['$scope','$stateParams','httpService',function($scope, $stateParams, httpService){

        $scope.elements = [];

        $scope.primary = ['machine','user','parking','created'];
        $scope.secondary = [];

        //var interval = $stateParams.interval || 'daily';

        httpService.getMachineParking()
            .then(function successCallback(response) {
                $scope.elements = response.data;
            }, function errorCallback(response) {
                console.log("error",response);
            });

    }]);
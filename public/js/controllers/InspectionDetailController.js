
/**
 * Created by jgandi on 19/5/16.
 */

angular.module('barrick')

    .controller('InspectionDetailController',['$scope','modalService','httpService',function($scope, modalService, httpService){

        $scope.elements = [];

        $scope.tabs = [{
            title: 'Start Shift',
            url: 'one.tpl.html'
        }, {
            title: 'End Shift',
            url: 'two.tpl.html'
        }];

        $scope.currentTab = 'one.tpl.html';

        $scope.onClickTab = function (tab) {
            $scope.currentTab = tab.url;
        }

        $scope.isActiveTab = function(tabUrl) {
            console.log($scope.currentTab);
            return tabUrl == $scope.currentTab;
        }


        var type = 'truck';

        httpService.getAllRequest(type)
            .then(function successCallback(response) {
                $scope.elements = response.data;
            }, function errorCallback(response) {
                console.log("error",response);
            });

        $scope.deleteElement = function(index){
            modalService.deleteModal($scope,type,index,function(success){
                if(success){
                    $scope.elements.splice(index,1);
                }
            });
        };

        $scope.editElement = function(index){
            modalService.editModal($scope,type,index,function(success,response){
                if(success) {
                    $scope.elements[index].rev = response.rev;
                    $scope.elements[index].docs = response.docs;
                }
            });
        };

        $scope.addElement = function(){
            modalService.addModal($scope,type,function(success,response){
                if(success){
                    $scope.elements.push(response);
                }
            });
        };

    }]);
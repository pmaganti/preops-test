
/**
 * Created by jgandi on 19/5/16.
 */

angular.module('barrick')

    .controller('InspectionDetailController',['$scope','modalService','httpService','$stateParams',function($scope, modalService, httpService,$stateParams){
        var machine = $stateParams.machine;console.log(machine)
        $scope.elements = [];

        $scope.tabs = [{
            title: 'Start Shift',
            url: 'one.tpl.html'
        }, {
            title: 'End Shift',
            url: 'two.tpl.html'
        }];

        $scope.currentTab = 'one.tpl.html';
        $scope.currentTabTitle = 'Start Shift';

        $scope.onClickTab = function (tab) {
            $scope.currentTab = tab.url;
            $scope.currentTabTitle = tab.title;
            $scope.changeConclusion();
        }

        $scope.isActiveTab = function(tabUrl) {
            console.log($scope.currentTab);
            return tabUrl == $scope.currentTab;
        }

        var type = 'truck';

        httpService.getInspectionDetails(machine)
            .then(function successCallback(response) {
                $scope.mIndex = 0;

                $scope.elements = response.data;
                $scope.changeConclusion();
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

        $scope.changeInspection = function(index){

            $scope.mIndex = index;
            $scope.changeConclusion();


        };
        $scope.changeConclusion = function(){

            var docs = $scope.elements[$scope.mIndex].docs;
            if($scope.currentTabTitle == 'End Shift'){

                $scope.machineconclusion = (docs.endOfShift && docs.endOfShift.conclusion)?docs.endOfShift.conclusion:"-";
            }else{
                $scope.machineconclusion = (docs.startOfShift && docs.startOfShift.conclusion)?docs.startOfShift.conclusion:"-";
            }

        };

        $scope.addElement = function(){
            modalService.addModal($scope,type,function(success,response){
                if(success){
                    $scope.elements.push(response);
                }
            });
        };

    }]);
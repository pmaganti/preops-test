/**
 * Created by user on 19/5/16.
 */
angular.module('barrick')
	.controller('MDRelationController',['$scope','modalService','httpService',function($scope, modalService, httpService){

		$scope.mds = {};
		$scope.elements = [];

        var type = 'material_destination_relation';

        httpService.getAllRequest(type)
            .then(function successCallback(response) {
                $scope.elements = response.data;
            }, function errorCallback(response) {
                console.log("error",response);
            });

        httpService.getDropDownsForMDRelation()
			.then(function(data) {
				$scope.mds.materials = data.material;
				$scope.mds.destinations = data.destination;
			});

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

        $scope.deleteElement = function(index){
            modalService.deleteModal($scope,type,index,function(success){
                if(success){
                    $scope.elements.splice(index,1);
                }
            });
        };

	}]);
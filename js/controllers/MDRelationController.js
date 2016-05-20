/**
 * Created by user on 19/5/16.
 */
angular.module('barrick')
	.controller('MDRelationController',['$scope','myService',function($scope, myService){

		$scope.mds = {};
		$scope.elements = [];

		myService.getAllData('material_destination_relation').then(function successCallback(response) {
			//console.log(response.data);
			$scope.elements = response.data;

		}, function errorCallback(response) {
			console.log("error", response);
		});

		myService.getDropDownsForMDRelation()
			.then(function(data) {
				$scope.mds.materials = data.material;
				$scope.mds.destinations = data.destination;
			});

		$scope.addOrEdit = function(elements, index) {
			//======= index = -1 indicates add, otherwise edit =======
			console.log("before calling function");
			myService.addFunction(elements, index, 'material_destination_relation', $scope.mds);
			console.log("after calling function");
		};
	}]);
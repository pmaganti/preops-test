/**
 * Created by priyanka on 25/5/16.
 */

angular.module('LoginModule',[])
    .controller('LoginController', ['$scope', '$location', 'Auth', function ($scope, $location, Auth) {

        $scope.login = function() {
            Auth.login( $scope.loginUsername, $scope.loginPassword);
            if(Auth.isAuthenticated()){
                $location.path('/users')
            }
        };

        $scope.logout = function () {
            Auth.logout();
            $location.path('/login')
        };

    }]);

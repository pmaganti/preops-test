/**
 * Created by priyanka on 25/5/16.
 */

angular.module('LoginModule',[])
    .controller('LoginController', ['$scope', '$location', 'Auth', function ($scope, $location, Auth) {
        if($location.$$path === '/logout') {
            Auth.logout();
        }

        if($location.$$path === '/login' || $location.$$path === '/users') {
            if(Auth.isAuthenticated()) $location.path('/');
        }

        $scope.login = function() {
            Auth.login( $scope.loginUsername, $scope.loginPassword);
            if(Auth.isAuthenticated()){
                $location.path('/users')
            }
        };

        $scope.logout = function () {
            Auth.logout();
        };

    }]);

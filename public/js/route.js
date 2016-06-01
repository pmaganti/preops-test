/**
 * Created by jgandi on 18/5/16.
 */

angular.module('barrick')
    .config(['$stateProvider','$urlRouterProvider',function($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise("login");

        $stateProvider

            .state("login", {
                "url": "/login",
                templateUrl: 'templates/login.html',
                controller: 'LoginController',
                public:true
            })
            .state("machines", {
                "url": "/machines",
                templateUrl: 'templates/machines.html',
                controller: 'MachineController'
            })
            .state("details", {
                "url": "/details/:machine_type/:machine",
                templateUrl: 'templates/details.html',
                controller: 'InspectionDetailController'
            })
    }])
     .run(['$rootScope','$location', 'Auth', function($rootScope, $location, Auth) {
        $rootScope.$on('$stateChangeStart', function(event, toState, toParams) {
            if(toState.redirectTo){
                event.preventDefault();
                $location.path('/login');
            }else {
                if (!toState.public) {
                    if (!Auth.isAuthenticated()) {
                        event.preventDefault();
                        $location.path('/login');
                    }
                }
            }
        });
    }]);



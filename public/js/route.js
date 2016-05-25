/**
 * Created by jgandi on 18/5/16.
 */

angular.module('barrick')
    .config(['$stateProvider','$urlRouterProvider',function($stateProvider, $urlRouterProvider) {
//        $urlRouterProvider.otherwise("users");
        $stateProvider
            .state("users", {
                "url": "/users",
                templateUrl: 'templates/users.html',
                controller: 'UserController',
                "cache": false
            }).state("headings", {
                "url": "/headings",
                templateUrl: 'templates/headings.html',
                controller: 'HeadingController',
                "cache": false
            }).state("materials", {
                "url": "/materials",
                templateUrl: 'templates/materials.html',
                controller: 'MaterialController',
                "cache": false
            }).state("destinations", {
                "url": "/destinations",
                templateUrl: 'templates/destinations.html',
                controller: 'DestinationController',
                "cache": false
            }).state("mdRelation", {
                "url": "/mdRelation",
                templateUrl: 'templates/mat-dest.html',
                controller: 'MDRelationController',
                "cache": false
            }).state("loaders", {
                "url": "/loaders",
                templateUrl: 'templates/loaders.html',
                controller: 'LoaderController',
                "cache": false
            }).state("trucks", {
                "url": "/trucks",
                templateUrl: 'templates/trucks.html',
                controller: 'TruckController',
                "cache": false
            }).state("reports", {
                "url": "/reports/:interval",
                templateUrl: 'templates/reports.html',
                controller: 'ReportController',
                "cache": false
            })
            .state("login", {
                "url": "/login",
                templateUrl: 'templates/login.html',
                controller: 'LoginController',
                "cache": false
            })
    }])
     .run(['$rootScope','$location', 'Auth', function($rootScope, $location, Auth) {
    $rootScope.$on('$routeChangeStart', function(event, toRoute, fromRoute) {
        if(toRoute.public === undefined) {
            if(!Auth.isAuthenticated()) {
                $location.path('/login');
            }
        }
    });
}]);

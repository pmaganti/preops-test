/**
 * Created by jgandi on 18/5/16.
 */

angular.module('barrick')
    .config(['$stateProvider','$urlRouterProvider',function($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise("users");
        $stateProvider
            .state("users", {
                "url": "/users",
                templateUrl: 'templates/users.html',
                controller: 'UserController'
            }).state("headings", {
                "url": "/headings",
                templateUrl: 'templates/headings.html',
                controller: 'HeadingController'
            }).state("materials", {
                "url": "/materials",
                templateUrl: 'templates/materials.html',
                controller: 'MaterialController'
            }).state("destinations", {
                "url": "/destinations",
                templateUrl: 'templates/destinations.html',
                controller: 'DestinationController'
            }).state("mdRelation", {
                "url": "/mdRelation",
                templateUrl: 'templates/mat-dest.html',
                controller: 'MDRelationController'
            }).state("loaders", {
                "url": "/loaders",
                templateUrl: 'templates/loaders.html',
                controller: 'LoaderController'
            }).state("trucks", {
                "url": "/trucks",
                templateUrl: 'templates/trucks.html',
                controller: 'TruckController'
            }).state("reports", {
                "url": "/reports/:interval",
                templateUrl: 'templates/reports.html',
                controller: 'ReportController'
            })
            .state("login", {
                "url": "/login",
                templateUrl: 'templates/login.html',
                controller: 'LoginController',
                public:true
            })
    }])
     .run(['$rootScope','$location', 'Auth', function($rootScope, $location, Auth) {
        $rootScope.$on('$stateChangeStart', function(event, toState, toParams) {
            if(!toState.public) {
                if(!Auth.isAuthenticated()) {
                    $location.path('/login');
                }
            }
        });
    }]);

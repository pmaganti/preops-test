/**
 * Created by jgandi on 18/5/16.
 */

angular.module('barrick')
    .config(['$stateProvider','$urlRouterProvider',function($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise("users");
        $stateProvider
            .state("home", {
                "url": "/",
                //templateUrl: 'templates/login.html',
                redirectTo: true,
                public: true
            }).state("users", {
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
            .state("machineparking", {
                "url": "/machineparking",
                templateUrl: 'templates/machineparking.html',
                controller: 'MachineParkingController'
            })
    }])
     .run(['$rootScope','$location', 'Auth', function($rootScope, $location, Auth) {
        $rootScope.$on('$stateChangeStart', function(event, toState, toParams) {
            if(toState.redirectTo){
                //event.preventDefault();
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

/**
 * Created by jgandi on 18/5/16.
 */

angular.module('barrick',['ui.router',
                          'ui.bootstrap',
                          'UserModule',
                          'MaterialModule',
                          'LoaderModule',
                          'DestinationModule',
                          'TruckModule',
                          'HeadingModule',
                          'ReportModule','LoginModule'])
    .run(function($rootScope) {
        $rootScope.tab;
    })

    .controller('PanelController',function ($rootScope){
        /*this.setTab = function(tabValue){
            $rootScope.tab = tabValue;
        };*/
        this.isTabSelected = function(checkTab){
            return $rootScope.tab === checkTab;
        }
    });




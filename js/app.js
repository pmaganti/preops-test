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
                          'ReportModule'])

    .controller('PanelController', function (){
        this.tab = 1;
        this.setTab = function(tabValue){
            this.tab = tabValue;
        };
        this.isTabSelected = function(checkTab){
            return this.tab === checkTab;
        }
    });




/**
 * Created by jgandi on 19/5/16.
 */

angular.module('barrick')

    .directive('myModal', function(){
        return {
            restrict: 'E',
            transclude: true,
            //scope: { title:'@' },
            templateUrl: 'templates/shared/myModal.html'
        }
    })

    .directive('stringToNumber', function() {
        return {
            require: 'ngModel',
            link: function(scope, element, attrs, ngModel) {
                ngModel.$parsers.push(function(value) {
                    return '' + value;
                });
                ngModel.$formatters.push(function(value) {
                    return parseFloat(value, 10);
                });
            }
        };
    });
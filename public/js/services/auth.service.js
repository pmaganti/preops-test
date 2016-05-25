/**
 * Created by priyanka on 25/5/16.
 */

var app = angular.module('LoginModule');
app.service('Auth', ['$location',function($location){
    var service = this;
    var _isLoggedIn = false;

    service.isAuthenticated = function(){
        return _isLoggedIn;
    };

    service.logout = function(){
        _isLoggedIn = false;
        localStorage.removeItem('username', username);
        localStorage.removeItem('isLoggedIn', false);

    };

    service.login = function(username, password){
        //TODO(Priya) Will validate the credentials later from Parse
        // currently letting the user login
        if(username === '123' && password === '123')
        {
            _isLoggedIn = true;
            localStorage.setItem('username', username);
            localStorage.setItem('isLoggedIn', true);
            $location.path('/');
        }

    };



    isAuthenticated = function() {
        return (localStorage.getItem('isLoggedIn')=='true') && (localStorage.getItem('username'));
    }
}]);






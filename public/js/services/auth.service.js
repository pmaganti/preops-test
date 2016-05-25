/**
 * Created by user on 5/24/2016.
 */

var app = angular.module('LoginModule');

app.service('Auth', [function(){
    var service = this;
    var _isLoggedIn = false;

    service.isAuthenticated = function(){
        return _isLoggedIn;
    };

    service.logout = function(){
        _isLoggedIn = false;
    };

    service.login = function(username, password){
        //TODO(Priya) Will validate the credentials later from Parse
        // currently letting the user login
        if(username === 'priyanka' && password === 'priyanka')
        {
            _isLoggedIn = true;
        }
    }
}]);

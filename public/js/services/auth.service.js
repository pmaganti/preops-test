/**
 * Created by priyanka on 25/5/16.
 */

var app = angular.module('LoginModule');
app.service('Auth', ['$location',function($location){
    var service = this;
    //var _isLoggedIn = false;

    service.isAuthenticated = function(){
        //return _isLoggedIn;
        return (localStorage.getItem('isLoggedIn')=='true') && (localStorage.getItem('username'));
    };

    service.logout = function(){
        //_isLoggedIn = false;
        localStorage.removeItem('username');
        localStorage.removeItem('isLoggedIn');

    };

    service.login = function(username, password){
        //TODO(Priya) Will validate the credentials later from Parse
        // currently letting the user login
        if(username === 'admin' && password === 'B@rr1ck')
        {
            //_isLoggedIn = true;
            localStorage.setItem('username', username);
            localStorage.setItem('isLoggedIn', true);
            $location.path('/');
        }

    };
}]);






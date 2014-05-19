'use strict';

// Declare app level module which depends on filters, and services
var  App = angular.module('ispaceApp', [
  'ngRoute',
  'ispace.filters',
  'ispace.services',
  'ispace.directives',
  'ispace.controllers'
]);

App.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider){
    $routeProvider.
        when('/', {
            templateUrl: 'partials/home.html',
            controller: 'homeCtrl'
        }).
        otherwise({
            redirectTo: '/'
        });

    $locationProvider.html5Mode(true);
}])
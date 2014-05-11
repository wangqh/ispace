'use strict';

/* Directives */


var ispaceDirectives = angular.module('ispace.directives', []);

ispaceDirectives.directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  }]);

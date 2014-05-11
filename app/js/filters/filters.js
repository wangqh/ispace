'use strict';

/* Filters */

var ispaceFilters = angular.module('ispace.filters', []);

ispaceFilters.filter('interpolate', ['version', function(version) {
    return function(text) {
      return String(text).replace(/\%VERSION\%/mg, version);
    };
  }]);

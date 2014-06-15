'use strict';

// Declare app level module which depends on filters, and services
var  App = angular.module('ispaceApp', [
  'ngResource',
  'ispace.filters',
  'ispace.services',
  'ispace.directives',
  'ispace.controllers'
]);

var ispaceDirectives = angular.module('ispace.directives', []);
var ispaceControllers = angular.module('ispace.controllers', []);
var ispaceFilters = angular.module('ispace.filters', []);
var ispaceServices = angular.module('ispace.services', ['ngResource']);
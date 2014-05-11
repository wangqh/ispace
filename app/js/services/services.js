'use strict';

/* Services */


// Demonstrate how to register services

var ispaceServices = angular.module('ispace.services', []);

// In this case it is a simple value service.
ispaceServices.value('version', '0.1');

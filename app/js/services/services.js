'use strict';

/* Services */


// Demonstrate how to register services

var ispaceServices = angular.module('ispace.services', ['ngResource']);

// In this case it is a simple value service.
ispaceServices.value('version', '0.1');

//创建我的圈子服务
ispaceServices.factory('Group', ['$resource', function($resource){
    return $resource('api/user/group/:groupId',{},{
        query: {method: 'GET', params: {groupId: 'groups'}, isArray: true}
    });
}]);

//创建消息提示服务
ispaceServices.factory('Notify', ['$resource', function($resource){
    return $resource('api/user/notify',{},{
        count: {method: 'GET', params: {type: 'count'}, isArray: false}
    });
}]);
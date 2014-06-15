/**
 * Created by wqh on 2014-06-09.
 */
'use strict';

ispaceDirectives.directive('myHeader',  function() {
    return {
        restrict: 'EA',
        replace: true,
        templateUrl: 'partials/header-directive.html',
        controller: ['$rootScope', 'NotifyInterval', 'User', function($rootScope, NotifyInterval, User){
            /* 消息对象 */
            $rootScope.notify = {
                count: 0
            };
            NotifyInterval.apply('notify', function(count){
                $rootScope.notify.count = count; //消息数
            });

            /* 当前用户对象 */
            $rootScope.visitor = User.visitor();
        }]
    };
});
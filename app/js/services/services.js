'use strict';

/* Services */


// Demonstrate how to register services

var ispaceServices = angular.module('ispace.services', ['ngResource']);

// In this case it is a simple value service.
ispaceServices.value('version', '0.1');

//创建我的圈子服务
ispaceServices.factory('Group', ['$resource',
    function($resource){
        return $resource('api/user/group/:groupId', {},
            {
            query: { method: 'GET', params: {groupId: 'list'}, isArray: true }
        });
    }]);

//创建消息服务
ispaceServices.factory('Notify', ['$resource', function($resource){
    return $resource('api/user/notify/:op', {}, {
        count: {method: 'GET', params: {op: 'count'}}// 我的消息数
    });
}]);

//创建定时获取消息数服务
ispaceServices.factory('NotifyInterval', ['$interval', 'Notify', 'Article', function($interval, Notify, Article){
    return {
        __intervals: [],

        apply: function(type, success){
            var self = this;
            var _interval = null;
            self.__getCount(type, success);
            _interval = $interval(function(){
                self.__getCount(type, success);
            }, 10000);
            self.__intervals.push({
                type: _interval
            });
            return self;
        },

        destroy: function(type){
            var self = this;
            $interval.cancel(self.__intervals[type]);
        },
        __getCount: function(type, success){
            var MsgCount = null;
            switch (type)
            {
                case 'notify':
                    MsgCount = Notify.count(function(){
                        success(MsgCount.count);
                    });
                    break;
                case 'ourLatest':
                    MsgCount = Article.ourLatest(function(){
                        success(MsgCount.count);
                    });
                    break;
                default:
            }


        }
    };
}]);

//创建微博文章服务
ispaceServices.factory('Article', ['$resource', function($resource){
    return $resource('api/:ob/article/:op/:cid', {ob: 'user',op: 'list'}, {
        ourList: {method: 'GET', params: {ob:'us'}, isArray: true},//我们的动态(包含关注的人)
        ourLatest: {method: 'GET', params: {ob:'us', op:'latest'}},//我们的动态 最新数量
        myList: {method: 'GET', params: {ob:'user'}, isArray: true},//我的动态
        removeComment: {method: 'DELETE', params: { ob: null, op: 'comment'}},//删除对应id的评论
        addComment: {method: 'POST', params: { ob: null, op: 'comment'}}//增加评论
    });
}]);
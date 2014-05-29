'use strict';

/* Services */


// Demonstrate how to register services

var ispaceServices = angular.module('ispace.services', ['ngResource']);

// In this case it is a simple value service.
ispaceServices.value('version', '0.1');

//创建我的圈子REST服务
ispaceServices.factory('Group', ['$resource',
    function($resource){
        return $resource('api/user/group/:groupId', {},
            {
            query: { method: 'GET', params: {groupId: 'list'}, isArray: true }
        });
    }]);

//创建消息REST服务
ispaceServices.factory('Notify', ['$resource', function($resource){
    return $resource('api/user/notify/:op', {}, {
        count: {method: 'GET', params: {op: 'count'}}// 我的消息数
    });
}]);

//创建定时获取消息数服务
ispaceServices.factory('NotifyInterval', ['$interval', 'Notify', 'Article', function($interval, Notify, Article){
    return {
        __types: [],

        __interval: null,

        apply: function(type, success){
            var self = this;

            for(var i in self.__types){
                if(self.__types[i].type == type){
                    return ;
                }
            }
            self.__types.push({type: type, success: success});
            if(self.__types.length && !self.__interval){
                self.__interval = $interval(function(){
                    self.__getCount(self.__types);
                }, 60000);
            }
            self.__getCount(self.__types);

            return self;
        },

        destroy: function(type){
            var self = this;
            for(var i in self.__types){
                if(self.__types[i].type === type){
                    self.__types.splice(i,1);
                }
            }
        },
        __getCount: function(types){
            var self = this;

            if(!types.length){
                $interval.cancel(self.__interval);
            } else {
                for(var i in types){
                    switch (types[i].type)
                    {
                        case 'notify':
                            self.__getNotifyCount(types[i].success);
                            break;
                        case 'ourLatest':
                            self.__getArticleCount(types[i].success);
                            break;
                        default:
                    }
                }
            }


        },

        __getNotifyCount: function (success) {
            var MsgCount = Notify.count(function () {
                success(MsgCount.count);
            });
        },

        __getArticleCount: function (success) {
            var MsgCount = Article.ourLatest(function(){
                success(MsgCount.count);
            });
        }
    };
}]);

//创建微博文章REST服务
ispaceServices.factory('Article', ['$resource', function($resource){
    return $resource('api/:ob/article/:op/:cid', {ob: 'user'}, {
        ourList: {method: 'GET', params: {ob:'us', op: 'list'}, isArray: true},//我们的动态(包含关注的人)
        ourLatest: {method: 'GET', params: {ob:'us', op:'latest'}},//我们的动态 最新数量
        myList: {method: 'GET', params: {ob:'user', op: 'list'}, isArray: true},//我的动态
        removeComment: {method: 'DELETE', params: { ob: null, op: 'comment'}},//删除对应id的评论
        addComment: {method: 'POST', params: { ob: null, op: 'comment'}}//增加评论
    });
}]);

//创建用户REST服务
ispaceServices.factory('User', ['$resource', function($resource){
    return $resource('api/:u/:op', {u: 'user'}, {
        myInfo: {method: 'GET', params: {op:'index'}},//我的个人信息
        oneInfo: {method: 'GET', params: {u:'uid', op:'index'}}//某个的信息
    });
}]);

//创建用户信息服务
ispaceServices.factory('userInfo', ['User', function(User){
    return {
        data: function(){
            return User.myInfo();
        }
    };
}]);
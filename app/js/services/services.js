'use strict';

/* Services */




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
    return $resource('api/:ob/article/:op/:id', {ob: 'user'}, {
        ourList: {method: 'GET', params: {ob:'us', op: 'list'}, isArray: true},//我们的动态(包含关注的人)
        ourLatest: {method: 'GET', params: {ob:'us', op:'latest'}},//我们的动态 最新数量
        myList: {method: 'GET', params: {ob:'user', op: 'list'}, isArray: true},//我的动态
        removeComment: {method: 'DELETE', params: { ob: null, op: 'comment'}},//删除对应id的评论
        addComment: {method: 'POST', params: { ob: null, op: 'comment'}},//增加评论
        fav: {method: 'PUT', params: { ob: null, op: 'fav'}},//收藏
        like: {method: 'PUT', params: { ob: null, op: 'like'}}//喜欢
    });
}]);

//创建用户REST服务
ispaceServices.factory('User', ['$resource', function($resource){
    return $resource('api/user/:uid/:opp/:op/:id', {uid: null}, {// 若其它人的信息给uid赋值(用户id)
        visitor: {method: 'GET', params: {op:'visitor'}},//获取当前登录的用户
        info: {method: 'GET', params: {op:'info'}},//基本信息,:uid有值时取他人信息
        getTags: {method: 'GET', params: {opp:'profile', op:'tag'}, isArray: true},//获取所有标签
        addTag: {method: 'POST', params: {opp:'profile', op:'tag'}},//增加标签
        removeTag: {method: 'DELETE', params: {opp:'profile', op:'tag'}},//删除标签
        getTeamMembers: {method: 'GET', params: {opp:'profile', op:'teamMembers'}, isArray: true},//获取用户的团队成员
        getOrgRelation: {method: 'GET', params: {opp:'profile', op:'orgRelation'}, isArray: true},//获取用户的汇报关系
        getListSkill: {method: 'GET', params: {opp:'profile', op:'skill'}, isArray: true},//获取用户的技能认可列表
        getApprovers: {method: 'GET', params: {opp:'profile', op:'approvers'}, isArray: true},//获取某项技能的认可者，按页码获取
        approveSkill: {method: 'PUT', params: {opp:'profile', op:'skill'}},//认可用户的技能
        getBasic: {method: 'GET', params: {opp:'profile', op:'basic'}},//获取用户档案的基本资料
        getContact: {method: 'GET', params: {opp:'profile', op:'contact'}},//获取用户档案的联系方式
        getExperience: {method: 'GET', params: {opp:'profile', op:'experience'}}//获取用户档案的联系方式
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
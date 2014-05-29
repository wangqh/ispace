'use strict';

/* Controllers */

var ispaceControllers = angular.module('ispace.controllers', []);

ispaceControllers.controller('headerCtrl', ['$rootScope', 'NotifyInterval', function($rootScope, NotifyInterval){
    /* 消息对象 */
    $rootScope.notify = {
        count: 0
    };
    NotifyInterval.apply('notify', function(count){
        $rootScope.notify.count = count; //消息数
    });
}]);

ispaceControllers.controller('homeCtrl', ['$scope', 'Group', 'User', '$resource', function( $scope, Group, User, $resource) {

    /* 我的圈子 */
    $scope.myGroup = {
        title: '我的圈子',
        link: '#mygroup/',
        list: []
    };
    $scope.myGroup.list = Group.query();

    /* 我的个人信息 */
    var myInfo  = User.myInfo(function(){
        $scope.myInfo = myInfo;
        for(var i in $scope.myInfo.myApps){
            switch ($scope.myInfo.myApps[i].keyword)
            {
                case 'vDisk':
                    $scope.myInfo.myApps[i].iconClass = 'cloud';
                    break;
                case 'mail':
                    $scope.myInfo.myApps[i].iconClass = 'mail';
                    break;
                case 'oa':
                    $scope.myInfo.myApps[i].iconClass = 'inbox';
                    break;
                case 'ehr':
                    $scope.myInfo.myApps[i].iconClass = 'user';
                    break;
                case 'crm':
                    $scope.myInfo.myApps[i].iconClass = 'briefcase';
                    break;
                case 'baox':
                    $scope.myInfo.myApps[i].iconClass = 'card';
                    break;
                case 'website':
                    $scope.myInfo.myApps[i].iconClass = 'webpage';
                    break;
                default :
            }
        }
    });

    /* 签到送空间模块 */
    var CheckIn = $resource('api/user/checkin');
    var checkIn = CheckIn.get(function(){
        $scope.checkIn = checkIn;
    });
    $scope.doCheckIn = function(){
        if($scope.checkIn){
            checkIn.checkIn.isChecked = true;//测试用 成功后自动更新
            checkIn.checkIn.count += 1;//测试用 成功后自动更新
            checkIn.$save(function(){},function(){
                alert('签到失败');
            });
        }
    };
    $scope.timeFormat = 'H:mm';
    $scope.weekFormat = 'EEE';


}]);

/* 发布消息表单 */
ispaceControllers.controller('formPublishCtrl',['$scope', '$element', function($scope, $element){
    var article = {};
    $scope.isShowBtn = false;
    $scope.inptRows = 1;
    $scope.showBtn = function(){
        $scope.isShowBtn = true;
        $scope.inptRows = 3;
    };
    $scope.inputMsg = '';
    $scope.submit = function(){
        if($scope.inputMsg){
            article.content = $scope.inputMsg;
            article.type = 'txt';
            $scope.addArticle(article);
            $element[0].reset();
        }
    };
}]);

/* 消息列表模块 */
ispaceControllers.controller('articleListCtrl',['$scope',  'Article', 'NotifyInterval', function($scope,  Article, NotifyInterval) {

    $scope.articlesType = 'all';

    NotifyInterval.apply('ourLatest', function(count){
        $scope.latestCount  = count; //消息数
    });

    $scope.getArticles = function(){
        $scope.articles = Article.ourList({type: $scope.articlesType});
    };
    $scope.getArticles();

    $scope.addArticle = function(article){
        Article.save(article,function(){// ajax 成功
            $scope.getArticles();
        },function(data){// ajax 失败 测试用
            if(data.status === 404){
                $scope.articles.unshift({
                    'id': '324325325',
                    'user': {
                        'name': $scope.myInfo.name,
                        'faceUrl': $scope.myInfo.faceUrl,
                        'org': $scope.myInfo.org
                    },
                    'date': '刚刚',
                    'type': article.type,
                    'content':article.content,
                    'like': null,
                    'comments': {
                        'listCount': 0,
                        'list': []
                    }
                });
            }
        });
    };

    $scope.addComment = function(comment, success, error){
        Article.addComment(comment, success, error);
    };

    $scope.deleteComment = function(id, success, error){
        Article.removeComment({cid:id}, success, error);
    };
}]);

ispaceControllers.controller('myInfo', ['$scope', function($scope){}]);
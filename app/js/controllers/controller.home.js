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

ispaceControllers.controller('homeCtrl', ['$scope', 'Group', 'NotifyInterval', function( $scope, Group, NotifyInterval) {

    /* 我的圈子 */
    $scope.myGroup = {
        title: '我的圈子',
        link: '#mygroup/',
        list: []
    };
    $scope.myGroup.list = Group.query();
}]);

/* 发布消息表单 */
ispaceControllers.controller('formPublishCtrl',['$scope', 'Article', function($scope, Article){
    $scope.isShowBtn = false;
    $scope.inptRows = 1;
    $scope.showBtn = function(){
        $scope.isShowBtn = true;
        $scope.inptRows = 3;
    };
    $scope.inputMsg = '';
    $scope.submit = function(){
        if($scope.inputMsg){
            Article.save({article: $scope.inputMsg});
        }
    };
}]);

/* 消息列表模块 */
ispaceControllers.controller('msgListCtrl',['$scope', '$templateCache', 'Article', 'NotifyInterval', function($scope, $templateCache, Article, NotifyInterval) {

    $scope.articlesType = 'all';

    NotifyInterval.apply('ourLatest', function(count){
        $scope.latestCount  = count; //消息数
    });

    $scope.getArticles = function(){
        $scope.articles = Article.ourList({type: $scope.articlesType});
    };
    $scope.getArticles();

    $scope.addComment = function(comment, success, error){
        Article.addComment(comment, success, error);
    };

    $scope.deleteComment = function(id, success, error){
        Article.removeComment({cid:id}, success, error);
    };
}]);
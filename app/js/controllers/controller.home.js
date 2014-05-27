'use strict';

/* Controllers */

var ispaceControllers = angular.module('ispace.controllers', []);

ispaceControllers.controller('headerCtrl', ['$rootScope', 'Notify', function($scope, Notify){
    /* 消息对象 */
    $scope.notify = {
        count: 0
    };
    $scope.notify.count = Notify.count() > 0 ? Notify.count() : '';//消息数
}]);

ispaceControllers.controller('homeCtrl', ['$scope', 'Group', 'Notify', function( $scope, Group, Notify) {
    /* 消息对象 */
    $scope.notify = {
        count: 0
    };
    $scope.notify.count = Notify.count() > 0 ? Notify.count() : '';//消息数

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
ispaceControllers.controller('msgListCtrl',['$scope', 'Article', '$interval', function($scope, Article, $interval) {
    $scope.articlesType = 'all';

    $scope.latestCount = 0;

    $scope.getLatest = function(){
        $scope.latestCount = Article.ourLatest();
    };
    $interval($scope.getLatest(), 10000);

    $scope.getArticles = function(){
        $scope.articles = Article.ourList({type: $scope.articlesType},function(){
        });
    };
    $scope.getArticles();

    $scope.addComment = function(comment){
        Article.save(comment);
    };

    $scope.deleteComment = function(id){
        Article.remove({id:id});
    };
}]);
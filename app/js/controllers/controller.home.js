'use strict';

/* Controllers */

var ispaceControllers = angular.module('ispace.controllers', []);

ispaceControllers.controller('headerCtrl', ['$rootScope', 'Notify', function($rootScope, Notify){
    /* 消息对象 */
    $rootScope.notify = {
        count: 0
    };
    $rootScope.notify.count = Notify.query() > 0 ? Notify.query() : '';//消息数
    $rootScope.notify.count = $rootScope.notify.count['$resolved'] ? $rootScope.notify.count : 234 ;// mock
}]);

ispaceControllers.controller('homeCtrl', ['$scope', 'Group', 'Notify', function( $scope, Group, Notify) {

    /* 我的圈子 */
    $scope.myGroup = {
        title: '我的圈子',
        link: '#mygroup/',
        list: []
    };
    $scope.myGroup.list = Group.query();
    $scope.myGroup.list = $scope.myGroup.list['$resolved'] ? $scope.myGroup.list : [// mock
        {
            imgUrl: 'images/temp/face.jpg',
            link: '##',
            title: '集团知识管理群'
        },
        {
            imgUrl: 'images/temp/face.jpg',
            link: '##',
            title: '集团国外考试教学教研与运营群'
        }
    ];
  }]);

/* 发布消息表单 */
ispaceControllers.controller('formPublishCtrl',['$scope', function($scope){
    $scope.isShowBtn = false;
    $scope.inptRows = 1;
    $scope.showBtn = function(){
        $scope.isShowBtn = true;
        $scope.inptRows = 3;
    };
    $scope.inputMsg = '';
    $scope.submit = function(){
        if($scope.inputMsg){
            //console.log('hi')
        }
    }
}]);

/* 消息列表模块 */
ispaceControllers.controller('msgListCtrl',['$scope', function($scope){
    $scope.msgType = 'all';
}]);
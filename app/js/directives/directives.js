'use strict';

/* Directives */


var ispaceDirectives = angular.module('ispace.directives', []);

ispaceDirectives.directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
        elm.text(version);
    };
}]);

ispaceDirectives.directive('myArticles',  function() {
    return {
        restrict:'EA',
        scope:{
            articles:'=',
            onadd: '&',
            ondelete: '&'
        },
        templateUrl:'partials/articles-directive.html',
        controller:function ($scope, $attrs) {
            $scope.addComment = function(comment){
                $scope.onadd({comment:comment});
            };
            $scope.deleteComment = function(id){
                $scope.ondelete({id:id});
            };
        }
    };
});

ispaceDirectives.directive('myComments',  function() {
    return {
        restrict:'EA',
        scope:{
            list:'=',
            articleid: '@',
            ondelete: '&',
            onadd: '&'
        },
        replace: true,
        templateUrl: 'partials/comments-directive.html',
        controller:function ($scope, $attrs) {
            $scope.replyTo = '';
            var comment = {
                toId: $scope.articleid
            };
            $scope.deleteComment = function(id){
                $scope.ondelete({id:id});
            };
            $scope.replyComment = function(commentOB){
                $scope.replyTo = commentOB.user.name;
                comment.replyId = commentOB.id;
            };
            $scope.addComment = function(commentTxt){
                comment.txt = commentTxt;
                $scope.onadd({comment:comment});
                comment.replyId = false;
            };
        }
    };
});

ispaceDirectives.directive('myComment',  function() {
    return {
        restrict: 'EA',
        scope:{
            comment: '=',
            delete: '&',
            reply: '&'
        },
        replace: true,
        templateUrl: 'partials/comment-directive.html',
        controller: function commentCtrl($scope, $attrs){

        },
        link: function (scope, element, attrs, ctrl) {
            element.hide().fadeIn('slow');
            console.log(ctrl);
        }
    };
});

ispaceDirectives.directive('myCommenting',  function() {
    return {
        restrict: 'EA',
        scope:{
            add: '&',
            replyto: '='
        },
        replace: true,
        require: 'commentCtrl',
        templateUrl: 'partials/commenting-directive.html',
        controller: function ($scope, $attrs){
            $scope.inputRows = 1;
            $scope.goComment = function(){
                $scope.inputRows = 3;
                $scope.isFocus = true;
            };
        },
        link: function(scope, element, attrs, ctrl){
            console.log(ctrl);
        }
    };
});

ispaceDirectives.directive('myVideo',  function($sce) {
    return {
        restrict: 'EA',
        scope:{
            vid: '@'
        },
        replace: true,
        templateUrl: 'partials/video-directive.html',
        controller: function ($scope) {
            $scope.videoUrl = $sce.trustAsResourceUrl('http://union.bokecc.com/player?vid='+ $scope.vid +'&siteid=B47D5D75B8086E19&autoStart=false&width=100%&height=auto&playerid=6804363A07E3D55F&playertype=1');
        }
    };
});
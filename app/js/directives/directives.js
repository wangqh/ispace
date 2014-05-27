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
        controller:function ($scope, $element, $attrs, $document) {
            $scope.replyTo = '';
            var comment = {
                forId: $scope.articleid
            };
            $scope.deleteComment = function(id){
                $scope.ondelete({id:id});
            };
            $scope.replyComment = function(commentOB){
                var _commenting = $element.find('.media-commenting');
                var pos = _commenting.position();
                angular.element('html,body').animate({scrollTop: pos.top},'slow', 'swing', function(){
                    _commenting.find('.form-control').focus();
                });

                $scope.replyTo = commentOB.user.name;
                comment.replyId = commentOB.id;
            };
            $scope.addComment = function(commentTxt){
                comment.txt = commentTxt;
                $scope.onadd({comment:comment});
                comment.replyId = false;
            };

        },
        link: function(scope, element, attrs, ctrl){
            //console.log(ctrl);
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
        controller: function ($scope, $attrs){
        },
        link: function (scope, element, attrs, controller) {
            element.hide().fadeIn('slow');
        }
    };
});

ispaceDirectives.directive('myCommenting',  function() {
    return {
        restrict: 'EA',
        scope:{
            onadd: '&',
            replyto: '='
        },
        replace: true,
        templateUrl: 'partials/commenting-directive.html',
        controller: function ($scope, $element, $attrs){
            $scope.inputRows = 1;
            $scope.goComment = function(){
                $scope.inputRows = 3;
                $scope.isFocus = true;
                if($scope.replyto) {
                    $scope.inputStyle = {
                        'text-indent': $element.find('label').width() + 3
                    }
                }
            };
            $scope.add = function(){
                $scope.onadd({commentTxt: $scope.comment});
            }
        },
        link: function(scope, element, attrs, ctrl){
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
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
            $scope.addComment = function(comment,success){
                $scope.onadd({comment:comment, success: success});
            };
            $scope.deleteComment = function(id, success){
                $scope.ondelete({id:id, success:success});
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
                articleId: $scope.articleid
            };
            $scope.deleteComment = function(id){
                $scope.ondelete({id:id,success:function(){// ajax 成功时
                    delete $scope.list[id];
                },error: function(){// ajax 失败时 测试用
                    delete $scope.list[id];
                }});
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
                $scope.onadd({comment:comment,success:function(data){// ajax 成功时
                    $scope.list.unshift(data);
                },error: function(data){// ajax 失败时 测试用
                    console.log(data);
                    var d = {
                        'id': '5555523532531212',
                        'user': {
                            'name': '自己',
                            'link': '#ldh',
                            'faceUrl': 'images/temp/face.jpg'
                        },
                        'content': commentTxt,
                        'date': '刚刚'
                    };
                    $scope.list.unshift(d);
                }});
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
                $element[0].reset();
            };
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
            $scope.videoUrl = $sce.trustAsResourceUrl('http://union.bokecc.com/player?vid='+ $scope.vid +'&siteid=B47D5D75B8086E19&autoStart=false&width=100%&height=100%&playerid=6804363A07E3D55F&playertype=1');
        }
    };
});
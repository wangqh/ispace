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
            $scope.addComment = function(comment,success, error){
                $scope.onadd({comment:comment, success:success, error:error});
            };
            $scope.deleteComment = function(id, success, error){
                $scope.ondelete({id:id, success:success, error:error});
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
                    for(var i in $scope.list){
                        if($scope.list[i].id === id){
                            $scope.list.splice(i,1);
                        }
                    }
                },error: function(){// ajax 失败时 测试用
                    for(var i in $scope.list){
                        if($scope.list[i].id === id){
                            $scope.list.splice(i,1);
                        }
                    }
                }});
            };
            $scope.replyComment = function(commentOB){
                var _commenting = $element.find('.media-commenting');
                $scope.goToPosition(_commenting, function(){
                    _commenting.find('.form-control').focus();
                });

                $scope.replyTo = commentOB.user.name;
                comment.replyTo = commentOB.user.name;
            };
            $scope.addComment = function(commentTxt){
                comment.txt = commentTxt;
                $scope.onadd({comment:comment,success:function(data){// ajax 成功时
                    $scope.goToPosition($element);
                    $scope.pushList(data);
                    comment.replyTo = false;
                },error: function(data){// ajax 失败时 测试用
                    if(data.status === 404){
                        var date = new Date();
                        var d = {
                            'id': date.getTime(),
                            'replyTo': comment.replyTo,
                            'user': {
                                'name': '自己',
                                'link': '#ldh',
                                'faceUrl': 'images/temp/face.jpg'
                            },
                            'content': commentTxt,
                            'date': '刚刚'
                        };

                        $scope.goToPosition($element);
                        $scope.pushList(d);
                        console.log(data);
                    }
                    comment.replyTo = false;
                }});

            };
            $scope.pushList = function(item){
                $scope.list.unshift(item);
            };
            $scope.goToPosition = function($tarEle, callback){
                var pos = $tarEle.position();
                angular.element('html,body').animate({scrollTop: pos.top},'slow', 'swing', callback);
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

ispaceDirectives.directive('myCurrentTime', function($timeout, dateFilter) {
    // return the directive link function. (compile function not needed)
    return function(scope, element, attrs) {
        var format,  // date format
            timeoutId; // timeoutId, so that we can cancel the time updates

        // used to update the UI
        function updateTime() {
            element.text(dateFilter(new Date(), format));
        }

        // watch the expression, and update the UI on change.
        scope.$watch(attrs.myCurrentTime, function(value) {
            format = value;
            updateTime();
        });

        // schedule update in one second
        function updateLater() {
            // save the timeoutId for canceling
            timeoutId = $timeout(function() {
                updateTime(); // update DOM
                updateLater(); // schedule another update
            }, 1000);
        }

        // listen on DOM destroy (removal) event, and cancel the next UI update
        // to prevent updating time ofter the DOM element was removed.
        element.bind('$destroy', function() {
            $timeout.cancel(timeoutId);
        });

        updateLater(); // kick off the UI update process.
    };
});
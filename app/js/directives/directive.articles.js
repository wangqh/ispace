/**
 * Created by wqh on 2014-06-09.
 */
'use strict';

ispaceDirectives.directive('myArticles',  function() {
    return {
        restrict:'EA',
        scope:{
            articles:'=',
            onadd: '&',
            ondelete: '&',
            onfav: '&',
            onlike: '&'
        },
        replace: true,
        templateUrl:'partials/articles-directive.html',
        controller:function ($scope, $attrs, $element) {
            $scope.addComment = function(comment,success, error){
                $scope.onadd({comment:comment, success:success, error:error});
            };
            $scope.deleteComment = function(id, success, error){
                $scope.ondelete({id:id, success:success, error:error});
            };
            $scope.favArticle = function(id,success, error){
                $scope.onfav({id:id, success:success, error:error});
            };
            $scope.likeArticle = function(id,success, error){
                $scope.onlike({id:id, success:success, error:error});
            };

        }
    };
});

ispaceDirectives.directive('myArticle',  function() {
    return {
        restrict:'EA',
        scope:{
            article:'=',
            onadd: '&',
            ondelete: '&',
            onfav: '&',
            onlike: '&'
        },
        replace: true,
        templateUrl:'partials/article-directive.html',
        controller:function ($scope, $attrs, $element) {
            $scope.addComment = function(comment,success, error){
                $scope.onadd({comment:comment, success:success, error:error});
            };
            $scope.deleteComment = function(id, success, error){
                $scope.ondelete({id:id, success:success, error:error});
            };
            $scope.favArticle = function(){//收藏
                $scope.onfav({id: $scope.article.id, success:function(){
                    //ajax 成功时
                    $scope.article.fav = !$scope.article.fav;
                }, error:function(){
                    //ajax 失败时 测试用
                    $scope.article.fav = !$scope.article.fav;
                }});
            };
            $scope.likeArticle = function(){//赞
                $scope.onlike({id: $scope.article.id, success:function(){
                    //ajax 成功时
                    $scope.article.like.meLiked = !$scope.article.like.meLiked;
                }, error:function(){
                    //ajax 失败时 测试用
                    $scope.article.like.meLiked = !$scope.article.like.meLiked;
                }});
            };

            $scope.commentArticle = function(){
                var _commenting = $element.find('.media-commenting');
                goToPosition(_commenting, function(){
                    _commenting.find('.form-control').focus();
                });
            };
            var formShare = '<form action="api/article/share" name="shareArticle" class="form-horizontal form-share" method="post">' +
                '                <input name="articleId" value="'+ $scope.article.id +'" type="hidden"/>' +
                '                <div class="form-group">' +
                '                    <label class="col-sm-3 control-label" >' +
                '                        <input type="checkbox" checked value="mail" name="mode" />' +
                '                    通过电子邮件分享给' +
                '                    </label>' +
                '                    <div class="col-sm-9">' +
                '                        <input type="email" required class="form-control" placeholder="someone@xdf.cn" name="mail"/>' +
                '                    </div>' +
                '                </div>' +
                '                <div class="form-group">' +
                '                <label class="col-sm-3 control-label" >' +
                '                    <input type="checkbox" value="weixin" name="mode" />' +
                '                或 分享到微信朋友圈' +
                '                </label>' +
                '                <div class="col-sm-9 form-control-static">' +
                '                   <a href="#" >绑定微信账号</a>' +
                '                </div>' +
                '               </div>' +
                '                <div class="media">' +
                '                    <div class="pull-left"><img class="img-circle face30" src="images/temp/face.jpg" alt=""/></div>' +
                '                    <div class="media-body">' +
                '                        <input type="text" placeholder="我来补充两句" name="msg" class="form-control"/>' +
                '                   </div>' +
                '                </div>' +
                '                <div class="form-actions">' +
                '                    <button type="submit" class="btn btn-primary btn-sm">分享</button>' +
                '                </div>' +
                '            </form>';
            $element.find('.btn-share').popover({
                title: '我要分享',
                html: true,
                placement: 'bottom',
                container:'.is-home-content',
                content: formShare
            });


            $element.find('.btn-forward').popover({
                title: '我要转发',
                html: true,
                placement: 'bottom',
                container:'.is-home-content',
                template: '#forwardPopover'
            }).on('show.bs.popover', function(){
                angular.element('#forwardPopover [name="articleId"]').val($scope.article.id);
            });

            function goToPosition($tarEle, callback){
                var pos = $tarEle.position();
                angular.element('html,body').animate({scrollTop: pos.top},'slow', 'swing', callback);
            }
        }
    };
});

ispaceDirectives.directive('myForwardArticle', function($resource){
    return {
        restrict:'EA',
        scope: {
            groups : '=',
            faceurl: '@'
        },
        replace: true,
        templateUrl: 'partials/forward-article-directive.html',
        link: function(scope,element){
            scope.selectedGroups = [];
            scope.showGroups = false;
            scope.submitSelect = function(){
                scope.selectedGroups = [];
                element.find('.groupId').each(function(){
                    var group = angular.element(this);
                    if(group.is(':checked')){
                        for(var i in scope.groups){
                            if(group.val() === scope.groups[i].id){
                                scope.selectedGroups.push(scope.groups[i]);
                            }
                        }
                    }
                });
                scope.showGroups = false;

            };
            scope.closeGroups = function(){
                scope.showGroups = false;
            };

            var $mention = element.find('.btn-mentions');
            $mention.popover({
                title: '@提及',
                html: true,
                placement: 'bottom',
                template: '#mentionPopover'
            });

            scope.submit = function(){
                var Forward = $resource('api/article/forward');
                var data = {
                    mode: {},
                    groups: scope.selectedGroups
                };
                element.find(':input').each(function(){
                    var $this = angular.element(this);
                    var name = $this.attr('name');
                    if(name){
                        if(name === 'mode'){
                            data.mode[$this.val()] = $this.is(':checked') ;
                        } else if(name === 'msg'){
                            data.msg = $this.val();
                        }
                    }
                });
                Forward.save(data,function(){
                    //转发成功
                    angular.element('#forwardPopover').find('.close').trigger('click');
                },function(){
                    //转发失败
                    angular.element('#forwardPopover').find('.close').trigger('click');
                });
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
        controller:function ($scope, $element) {
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
                goToPosition(_commenting, function(){
                    _commenting.find('.form-control').focus();
                });

                $scope.replyTo = commentOB.user.name;
                comment.replyTo = commentOB.user.name;
            };
            $scope.addComment = function(commentTxt){
                comment.txt = commentTxt;
                $scope.onadd({comment:comment,success:function(data){// ajax 成功时
                    goToPosition($element);
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

                        goToPosition($element);
                        $scope.pushList(d);
                        console.log(data);
                    }
                    comment.replyTo = false;
                }});

            };
            $scope.pushList = function(item){
                $scope.list.unshift(item);
            };
            function goToPosition($tarEle, callback){
                var pos = $tarEle.position();
                angular.element('html,body').animate({scrollTop: pos.top},'slow', 'swing', callback);
            }

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

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
ispaceControllers.controller('formPublishCtrl',['$scope', '$element', '$resource',function($scope, $element, $resource){
    var article = {};

    $scope.isShowBtn = false;
    $scope.inptRows = 1;
    $scope.showBtn = function(){
        $scope.isShowBtn = true;
        $scope.inptRows = 3;
    };
    $scope.inputMsg = '';
    $scope.listImg = [// 假数据，演示用
        {
            imgUrl: 'images/temp/pic.jpg',
            id: '23213'
        },
        {
            imgUrl: 'images/temp/pic.jpg',
            id: '23213'
        },
        {
            imgUrl: 'images/temp/pic.jpg',
            id: '23213'
        },
        {
            imgUrl: 'images/temp/pic.jpg',
            id: '23213'
        },
        {
            imgUrl: 'images/temp/pic.jpg',
            id: '23213'
        },
        {
            imgUrl: 'images/temp/pic.jpg',
            progress: '23'
        },
        {
            imgUrl: 'images/temp/pic.jpg',
            progress: '46'
        }
    ];
    var File = $resource('api/file/:id');
    var img;
    $scope.uploadImg = function(){
        //点添加图片按钮执行此方法
        var data = {
            url: '',
            fileName: ''
        };
        img = File.save(data, function(){
            $scope.listImg = img;
        });
    };
    $scope.removeImg = function(id){
        //点移除图片时执行此方法
        img.$remove({id:id});
    };

    $scope.listFile = [// 假数据，演示用
        {
            id: '23213',
            name: '托福听力强化课程标准化教案第一课.doc',
            type: 'doc'
        },
        {
            id: '23213',
            name: '托福听力强化课程标准化教案第一课.pptv',
            type: 'ppt'
        }
    ];
    $scope.uploadFileData = {
        progress: 40
    };
    var file;
    $scope.uploadFile = function(){
        //点上传文件按钮执行此方法
        var data = {
            url: '',
            fileName: ''
        };
        file = File.save(data,function(){
            $scope.listFile = file;
        });
    };
    $scope.cancelUploadFile = function(){
        //点取消上传文件按钮执行此方法
    };
    $scope.removeFile = function(id){
        //点移除文件时执行此方法
        file.$remove({id:id});
    };

    $scope.listVideo = [// 假数据，演示用
        {
            id: '23213',
            name: '托福听力强化课程标准化教案第一课.mov'
        },
        {
            id: '23213',
            name: '托福听力强化课程标准化教案第一课.mp4'
        }
    ];
    $scope.uploadVideoData = {
        progress: 60
    };
    var video;
    $scope.uploadVideo = function(){
        //点上传文件按钮执行此方法
        var data = {
            url: '',
            fileName: ''
        };
        video = File.save(data,function(){
            $scope.listVideo = video;
        });
    };
    $scope.cancelUploadVideo = function(){
        //点取消上传文件按钮执行此方法
    };
    $scope.removeVideo = function(id){
        //点移除文件时执行此方法
        video.$remove({id:id});
    };

    var $mention = $element.find('.mention');
    $mention.popover({
        title: '@提及',
        html: true,
        placement: 'bottom',
        template: '#mentionPopover'
    });

    //$element.find('.list-tags .tag').tooltip();

    $scope.mentionPersons = [
        {
            id: '325325',
            name: '杨义锋',
            userName: 'yangyifeng2'
        },
        {
            id: '325325',
            name: '杨义锋',
            userName: 'yangyifeng2'
        }
    ];
    var Mention = $resource('api/user/mention/:id');
    $scope.removePerson = function(id){
        //点移除@提及的用户时执行此方法
        Mention.remove({id:id});
    };

    $scope.pubType = 'txt';

    $scope.submit = function(){
        if($scope.inputMsg){
            article.content = $scope.inputMsg;
            article.type = $scope.pubType;
            $scope.pubType = 'txt';
            $scope.addArticle(article);
            $element[0].reset();
        }
    };

}]);

/* 文章列表模块 */
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
        Article.removeComment({id:id}, success, error);
    };

    $scope.favArticle = function(id, success, error){
        Article.fav({id:id}, success, error);
    };

    $scope.likeArticle = function(id, success, error){
        Article.like({id:id}, success, error);
    };
}]);

ispaceControllers.controller('recentVisitorsCtrl', ['$scope', '$resource', function($scope, $resource) {
    var recentVisitors = [];
    var index = 0;
    var span = 10;
    var visitorCount = 98;
    var Visitor = $resource('api/user/recentVisitors');
    recentVisitors = Visitor.query(function(){
        visitorCount = recentVisitors.length;
        $scope.recentVisitors = recentVisitors.slice(0,span);
    });

    $scope.disabledPrev = true;
    $scope.disabledNext = false;

    $scope.navigator = function(direct){
        var maxIndex = Math.ceil(visitorCount/span)-1;
        var yush = visitorCount%span;
        if(direct === 'prev'){

            if(index > 0){
                $scope.recentVisitors = recentVisitors.slice((index-1)*span, index*span);
                if(index === 1){
                    $scope.disabledPrev = true;
                }
                $scope.disabledNext = false;
                --index;
            }
        } else if(direct === 'next'){
            if(index < maxIndex){

                $scope.recentVisitors = recentVisitors.slice((index+1)*span, (index+2)*span);
                if(index === maxIndex-1){
                    $scope.disabledNext = true;
                }
                $scope.disabledPrev = false;
                index++;
            }
        }

    };


}]);

ispaceControllers.controller('mayKnowCtrl', ['$scope', '$resource', function($scope, $resource) {
    var MayKnow = $resource('api/user/mayKnow');
    var mayKnowList = MayKnow.query(function(){
        $scope.mayKnowList = mayKnowList;
    });
    $scope.doFollow = function(id){
        var Follow = $resource('api/user/follow');
        Follow.save({id:id});
    };
}]);

ispaceControllers.controller('hotPersonCtrl', ['$scope', '$resource', function($scope, $resource) {
    var HotPerson = $resource('api/public/hotPerson');
    var hotPersonList = HotPerson.query(function(){
        $scope.hotPersonList = hotPersonList;
    });
}]);

ispaceControllers.controller('hotGroupCtrl', ['$scope', '$resource', function($scope, $resource) {
    var HotGroup = $resource('api/public/hotGroup');
    var hotGroupList = HotGroup.query(function(){
        $scope.hotGroupList = hotGroupList;
    });
}]);
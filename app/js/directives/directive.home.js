/**
 * Created by wqh on 2014-06-09.
 */
'use strict';

ispaceDirectives.directive('myHome', function() {
    return {
        restrict: 'EA',
        replace: true,
        templateUrl: 'partials/home-directive.html',
        controller: ['$scope', 'Group', 'User', '$resource', function( $scope, Group, User, $resource) {

            /* 我的圈子 */
            $scope.myGroup = {
                title: '我的圈子',
                link: '#mygroup/',
                list: []
            };
            $scope.myGroup.list = Group.query();

            /* 我的个人信息 */
            var myInfo  = User.info(function(){
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


        }]
    };
});
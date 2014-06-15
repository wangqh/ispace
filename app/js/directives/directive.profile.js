/**
 * Created by wqh on 2014-06-09.
 */
'use strict';

ispaceDirectives.directive('myProfile', function() {
    return {
        restrict: 'EA',
        scope: {
            visitorid: '@'
        },
        replace: true,
        templateUrl: 'partials/profile-directive.html',
        controller: ['$scope', 'Group', 'User', '$resource', '$element', '$location', '$http', function( $scope, Group, User, $resource, $element, $location, $http) {
            var profileData = null;

            /* 用于获得档案页面人员的id , 用于下面的ajax请求，如果是自己的档案profileData为null,
            ** 否则请求对应id的数据profileData = {id: profilePerson.id} 
            ** 建议从location中获得id，$location.path() => /uid1234 */
            var profilePerson = User.get({op: 'profileId'}, function(){// return {'id': 'uid1234'}
                if($scope.visitorid === profilePerson.id) {
                    $scope.isMyProfile = true;
                    profileData = null;
                } else {
                    $scope.isMyProfile = false;
                    profileData = {id: profilePerson.id};
                }

            });


            /* 个人信息 */
            var profileInfo  = User.info(profileData, function(){
                $scope.profileInfo = profileInfo;
            });

            /* 标签 */
            $scope.tags = User.getTags();
            
            $scope.addTag = function(){
                $scope.tagEditing = true;
            };
            $scope.removeTag = function(id){
                if($scope.isMyProfile){
                    User.removeTag({id: id},function(data){
                        $scope.tags = data;
                    },function(){// 测试
                        $scope.tags.forEach(function(tag, i){
                            if(tag.id == id){
                                $scope.tags.splice(i,1);
                            }
                        });
                    });
                }
                
            };
            $scope.saveTag = function(){
                if($scope.newTag && $scope.isMyProfile){
                    User.addTag({name: $scope.newTag}, function(data){
                        $scope.tags = data;
                        $scope.tagEditing = false;
                        $scope.newTag = '';
                    },function(){// 测试
                        var id = new Date().getTime();
                        $scope.tags.push({name: $scope.newTag, id: id});
                        $scope.tagEditing = false;
                        $scope.newTag = '';
                    });

                }
            };
            
            /* 右侧TAb模块 */
            $scope.modTab = {
                current: 'teamMembers'
            };
            $scope.modTab.getTeam = function(){
                $scope.modTab.current = 'teamMembers';
            };
            $scope.modTab.getOrg = function(){
                $scope.modTab.current = 'orgRelation';
            };
            $scope.teamMembers = User.getTeamMembers();
            $scope.orgRelationList = User.getOrgRelation();

            /* 技能认可模块 */
            $scope.skill = {
                editing: false,
                save: null
            };
            $scope.listSkill = User.getListSkill();
            $scope.approveSkill = function(skill){
                if(!skill.approved){
                    User.approveSkill({uid: profileInfo.id, id: skill.id}, null, function(){
                        skill.approved = true;
                    },function(){//测试
                        skill.approved = true;
                    });
                } else {
                    alert('已认可！');
                }
            };

            $scope.allApprover = {
                list: []
            };
            $scope.openAllApprover = function(skill){
                //$scope.allApprover.pages = skill.count;
                var range = 5;//每页几条
                var count = Math.ceil(skill.count/range);//页数
                $scope.allApprover.pages = [];
                $scope.allApprover.index = 0;
                for (var i = 0; i < count; i++) {
                    $scope.allApprover.pages.push(i+1);
                }

                $scope.allApprover.getPage(0);
            };
            $scope.allApprover.getPage = function(index){
                $scope.allApprover.list = User.getApprovers({pageIndex: index}, function(){
                    angular.element('#modalAllApprover').modal({backdrop: true});
                });
            };

            /*日期select数据*/
            function dateSelectData(){
                $scope.date = {
                    year: [],
                    month: [],
                    date: []
                };
                var yearStart = 1960;
                var yearEnd = new Date().getFullYear();
                while(yearStart <= yearEnd){
                    $scope.date.year.push(yearStart++);
                }
                var month = 1;
                while(month <= 12){
                    $scope.date.month.push(month++);
                }
                var date = 1;
                while(date <= 31){
                    $scope.date.date.push(date++);
                }

            }
            dateSelectData();


            /* 基本资料模块 */
            $scope.basic = {
                editing: false,
                fields: {}
            };
            $scope.arrayConstellation = ['白羊座', '金牛座', '双子座', '巨蟹座', '狮子座', '处女座', '天秤座', '天蝎座', '射手座', '摩羯座', '水瓶座', '双鱼座'];
            $scope.arrayEducation = ['高中', '大专', '本科', '硕士', '博士', '博士后'];

            var cities = $http.get('js/components/cities.json');
            cities.success(function(data) {  
                $scope.cities = data; 
              });

            var basicInfo = User.getBasic(profileData, function(){
                $scope.basic.fields = basicInfo;
                $scope.changeSubCities();
            });

            $scope.changeSubCities = function(){
                for(var i in $scope.cities){
                    if($scope.cities[i].name === $scope.basic.fields.nativeplace.province){
                        $scope.subCities = $scope.cities[i].cities;
                    }
                }
            };

            $scope.basic.save = function(){
                $scope.basic.editing = false;
                basicInfo.$save({opp:'profile', op:'basic'});
            };
            
            /* 联系方式模块 */
            $scope.contact = {
                editing: false,
                fields: {}
            };

            var contactInfo = User.getContact(profileData, function(){
                $scope.contact.fields = contactInfo;
            });

            $scope.contact.save = function(){
                $scope.contact.editing = false;
                contactInfo.$save({opp:'profile', op:'contact'});
            };
              
            /* 工作经历模块 */
            $scope.experience = {
                editing: false,
                fields: {},
                newItem: {}
            };
            function initExperienceNewItem(){
                $scope.experience.newItem = {
                    id: 'eid' + new Date().getTime(),
                    jobTitle: '',
                    company: '',
                    date: {
                        start: {
                            year: 2012,
                            month: 1
                        },
                        end: {
                            year: 2014,
                            month: 1
                        }
                    }
                };
            }
            initExperienceNewItem();

            var experienceInfo = User.getExperience(profileData, function(){
                $scope.experience.fields = experienceInfo;
            });

            $scope.experience.addItem = function(){
                var result = true;
                for(var i in $scope.experience.newItem){
                    if(!$scope.experience.newItem[i]){
                        result = false;
                    }
                }
                if(result){
                    $scope.experience.fields.list.unshift($scope.experience.newItem);
                    initExperienceNewItem();
                }
            };

            $scope.experience.delItem = function(item){
                var arr = [];
                for(var i in $scope.experience.fields.list){
                    if($scope.experience.fields.list[i].id !== item.id){
                        arr.push($scope.experience.fields.list[i]);
                    }
                }
                $scope.experience.fields.list = arr;
            };

            $scope.experience.save = function(){
                $scope.experience.editing = false;
                experienceInfo.$save({opp:'profile', op:'experience'});
            };
            

        }]
    };
});
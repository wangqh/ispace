/**
 * Created by wqh on 2014-06-09.
 */
'use strict';

ispaceDirectives.directive('myVideo',  function($sce) {
    return {
        restrict: 'EA',
        scope:{
            vid: '@'
        },
        replace: true,
        templateUrl: 'partials/video-directive.html',
        controller: function ($scope) {
            $scope.videoUrl = $sce.trustAsResourceUrl('http://union.bokecc.com/player?vid='+ $scope.vid +'&siteid=B47D5D75B8086E19&autoStart=false&width=100%&height=400&playerid=6804363A07E3D55F&playertype=1');
        }
    };
});
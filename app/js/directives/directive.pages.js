/**
 * Created by wqh on 2014-06-09.
 */
'use strict';

ispaceDirectives.directive('myPages',  function() {
    return {
        restrict: 'EA',
        scope:{
            pages: '=',
            index: '=',
            nav: '&'
        },
        replace: true,
        templateUrl: 'partials/pages-directive.html',
        controller: function ($scope) {
            $scope.goToPage = function(i){
                $scope.nav({index: i});
                $scope.index = i;
            }
        }
    };
});
/**
 * Created by wqh on 2014-06-09.
 */
'use strict';

ispaceDirectives.directive('myFooter',  function() {
    return {
        restrict: 'EA',
        replace: true,
        templateUrl: 'partials/footer-directive.html',
        controller: [ function(){ }]
    };
});
'use strict';

/* jasmine specs for controllers go here */

describe('controllers', function(){
    beforeEach(function(){
        this.addMatchers({
            toEqualData: function(expected) {
                return angular.equals(this.actual, expected);
            }
        });
    });

    beforeEach(module('ispaceApp'));
    beforeEach(module('ispace.services'));

    describe('headerCtrl', function(){
        var scope, ctrl, $httpBackend;

        beforeEach(inject(function(_$httpBackend_, $rootScope, $controller) {
            $httpBackend = _$httpBackend_;
            $httpBackend.expectGET('api/user/notify?type=count').
                respond(20);

            scope = $rootScope.$new();
            ctrl = $controller('headerCtrl', {$scope: scope});
        }));


        it('should create notify model with notify counts from xhr', function() {
            expect(scope.notify.count).toBe(0);
            $httpBackend.flush();
            expect(scope.notify.count).toBe(20);
        });


    });

    describe('homeCtrl', function(){
        var scope, $httpBackend, ctrl,
            group1Data = function() {
                return [{
                    imgUrl: 'images/temp/face.jpg',
                    link: '##',
                    title: '集团知识管理群'
                },
                {
                    imgUrl: 'images/temp/face.jpg',
                    link: '##',
                    title: '集团知识管理群22'
                }]
            };


        beforeEach(inject(function(_$httpBackend_, $rootScope,  $controller) {
            $httpBackend = _$httpBackend_;
            $httpBackend.expectGET('api/user/group/groups').respond(group1Data());

            scope = $rootScope.$new();
            ctrl = $controller('homeCtrl', {$scope: scope});
        }));


        it('should fetch groups list', function() {
            expect(scope.myGroup.list).toEqualData([]);
            $httpBackend.flush();

            expect(scope.myGroup.list).toEqualData(group1Data());
        });
    });



});

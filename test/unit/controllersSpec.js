'use strict';

/* jasmine specs for controllers go here */

describe('controllers', function(){
  beforeEach(module('ispace.controllers'));


  it('should ....', inject(function($controller) {
    //spec body
    var homeCtrl = $controller('homeCtrl', { $scope: {} });
    expect(homeCtrl).toBeDefined();
  }));

});

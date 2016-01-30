var should = require('should');
var places = require('../places');

describe('places', function() {
    describe('listAllNames()', function() {
        it('should return empty array if argument is empty array', function() {
            places.listAllNames([]).should.deepEqual([]);
        });
        it('should return array of names if array of objects is passed as argument',
           function() {
               var input = [{name: 'Pet Shop'}, {name: 'Cheese Shop'}];
               var expectedValue = ['Pet Shop', 'Cheese Shop'];
               places.listAllNames(input).should.deepEqual(expectedValue);
           });
    });
    // describe('random()', function() {
    //     assert(false);
    // });
    // describe('details()', function() {
    //     assert(false);
    // });
});

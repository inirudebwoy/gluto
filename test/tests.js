var assert = require('assert');
describe('Array', function() {
  describe('#indexOf()', function () {
    it('should return -1 when the value is not present', function () {
      assert.equal(-1, [1,2,3].indexOf(5));
      assert.equal(-1, [1,2,3].indexOf(0));
    });
  });
});

var places = require('../places');

describe('places', function() {
    describe('listAllNames()', function() {
        it('should return empty array if argument is empty array', function() {
            assert.equal(places.listAllNames([]), []);
        });
    });
    describe('recommend()', function() {
        assert(true);
    });
    describe('random()', function() {
        assert(true);
    });
    describe('details()', function() {
        assert(true);
    });
});

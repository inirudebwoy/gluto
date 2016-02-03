var should = require('should');
var rewire = require('rewire');
var places = rewire('../places');

describe('places', function() {
    describe('listAllNames()', function() {
        var listAllNames = places.__get__('listAllNames');

        it('should return empty array if argument is empty array', function() {
            listAllNames([]).should.deepEqual([]);
        });
        it('should return array of names if array of objects is passed as argument',
           function() {
               var input = [{name: 'Pet Shop'}, {name: 'Cheese Shop'}];
               var expectedValue = ['Pet Shop', 'Cheese Shop'];
               listAllNames(input).should.deepEqual(expectedValue);
           });
    });

    describe('_details()', function() {
        var _details = places.__get__('_details');

        it('should return text if name is not found in empty array', function() {
            var inName = 'elephant';
            var inList = [];
            _details(inName, inList).should.deepEqual(['Location not found.']);
        });

        it('should return text if name is not found in non-empty array', function() {
            var inName = 'elephant';
            var inList = [{name: 'Cat'}, {name: 'Cats'}, {name: 'Dog'}];
            var expected = ['Location not found.'];
            _details(inName, inList).should.deepEqual(expected);
        });

        it('should return information about existing element in array', function() {
            var inName = 'cat';
            var inList = [{name: 'Cat', address: 'litter box', menu: 'fish!', icon: 'cat'},
                          {name: 'Cats'},
                          {name: 'Dog'}];
            var expected = ['Cat cat', 'address: litter box', 'menu: fish!'];

            _details(inName, inList).should.deepEqual(expected);
        });
    });

    describe('_match()', function() {
        var _match = places.__get__('_match');

        it('should return empty list if element is not found', function() {
            var inName = 'cheddar';
            var inList = [{name: 'Mimolette'}];

            _match(inName, inList).should.deepEqual([]);
        });

        it('should return list with found element if name where with different case',
           function() {
               var inName = 'CheddAR';
               var inList = [{name: 'Cheddar'}];

               _match(inName, inList).should.deepEqual([{name: 'Cheddar'}]);
        });

        it('should return list with found element if name had same case', function() {
            var inName = 'Cheddar';
            var inList = [{name: 'Cheddar'}];

            _match(inName, inList).should.deepEqual([{name: 'Cheddar'}]);
        });
    });

});

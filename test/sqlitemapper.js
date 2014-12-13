var mocha         = require('mocha')
  , chai          = require('chai')
  , Q             = require('q')
  , SqliteMapper  = require('../lib/sqlitemapper')
  , expect        = chai.expect
  ;


describe('SqliteMapper', function() {

  it('should throw an execption if no db path is provided', function() {
    var constructor = function() {
      var sut = new SqliteMapper();
    };
    expect(constructor).to.throw('SqliteMapper requires a path')
  })
  
  describe('#executeNonQuery', function() {
  
  });

  describe('#executeReader', function() {

  });

  describe('#executeReaderList', function() {

  });
  
});

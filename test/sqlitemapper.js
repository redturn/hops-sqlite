var fs            = require('fs')
  , mocha         = require('mocha')
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
    expect(constructor).to.throw('SqliteMapper requires a path');
  });
  

  describe('#run', function() {
    var path = './test/fixtures/write.db';

    before(function(done) {
      fs.unlink(path, function() {
        done();
      });
    });

    it('should work for CREATE statements', function(done) {
      var sut = new SqliteMapper(path);
      sut.run('create table test (idtest integer primary key);', function(err, result) {                
        expect(err).to.be.null;
        expect(result.lastID).to.equal(0);
        expect(result.changes).to.equal(0);
        done();
      });
    });

    it('should work for INSERT statement without params', function(done) {
      var sut = new SqliteMapper(path);
      sut.run('insert into test values(1);', function(err, result) {
        expect(err).to.be.null;
        expect(result.lastID).to.equal(1);
        expect(result.changes).to.equal(1);
        done();
      });
    });

    it('should work for INSERT statements with params', function(done) {
      var sut = new SqliteMapper(path)
        , params = { $id: 2 }
        ;
      sut.run('insert into test values($id);', params, function(err, result) {
        expect(err).to.be.null;
        expect(result.lastID).to.equal(2);
        expect(result.changes).to.equal(1);
        done();
      });
    });

    it('should work for UPDATE statements without params', function(done) {
      var sut = new SqliteMapper(path);      
      sut.run('update test set idtest = 3 where idtest = 2;', function(err, result) {
        expect(err).to.be.null;
        expect(result.lastID).to.equal(0);
        expect(result.changes).to.equal(1);
        done();
      });
    });

    it('should work for UPDATE statements with params', function(done) {
      var sut = new SqliteMapper(path)
        , params = { $id: 3 }
        ;
      sut.run('update test set idtest = 2 where idtest = $id;', params, function(err, result) {
        expect(err).to.be.null;
        expect(result.lastID).to.equal(0);
        expect(result.changes).to.equal(1);
        done();
      });
    });

    it('should work for DELETE statements without params', function(done) {
      var sut = new SqliteMapper(path);      
      sut.run('delete from test where idtest = 2;', function(err, result) {
        expect(err).to.be.null;
        expect(result.lastID).to.equal(0);
        expect(result.changes).to.equal(1);
        done();
      });
    });

    it('should work for DELETE statements with params', function(done) {
      var sut = new SqliteMapper(path)
        , params = { $id: 1 }
        ;
      sut.run('delete from test where idtest = $id;', params, function(err, result) {
        expect(err).to.be.null;
        expect(result.lastID).to.equal(0);
        expect(result.changes).to.equal(1);
        done();
      });
    });

    it('should work with promises without params', function(done) {
      var sut = new SqliteMapper(path);
      sut.run('insert into test values(1);')
      .then(function(result) {        
        expect(result.lastID).to.equal(1);
        expect(result.changes).to.equal(1);
        done();
      })
      .fail(function(err) {
        done(err);
      });
    });

    it('should work with promises with params', function(done) {
      var sut = new SqliteMapper(path)
        , params = { $id: 2 }
        ;
      sut.run('insert into test values($id);', params)
      .then(function(result) {        
        expect(result.lastID).to.equal(2);
        expect(result.changes).to.equal(1);
        done();
      })
      .fail(function(err) {
        done(err);
      });
    });

    it('should work for DROP statements', function(done) {
      var sut = new SqliteMapper(path);
      sut.run('drop table test;', function(err, result) {                
        expect(err).to.be.null;
        expect(result.lastID).to.equal(0);
        expect(result.changes).to.equal(0);
        done();
      });
    });

  });



  describe('#get', function() {
    var path = './test/fixtures/get.db';

    before(function(done) {
      var sut;
      if(!fs.existsSync(path)) {
        sut = new SqliteMapper(path);
        Q.fcall(function() {
          return sut.run('create table data (id integer primary key autoincrement, stuff varchar(255));');
        })          
        .then(function() {
          return sut.run('insert into data (stuff) values ("row 1");');
        })
        .then(function() { 
          return sut.run('insert into data (stuff) values ("row 2");');
        })
        .then(function() { 
          return sut.run('insert into data (stuff) values ("row 3");');
        })
        .then(function() { 
          return sut.run('insert into data (stuff) values ("row 4");');
        })
        .then(function() {
          return sut.run('insert into data (stuff) values ("row 5");');            
        })
        .then(function() {
          done();
        });        
      } else { 
        done();
      }
    });

    it('should work for SELECT without params', function(done) {
      var sut = new SqliteMapper(path);
      sut.get('select * from data where id = 1', function(err, result) {
        expect(err).to.be.null;
        expect(result.id).to.equal(1);
        expect(result.stuff).to.equal('row 1');
        done();
      });      
    });

    it('should work for SELECT with params', function(done) {
      var sut = new SqliteMapper(path)
        , params = { $id: 2 }
        ;
      sut.get('select * from data where id = $id', params, function(err, result) {
        expect(err).to.be.null;
        expect(result.id).to.equal(2);
        expect(result.stuff).to.equal('row 2');
        done();
      });      
    });

    it('should work with promises without params', function(done) {
      var sut = new SqliteMapper(path);
      sut.get('select * from data where id = 1')
      .then(function(result) {        
        expect(result.id).to.equal(1);
        expect(result.stuff).to.equal('row 1');
        done();
      })
      .fail(function(err) {
        done(err);
      });
    });

    it('should work with promises with params', function(done) {
      var sut = new SqliteMapper(path)
        , params = { $id: 2 }
        ;
      sut.get('select * from data where id = $id', params)
      .then(function(result) {        
        expect(result.id).to.equal(2);
        expect(result.stuff).to.equal('row 2');
        done();
      })
      .fail(function(err) {
        done(err);
      });
    });

  });



  describe('#all', function() {
    var path = './test/fixtures/all.db';

    before(function(done) {
      var sut;
      if(!fs.existsSync(path)) {
        sut = new SqliteMapper(path);
        Q.fcall(function() {
          return sut.run('create table data (id integer primary key autoincrement, stuff varchar(255));');
        })          
        .then(function() {
          return sut.run('insert into data (stuff) values ("row 1");');
        })
        .then(function() { 
          return sut.run('insert into data (stuff) values ("row 2");');
        })
        .then(function() { 
          return sut.run('insert into data (stuff) values ("row 3");');
        })
        .then(function() { 
          return sut.run('insert into data (stuff) values ("row 4");');
        })
        .then(function() {
          return sut.run('insert into data (stuff) values ("row 5");');            
        })
        .then(function() {
          done();
        });        
      } else { 
        done();
      }
    });

    it('should work for SELECT without params', function(done) {
      var sut = new SqliteMapper(path);
      sut.all('select * from data where id > 1', function(err, result) {
        expect(err).to.be.null;
        expect(result.length).to.equal(4);
        expect(result[0].id).to.equal(2);
        expect(result[0].stuff).to.equal('row 2');
        done();
      });      
    });

    it('should work for SELECT with params', function(done) {
      var sut = new SqliteMapper(path)
        , params = { $id: 1 }
        ;
      sut.all('select * from data where id > $id', params, function(err, result) {
        expect(err).to.be.null;
        expect(result.length).to.equal(4);
        expect(result[0].id).to.equal(2);
        expect(result[0].stuff).to.equal('row 2');
        done();
      });      
    });

    it('should work with promises without params', function(done) {
      var sut = new SqliteMapper(path);
      sut.all('select * from data where id > 1')
      .then(function(result) {                
        expect(result.length).to.equal(4);
        expect(result[0].id).to.equal(2);
        expect(result[0].stuff).to.equal('row 2');
        done();
      })
      .fail(function(err) {
        done(err);
      });
    });

    it('should work with promises with params', function(done) {
      var sut = new SqliteMapper(path)
        , params = { $id: 1 }
        ;
      sut.all('select * from data where id > $id', params)
      .then(function(result) {        
        expect(result.length).to.equal(4);
        expect(result[0].id).to.equal(2);
        expect(result[0].stuff).to.equal('row 2');
        done();
      })
      .fail(function(err) {
        done(err);
      });
    });
  });
  
});

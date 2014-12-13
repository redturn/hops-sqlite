var util       = require('util')
  , sqlite3    = require('sqlite3').verbose()
  , Q          = require('q');

  
function SqliteMapper(path) {
  if(!path) {
    throw new Error('SqliteMapper requires a path');
  }

  this.db = new sqlite3.Database(path);
}

module.exports = SqliteMapper;


SqliteMapper.prototype.executeNonQuery = function run() {
  var deferred  = new Q.defer()
    , sql       = arguments[0]
    , params    = arguments.length === 3 ? arguments[1] : undefined
    , next      = arguments[2]
    ;

  if(!sql) {
    deferred.reject(new Error('sql must be supplied'));
  }

  this.db.run(sql, params, function(err, result) {
    if(err) deferred.reject(err);
    else {
      if(result) {
        deferred.resolve(result);
      } else {
        deferred.resolve({
          lastID: this.lastID,
          changes: this.changes
        });
      }
    }
  });

  return deferred
    .promise
    .nodeify(next);
};

SqliteMapper.prototype.executeReader = function get() {
  var deferred  = new Q.defer()
    , sql       = arguments[0]
    , params    = arguments.length === 3 ? arguments[1] : undefined
    , next      = arguments[2]
    ;
  
  if(!sql) {
    deferred.reject(new Error('sql must be supplied'));
  }

  this.db.get(sql, params, function(err, row) {
    if(err) deferred.reject(err);
    else {
      deferred.resolve(row);
    }
  });

  return deferred
    .promise
    .nodeify(next);
};


SqliteMapper.prototype.executeReaderList = function() {
  var deferred    = new Q.defer()
    , sql         = arguments[0]
    , params      = arguments.length === 3 ? arguments[1]: undefined
    , next        = arguments[2]
    ;

  if(!sql) {
    deferred.reject(new Error('sql must be supplied'));
  }

  this.db.all(sql, params, function(err, rows) {
    if(err) deferred.reject(err);
    else {
      deferred.resolve(rows);
    }
  });

  return deferred
    .promise
    .nodeify(next);
};


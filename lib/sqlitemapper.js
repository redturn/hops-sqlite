var util       = require('util')
  , sqlite3    = require('sqlite3').verbose()
  , Q          = require('q');


/**
 * Base class for Sqlite DataMappers
 * @constructor
 * @param {string} path - The path to the Sqlite database
 */
function SqliteMapper(path) {
  if(!path) {
    throw new Error('SqliteMapper requires a path');
  }

  this.db = new sqlite3.Database(path);
}


/**
 * Export the constructor
 */
module.exports = SqliteMapper;


/**
 * Runs INSERT, UPDATE, DELETE statements
 * @param {String} sql - The SQL statement to execute
 * @param {Object} [params] - The optional params to apply to the statement
 * @param {Function} [next] - The optional callback to exdcute
 * @return {Promise} - Will resolve to an object with lastID and changes
 */
SqliteMapper.prototype.run = function runs() {
  var deferred  = new Q.defer()
    , sql       = getSqlArg(arguments)
    , params    = getParamArg(arguments)
    , next      = getNextArg(arguments)
    ;
  
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


/**
 * Runs a SELECT for a single row result
 * @param {string} sql - The SQL statement to execute
 * @param {object} [params] - The optional params to apply to the statement
 * @param {function} [next] - The optional callback to exdcute
 * @return {Promise} - Will resolve with the found record
 */
SqliteMapper.prototype.get = function get() {
  var deferred  = new Q.defer()
    , sql       = getSqlArg(arguments)
    , params    = getParamArg(arguments)
    , next      = getNextArg(arguments)
    ;

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


/**
 * Runs a SELECT for a all rows in the statement
 * @param {string} sql - The SQL statement to execute
 * @param {object} [params] - The optional params to apply to the statement
 * @param {function} [next] - The optional callback to exdcute
 * @return {Promise} - Will resolve with the found records as an array 
 */
SqliteMapper.prototype.all = function all() {
  var deferred  = new Q.defer()
    , sql       = getSqlArg(arguments)
    , params    = getParamArg(arguments)
    , next      = getNextArg(arguments)
    ;

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


/**
 * Get the sql params from the arguments
 * @private
 * @param {Arguments} 
 */
function getSqlArg(args) {
  return args[0];
}

/**
 * Get the param params from the arguments
 * @private
 * @param {Arguments} 
 */
function getParamArg(args) {  
  if(Object.prototype.toString.call(args[1]) === '[object Object]') {
    return args[1];
  } else {
    return undefined;
  }
}

/**
 * Get the callback params from the arguments
 * @private
 * @param {Arguments} 
 */
function getNextArg(args) {  
  if(args.length === 3) {
    return args[2];  
  }
  else if(Object.prototype.toString.call(args[1]) === '[object Function]') {
    return args[1];  
  } 
  else {
    return undefined;
  }
}